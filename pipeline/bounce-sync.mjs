// Sync delivery outcomes from Resend into a permanent local blocklist.
//
// Polls the Resend API for every email we've ever sent (from .sent-log.json),
// records each address's final status, and adds hard failures (bounced,
// complained, failed) to pipeline/.blocklist.json. send-campaign.mjs consults
// that file and will never mail a blocked address again -- even if it shows
// up in a future CSV.
//
// Also tracks bounces per domain: if a custom (non-freemail) domain has
// hard-bounced before, the sender skips other mailboxes at that domain too,
// mirroring Resend's own suppression behavior (e.g. bailbonds.com).
//
// Usage:
//   node pipeline/bounce-sync.mjs                     (sync + print summary)
//   node pipeline/bounce-sync.mjs --all               (re-check even terminal statuses)
//   node pipeline/bounce-sync.mjs --block a@b.com [reason]   (manually blocklist an
//                                                     address -- e.g. an unsubscribe
//                                                     forwarded by the inbound webhook)
//
// Run this after each campaign batch, ideally a few hours later so bounces
// have had time to come back.
import fs from "node:fs";

for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const SENT_LOG = "pipeline/.sent-log.json";
const BLOCKLIST = "pipeline/.blocklist.json";
const POLL_INTERVAL_MS = 600; // Resend allows 2 req/s

// Events that will never change again -- no need to re-poll these.
const TERMINAL = new Set(["delivered", "bounced", "complained", "failed", "canceled", "suppressed", "opened", "clicked"]);
// Events that mean "never mail this address again". "suppressed" = Resend
// itself refused to attempt delivery (usually a prior bounce at that domain).
const BLOCKING = new Set(["bounced", "complained", "failed", "suppressed"]);

export const FREEMAIL = new Set([
  "gmail.com", "yahoo.com", "aol.com", "msn.com", "hotmail.com", "outlook.com",
  "bellsouth.net", "comcast.net", "att.net", "icloud.com", "live.com",
  "verizon.net", "sbcglobal.net", "earthlink.net", "cox.net", "ymail.com",
  "mail.com", "gmx.com", "protonmail.com", "proton.me",
]);

function loadBlocklist() {
  if (!fs.existsSync(BLOCKLIST)) return { emails: {}, domains: {}, statuses: {} };
  const b = JSON.parse(fs.readFileSync(BLOCKLIST, "utf8"));
  return { emails: b.emails || {}, domains: b.domains || {}, statuses: b.statuses || {} };
}

async function fetchStatus(id) {
  const res = await fetch(`https://api.resend.com/emails/${id}`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);
  return data.last_event || "unknown";
}

// Manually add an address to the blocklist (no API call). Used to honor
// unsubscribe replies that the inbound webhook forwards to you.
function blockManually(email, reason) {
  const addr = (email || "").trim().toLowerCase();
  if (!addr || !addr.includes("@")) {
    console.error("Usage: node pipeline/bounce-sync.mjs --block someone@example.com [reason]");
    process.exit(1);
  }
  const block = loadBlocklist();
  block.emails[addr] = { reason: reason || "manual", at: new Date().toISOString(), source: "manual" };
  fs.writeFileSync(BLOCKLIST, JSON.stringify(block, null, 2));
  console.log(`Blocked ${addr} (${reason || "manual"}). Total blocked: ${Object.keys(block.emails).length}`);
}

async function main() {
  const blockIdx = process.argv.indexOf("--block");
  if (blockIdx >= 0) {
    blockManually(process.argv[blockIdx + 1], process.argv.slice(blockIdx + 2).join(" "));
    return;
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("Set RESEND_API_KEY in .env.local first.");
    process.exit(1);
  }
  const recheckAll = process.argv.includes("--all");
  const sentLog = fs.existsSync(SENT_LOG) ? JSON.parse(fs.readFileSync(SENT_LOG, "utf8")) : {};
  const block = loadBlocklist();

  const entries = Object.entries(sentLog).filter(([, v]) => v.id);
  const toCheck = entries.filter(([email]) => {
    const prev = block.statuses[email];
    return recheckAll || !prev || !TERMINAL.has(prev.last_event);
  });
  console.log(`${entries.length} sent emails on record, ${toCheck.length} need a status check.`);

  let newBlocks = 0;
  for (const [email, meta] of toCheck) {
    let lastEvent;
    try {
      lastEvent = await fetchStatus(meta.id);
    } catch (e) {
      console.error(`  ${email}: ${e.message}`);
      continue;
    }
    block.statuses[email] = { id: meta.id, last_event: lastEvent, checkedAt: new Date().toISOString() };
    if (BLOCKING.has(lastEvent) && !block.emails[email]) {
      block.emails[email] = { reason: lastEvent, at: new Date().toISOString(), source: "resend", id: meta.id };
      newBlocks++;
      const domain = email.split("@")[1];
      if (lastEvent === "bounced" && domain && !FREEMAIL.has(domain)) {
        const d = block.domains[domain] || { bounces: 0 };
        d.bounces++;
        d.lastAt = new Date().toISOString();
        block.domains[domain] = d;
      }
    }
    console.log(`  ${email} -> ${lastEvent}`);
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  fs.writeFileSync(BLOCKLIST, JSON.stringify(block, null, 2));

  const counts = {};
  for (const s of Object.values(block.statuses)) counts[s.last_event] = (counts[s.last_event] || 0) + 1;
  console.log("");
  console.log(`Status breakdown: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ") || "none"}`);
  console.log(`Blocklist: ${Object.keys(block.emails).length} emails (${newBlocks} new), ${Object.keys(block.domains).length} bounced domains -> ${BLOCKLIST}`);
}

// Only run when invoked directly (send-campaign imports FREEMAIL from here).
if (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("pipeline/bounce-sync.mjs")) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
