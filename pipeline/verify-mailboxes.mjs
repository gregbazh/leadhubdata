// Mailbox-level email verification via SMTP probing (free, no API).
//
// For each email's domain this connects to its mail server on port 25 and
// asks "RCPT TO:<address>" without ever sending a message, then hangs up.
// The server's reply reveals whether the individual mailbox exists -- this is
// the check that MX lookups (clean-list.mjs) can't do, and it's exactly what
// would have caught paul@bailbonds.com and licensing@allstarfg.com.
//
// Statuses written to the smtp_status column:
//   valid        server confirmed the mailbox exists
//   invalid      server explicitly said "user unknown" (would hard-bounce)
//   accept_all   server accepts every address, so it can't be verified
//                (deliverable in theory, but bounces still possible)
//   blocked      server rejected the PROBE (IP reputation / rDNS / policy),
//                which says nothing about the mailbox -- re-run from a VPS
//   unknown      greylisted / temporary error -- not proof either way
//   no_mx        domain has no mail server at all
//   conn_failed  couldn't reach the mail server (see ISP note below)
//
// Writes:
//   <input>.smtp-clean.csv     valid + accept_all rows (sendable)
//   <input>.smtp-verified.csv  every row with its smtp_status
// Results are cached in pipeline/.smtp-cache.json (30 days) so re-runs only
// probe new addresses.
//
// Usage:
//   node pipeline/verify-mailboxes.mjs deliverables/buyers_fl_insurance_agencies.clean.csv email
//   node pipeline/verify-mailboxes.mjs <csv> email --limit 100        (probe only first 100 unchecked)
//   node pipeline/verify-mailboxes.mjs <csv> email --concurrency 5
//
// IMPORTANT: most residential ISPs (Comcast, Spectrum, AT&T...) block
// outbound port 25 to fight spam. If every probe comes back conn_failed,
// that's your ISP, not the script -- run this from a cheap VPS instead
// (any $5 DigitalOcean/Hetzner box works; some clouds require a support
// ticket to open port 25).
import fs from "node:fs";
import net from "node:net";
import dns from "node:dns/promises";
import crypto from "node:crypto";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const CACHE_FILE = "pipeline/.smtp-cache.json";
const CACHE_TTL_MS = 30 * 24 * 3600 * 1000;
const CONNECT_TIMEOUT_MS = 12_000;
const COMMAND_TIMEOUT_MS = 15_000;
const MAX_RCPT_PER_CONN = 20;

// Identify ourselves with the real sending domain so probes look legitimate.
const HELO_DOMAIN = (process.env.RESEND_FROM || "").split("@")[1]?.replace(/>$/, "") || "tgautoblaster.com";
const MAIL_FROM = `probe@${HELO_DOMAIN}`;

const SENDABLE = new Set(["valid", "accept_all"]);

// ---------- tiny SMTP client ----------

class SmtpConn {
  constructor(host) {
    this.host = host;
    this.buf = "";
    this.waiters = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      const sock = net.createConnection({ host: this.host, port: 25 });
      this.sock = sock;
      const onErr = (e) => reject(e);
      sock.setTimeout(CONNECT_TIMEOUT_MS, () => { sock.destroy(); reject(new Error("connect timeout")); });
      sock.once("error", onErr);
      sock.once("connect", () => {
        sock.setTimeout(0);
        sock.removeListener("error", onErr);
        sock.on("error", () => this.failAll(new Error("socket error")));
        sock.on("close", () => this.failAll(new Error("connection closed")));
        sock.on("data", (d) => this.onData(d));
        resolve();
      });
    });
  }

  onData(d) {
    this.buf += d.toString("latin1");
    // SMTP replies may be multiline ("250-..."); the final line is "NNN <text>".
    let idx;
    while ((idx = this.buf.search(/^\d{3}[ \r]/m)) >= 0) {
      const end = this.buf.indexOf("\n", idx);
      if (end < 0) return;
      const reply = this.buf.slice(0, end + 1);
      this.buf = this.buf.slice(end + 1);
      const code = parseInt(reply.slice(idx, idx + 3), 10);
      const w = this.waiters.shift();
      if (w) { clearTimeout(w.timer); w.resolve({ code, text: reply.trim() }); }
    }
  }

  failAll(err) {
    while (this.waiters.length) {
      const w = this.waiters.shift();
      clearTimeout(w.timer);
      w.reject(err);
    }
  }

  reply() {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const i = this.waiters.findIndex((w) => w.timer === timer);
        if (i >= 0) this.waiters.splice(i, 1);
        reject(new Error("command timeout"));
      }, COMMAND_TIMEOUT_MS);
      this.waiters.push({ resolve, reject, timer });
    });
  }

  cmd(line) {
    this.sock.write(line + "\r\n");
    return this.reply();
  }

  destroy() {
    try { this.sock?.destroy(); } catch { /* already gone */ }
  }
}

