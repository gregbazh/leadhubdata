// Clean a buyer/lead CSV before emailing: dedupe, syntax-validate, and verify
// each email's domain actually accepts mail (live MX lookup). Domains with no
// MX record are dead and would hard-bounce, so they're dropped.
//
// Usage:
//   node pipeline/clean-list.mjs deliverables/buyers_fl_insurance_agencies.csv email
//   node pipeline/clean-list.mjs deliverables/fl_new_restaurants_plan_review.csv email
//
// Writes:
//   <input>.clean.csv     valid, deduped, MX-verified rows
//   <input>.rejected.csv  rows dropped, with a reason column
import fs from "node:fs";
import dns from "node:dns/promises";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Typo/parked/placeholder domains that resolve but shouldn't be mailed.
const BAD_DOMAINS = new Set([
  "example.com", "test.com", "email.com", "domain.com", "none.com",
  "na.com", "noemail.com", "gmail.co", "gmial.com", "yahoo.co",
]);
const DNS_CONCURRENCY = 20;

async function hasMx(domain, cache) {
  if (cache.has(domain)) return cache.get(domain);
  let ok = false;
  try {
    const mx = await dns.resolveMx(domain);
    ok = Array.isArray(mx) && mx.length > 0;
  } catch {
    // Some domains accept mail via an A record with no MX. Check that too.
    try { ok = (await dns.resolve(domain)).length > 0; } catch { ok = false; }
  }
  cache.set(domain, ok);
  return ok;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

async function main() {
  const [input, emailCol = "email"] = process.argv.slice(2);
  if (!input || !fs.existsSync(input)) {
    console.error("Usage: node pipeline/clean-list.mjs <csv path> [emailColumn]");
    process.exit(1);
  }

  const rows = parse(fs.readFileSync(input, "utf8"), { columns: true });
  console.log(`Loaded ${rows.length} rows from ${input}`);

  const seen = new Set();
  const rejected = [];
  const syntaxOk = [];

  for (const row of rows) {
    const email = (row[emailCol] || "").trim().toLowerCase();
    const domain = email.split("@")[1] || "";
    if (!email) { rejected.push({ ...row, reject_reason: "no email" }); continue; }
    if (!EMAIL_RE.test(email)) { rejected.push({ ...row, reject_reason: "bad syntax" }); continue; }
    if (BAD_DOMAINS.has(domain)) { rejected.push({ ...row, reject_reason: "placeholder domain" }); continue; }
    if (seen.has(email)) { rejected.push({ ...row, reject_reason: "duplicate" }); continue; }
    seen.add(email);
    row[emailCol] = email;
    syntaxOk.push(row);
  }
  console.log(`After dedupe + syntax: ${syntaxOk.length} unique candidates (${rejected.length} dropped so far)`);

  const domains = [...new Set(syntaxOk.map((r) => r[emailCol].split("@")[1]))];
  console.log(`Checking MX for ${domains.length} unique domains...`);
  const cache = new Map();
  let checked = 0;
  await mapLimit(domains, DNS_CONCURRENCY, async (d) => {
    await hasMx(d, cache);
    if (++checked % 500 === 0) console.log(`  ...${checked}/${domains.length} domains`);
  });

  const clean = [];
  for (const row of syntaxOk) {
    const domain = row[emailCol].split("@")[1];
    if (cache.get(domain)) clean.push(row);
    else rejected.push({ ...row, reject_reason: "domain has no mail server (would bounce)" });
  }

  const base = input.replace(/\.csv$/i, "");
  fs.writeFileSync(`${base}.clean.csv`, stringify(clean, { header: true }));
  if (rejected.length) fs.writeFileSync(`${base}.rejected.csv`, stringify(rejected, { header: true }));

  const deadDomains = [...cache.entries()].filter(([, ok]) => !ok).length;
  console.log("");
  console.log(`CLEAN:    ${clean.length}  -> ${base}.clean.csv`);
  console.log(`REJECTED: ${rejected.length}  -> ${base}.rejected.csv`);
  console.log(`Dead domains found: ${deadDomains}/${domains.length}`);
  console.log(`Deliverability estimate: ${((clean.length / rows.length) * 100).toFixed(1)}% of original rows kept`);
}

main().catch((e) => { console.error(e); process.exit(1); });
