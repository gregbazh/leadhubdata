// Overnight enrichment: find emails/phones for expiring contractors by
// locating their websites via web search and crawling contact pages.
// Reads:  deliverables/fl_contractors_expiring_90d.csv
// Writes: deliverables/fl_contractors_expiring_enriched.csv (incrementally)
//         pipeline/.enrich-state.json (checkpoint)
import fs from "node:fs";
import { parse } from "csv-parse/sync";

const INPUT = "deliverables/fl_contractors_expiring_90d.csv";
const OUTPUT = "deliverables/fl_contractors_expiring_enriched.csv";
const STATE = "pipeline/.enrich-state.json";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const SEARCH_DELAY_MS = 3000;

const BLOCKED = /yelp\.|facebook\.|instagram\.|linkedin\.|angi\.|homeadvisor\.|houzz\.|thumbtack\.|bbb\.org|yellowpages\.|mapquest\.|manta\.com|dnb\.com|bizapedia\.|buildzoom\.|porch\.com|zoominfo\.|opencorporates\.|myfloridalicense\.|sunbiz\.org|google\.|youtube\.|tiktok\.|twitter\.|x\.com|nextdoor\.|alignable\.|chamberofcommerce\.|wikipedia\.|indeed\.|glassdoor\.|amazon\.|apple\.|bloomberg\.|crunchbase\.|superpages\./i;
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const JUNK_EMAIL = /example\.|sentry\.|wixpress\.|\.png$|\.jpg$|\.gif$|\.webp$|godaddy\.|domain\.com|email\.com|yourdomain|@\d+x\./i;
const PHONE_RE = /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms + Math.random() * 1000));

async function get(url, timeoutMs = 12000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
      signal: ctl.signal, redirect: "follow",
    });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) return "";
    return await res.text();
  } catch { return ""; } finally { clearTimeout(t); }
}

function extractBingUrls(html) {
  const urls = [];
  for (const m of html.matchAll(/<h2><a[^>]+href="([^"]+)"/g)) {
    let u = m[1];
    if (u.includes("bing.com/ck/a")) {
      const enc = /[?&]u=a1([^&]+)/.exec(u);
      if (enc) {
        try { u = Buffer.from(enc[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"); }
        catch { continue; }
      }
    }
    if (/^https?:\/\//.test(u)) urls.push(u);
  }
  return urls;
}

function extractDdgUrls(html) {
  const urls = [];
  for (const m of html.matchAll(/class="result__a"[^>]+href="([^"]+)"/g)) {
    const enc = /uddg=([^&]+)/.exec(m[1]);
    if (enc) { try { urls.push(decodeURIComponent(enc[1])); } catch {} }
    else if (/^https?:\/\//.test(m[1])) urls.push(m[1]);
  }
  return urls;
}

function pickDomain(urls) {
  for (const u of urls) {
    try {
      const { hostname } = new URL(u);
      if (!BLOCKED.test(hostname) && !BLOCKED.test(u)) return `https://${hostname}`;
    } catch {}
  }
  return "";
}

function findContacts(html) {
  const emails = new Set();
  for (const m of html.matchAll(EMAIL_RE)) {
    const e = m[0].toLowerCase();
    if (!JUNK_EMAIL.test(e)) emails.add(e);
  }
  const tel = /href="tel:([+\d\s().-]{10,})"/.exec(html);
  const phone = tel ? tel[1].trim() : (PHONE_RE.exec(html)?.[0] || "");
  return { email: [...emails][0] || "", phone };
}

async function enrichOne(row) {
  const bizName = row.dba_name || row.licensee_name;
  const q = encodeURIComponent(`"${bizName}" ${row.city} FL ${row.trade || "contractor"}`);
  let urls = extractBingUrls(await get(`https://www.bing.com/search?q=${q}`));
  if (!urls.length) {
    await sleep(1500);
    urls = extractDdgUrls(await get(`https://html.duckduckgo.com/html/?q=${q}`));
  }
  const site = pickDomain(urls);
  if (!site) return null;

  let html = await get(site);
  let contacts = findContacts(html);
  if (!contacts.email) {
    for (const path of ["/contact", "/contact-us"]) {
      html = await get(site + path);
      const c = findContacts(html);
      if (c.email) { contacts = { email: c.email, phone: contacts.phone || c.phone }; break; }
    }
  }
  if (!contacts.email && !contacts.phone) return null;
  return { website: site, ...contacts };
}

async function main() {
  const rows = parse(fs.readFileSync(INPUT, "utf8"), { columns: true });
  // Businesses with a DBA name are most likely to have findable websites.
  rows.sort((a, b) => (b.dba_name ? 1 : 0) - (a.dba_name ? 1 : 0));

  const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, "utf8")) : { done: {} };
  if (!fs.existsSync(OUTPUT)) {
    fs.writeFileSync(OUTPUT, "license_number,trade,licensee_name,dba_name,city,zip,license_expires,days_until_expiry,website,email,phone\n");
  }

  let processed = 0, found = 0;
  for (const row of rows) {
    if (state.done[row.license_number]) continue;
    let hit = null;
    try { hit = await enrichOne(row); } catch {}
    state.done[row.license_number] = true;
    processed++;
    if (hit) {
      found++;
      const esc = (s) => `"${(s || "").replace(/"/g, '""')}"`;
      fs.appendFileSync(OUTPUT, [
        row.license_number, row.trade, row.licensee_name, row.dba_name,
        row.city, row.zip, row.license_expires, row.days_until_expiry,
        hit.website, hit.email, hit.phone,
      ].map(esc).join(",") + "\n");
    }
    if (processed % 25 === 0) {
      fs.writeFileSync(STATE, JSON.stringify(state));
      console.log(`processed=${processed} found=${found} (${new Date().toISOString()})`);
    }
    await sleep(SEARCH_DELAY_MS);
  }
  fs.writeFileSync(STATE, JSON.stringify(state));
  console.log(`DONE processed=${processed} found=${found}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