// ---------- per-domain probing ----------

async function mxHosts(domain) {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length) return mx.sort((a, b) => a.priority - b.priority).map((r) => r.exchange);
  } catch { /* fall through */ }
  try {
    await dns.resolve(domain);
    return [domain]; // A-record fallback: some domains take mail directly
  } catch {
    return [];
  }
}

// Wording/status codes that mean the server rejected OUR PROBE (IP reputation,
// missing rDNS, SPF) rather than the mailbox. Treating these as "invalid" would
// throw away good addresses -- e.g. servers that delivered fine via Resend
// still 550 a probe coming from a residential IP.
const POLICY_RE = /5\.7\.\d|block|blacklis|spam|reputation|policy|denied|dynamic|residential|spamhaus|barracuda|proofpoint|banned|abuse|rbl|dnsbl|not authorized|access denied|prohibited|listed|bad reputation/i;
const USER_UNKNOWN_RE = /5\.1\.[01]|user unknown|unknown user|no such user|does not exist|invalid recipient|recipient not found|no mailbox|mailbox unavailable|address rejected|recipient rejected/i;

function classify(code, text) {
  if (code >= 200 && code < 300) return "valid";
  if (code >= 500 && code < 600) {
    if (USER_UNKNOWN_RE.test(text)) return "invalid";
    if (POLICY_RE.test(text)) return "blocked";
    // Ambiguous bare 5xx: don't risk dropping a live address.
    return "blocked";
  }
  return "unknown"; // 4xx: greylisting, throttling, temp failure
}

// Probe all `emails` at one domain. Returns Map(email -> status).
async function probeDomain(domain, emails) {
  const out = new Map();
  const hosts = await mxHosts(domain);
  if (!hosts.length) {
    for (const e of emails) out.set(e, "no_mx");
    return out;
  }

  let conn = null;
  let rcptCount = 0;
  let acceptAll = null; // determined once per domain

  const open = async () => {
    let lastErr;
    for (const host of hosts.slice(0, 3)) {
      const c = new SmtpConn(host);
      try {
        await c.connect();
        const greet = await c.reply();
        if (greet.code !== 220) throw Object.assign(new Error(`greeting: ${greet.text}`), { code: greet.code });
        let ehlo = await c.cmd(`EHLO ${HELO_DOMAIN}`);
        if (ehlo.code >= 400) ehlo = await c.cmd(`HELO ${HELO_DOMAIN}`);
        if (ehlo.code >= 400) throw Object.assign(new Error(`EHLO: ${ehlo.text}`), { code: ehlo.code });
        const mf = await c.cmd(`MAIL FROM:<${MAIL_FROM}>`);
        if (mf.code >= 400) throw Object.assign(new Error(`MAIL FROM: ${mf.text}`), { code: mf.code });
        rcptCount = 0;
        return c;
      } catch (e) {
        lastErr = e;
        c.destroy();
      }
    }
    throw lastErr || new Error("no reachable MX");
  };

  const rcpt = async (address) => {
    if (!conn || rcptCount >= MAX_RCPT_PER_CONN) {
      conn?.destroy();
      conn = await open();
    }
    rcptCount++;
    const r = await conn.cmd(`RCPT TO:<${address}>`);
    return classify(r.code, r.text);
  };

  try {
    conn = await open();

    // Canary probe with a random gibberish mailbox. Three outcomes:
    //   valid   -> server accepts anything (accept-all); "valid" is meaningless
    //   blocked -> server is rejecting our probe itself; nothing from this
    //              domain can be trusted, so skip it entirely
    //   invalid -> server genuinely validates mailboxes; results are reliable
    const canary = `zx-${crypto.randomBytes(6).toString("hex")}@${domain}`;
    let canaryStatus = null;
    try { canaryStatus = await rcpt(canary); } catch { canaryStatus = null; }
    acceptAll = canaryStatus === "valid";
    if (canaryStatus === "blocked") {
      for (const e of emails) out.set(e, "blocked");
      try { await conn.cmd("QUIT"); } catch { /* ignore */ }
      return out;
    }

    for (const email of emails) {
      try {
        const s = await rcpt(email);
        out.set(email, s === "valid" && acceptAll ? "accept_all" : s);
      } catch {
        out.set(email, "unknown");
      }
    }
    try { await conn.cmd("QUIT"); } catch { /* server may have hung up */ }
  } catch (e) {
    // A 5xx during the handshake is a policy rejection of the probe, not
    // evidence about any mailbox.
    const status = e?.code >= 500 ? "blocked" : "conn_failed";
    for (const em of emails) if (!out.has(em)) out.set(em, status);
  } finally {
    conn?.destroy();
  }
  return out;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

// ---------- main ----------

async function main() {
  const args = process.argv.slice(2);
  const [input, emailCol = "email"] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
  const argOf = (name, dflt) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : dflt;
  };
  const limit = parseInt(argOf("--limit", "0"), 10); // 0 = no limit
  const concurrency = parseInt(argOf("--concurrency", "8"), 10);

  if (!input || !fs.existsSync(input)) {
    console.error("Usage: node pipeline/verify-mailboxes.mjs <csv path> [emailColumn] [--limit N] [--concurrency N]");
    process.exit(1);
  }

  const rows = parse(fs.readFileSync(input, "utf8"), { columns: true });
  console.log(`Loaded ${rows.length} rows from ${input}`);
  console.log(`Probing as ${MAIL_FROM} (HELO ${HELO_DOMAIN})`);

  const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) : {};
  const now = Date.now();
  const fresh = (e) => cache[e] && now - new Date(cache[e].at).getTime() < CACHE_TTL_MS
    // transient / network-dependent results are always worth re-probing
    && !["conn_failed", "unknown", "blocked"].includes(cache[e].status);

  // Collect unchecked emails, grouped by domain.
  const byDomain = new Map();
  let queued = 0;
  for (const row of rows) {
    const email = (row[emailCol] || "").trim().toLowerCase();
    if (!email || !email.includes("@") || fresh(email)) continue;
    if (limit && queued >= limit) break;
    const domain = email.split("@")[1];
    if (!byDomain.has(domain)) byDomain.set(domain, new Set());
    if (!byDomain.get(domain).has(email)) {
      byDomain.get(domain).add(email);
      queued++;
    }
  }
  console.log(`${queued} unchecked emails across ${byDomain.size} domains (cached: ${Object.keys(cache).length})`);

  let done = 0;
  const saveCache = () => fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  await mapLimit([...byDomain.entries()], concurrency, async ([domain, emails]) => {
    const results = await probeDomain(domain, [...emails]);
    for (const [email, status] of results) {
      cache[email] = { status, at: new Date().toISOString() };
    }
    done++;
    if (done % 10 === 0 || done === byDomain.size) {
      saveCache();
      console.log(`  ...${done}/${byDomain.size} domains probed`);
    }
  });
  saveCache();

  // Annotate every row from cache and write outputs.
  const counts = {};
  const sendable = [];
  const annotated = rows.map((row) => {
    const email = (row[emailCol] || "").trim().toLowerCase();
    const status = cache[email]?.status || "unchecked";
    counts[status] = (counts[status] || 0) + 1;
    const r = { ...row, smtp_status: status };
    if (SENDABLE.has(status)) sendable.push(r);
    return r;
  });

  const base = input.replace(/\.csv$/i, "");
  fs.writeFileSync(`${base}.smtp-verified.csv`, stringify(annotated, { header: true }));

  console.log("");
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(12)} ${v}`);
  }
  console.log("");
  console.log(`FULL:     ${annotated.length} rows annotated -> ${base}.smtp-verified.csv`);
  if (counts.unchecked) {
    // Don't write a partial sendable list -- send-campaign.mjs would prefer it
    // over the complete .clean.csv and silently shrink the campaign.
    console.log(`PARTIAL:  ${counts.unchecked} rows still unchecked; not writing .smtp-clean.csv yet.`);
    console.log(`          Re-run without --limit (results are cached) to finish.`);
  } else {
    fs.writeFileSync(`${base}.smtp-clean.csv`, stringify(sendable, { header: true }));
    console.log(`SENDABLE: ${sendable.length} (valid + accept_all) -> ${base}.smtp-clean.csv`);
  }
  const unverifiable = (counts.conn_failed || 0) + (counts.blocked || 0);
  if (unverifiable > annotated.length * 0.5 && byDomain.size > 3) {
    console.log("");
    console.log("WARNING: most probes were blocked or couldn't connect. Residential IPs");
    console.log("have no mail-server reputation, so servers refuse them and ISPs often");
    console.log("block outbound port 25 entirely. Run this script from a VPS for real");
    console.log("results -- blocked/conn_failed rows are re-probed automatically.");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
