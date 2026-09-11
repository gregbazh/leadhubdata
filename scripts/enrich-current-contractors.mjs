import fs from "node:fs";
import path from "node:path";
import { resolve4 } from "node:dns/promises";
import { neon } from "@neondatabase/serverless";
import { hostOf, domainMatchesName, pageMentionsBusiness, looksFlorida, validateContact, cleanPhone } from "../pipeline/contact-validate.mjs";
import { matchesLicenseLocation } from "../src/lib/contact-identity.mjs";

const sql = neon(process.env.DATABASE_URL);
const out = "private-data/current-contractor-enrichment";
fs.mkdirSync(out, { recursive: true });
const mode = process.argv[2] || "crawl";
const concurrency = Number(process.env.ENRICH_CONCURRENCY || 32);
const normalize = value => String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const business = row => row.dba_name?.trim() || row.licensee_name;
const identity = row => `${normalize(business(row))}|${normalize(row.address)}|${row.zip?.slice(0,5)}`;
const rows = await sql.query("SELECT * FROM fl_contractors_current ORDER BY license_number");
const reachable = row => !!(row.email?.trim() || cleanPhone(row.phone) || row.contact_form_url?.trim());
const groups = new Map();
for (const row of rows) {
  const key = identity(row);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}
const journal = path.join(out, "attempts.jsonl");
const previous = fs.existsSync(journal) ? fs.readFileSync(journal, "utf8").trim().split("\n").filter(Boolean).map(line => JSON.parse(line)) : [];
const latest = new Map(previous.map(row => [row.key,row]));
const found = new Map([...latest].filter(([,row])=>row.contact && row.identityVersion===2));

if (mode === "publish") {
  const patches = [];
  for (const [key, group] of groups) {
    const known = group.find(reachable);
    const discovery = found.get(key);
    const contact = known || discovery?.contact;
    if (!contact) continue;
    for (const row of group.filter(row => !reachable(row))) {
      patches.push({ license_number: row.license_number, business_name: business(row), website: contact.website || "", email: contact.email || "", phone: contact.phone || "", contact_form_url: contact.contact_form_url || "", contact_source_url: discovery?.contact.contact_source_url || contact.contact_source_url || contact.website || "", contact_checked_at: discovery?.checked_at || contact.contact_checked_at || null });
    }
  }
  const stamp = new Date().toISOString().replace(/[:.]/g,"-");
  fs.writeFileSync(path.join(out,`before-publish-${stamp}.json`),JSON.stringify(rows));
  if (patches.length) {
    await sql.transaction([
      sql.query("SELECT pg_advisory_xact_lock(70102)"),
      sql.query(`INSERT INTO contractor_contacts (license_number,business_name,website,email,phone,contact_form_url,contact_source_url,contact_checked_at)
        SELECT license_number,business_name,website,email,phone,contact_form_url,contact_source_url,contact_checked_at
        FROM jsonb_to_recordset($1::jsonb) AS x(license_number text,business_name text,website text,email text,phone text,contact_form_url text,contact_source_url text,contact_checked_at timestamptz)
        ON CONFLICT (license_number) DO UPDATE SET business_name=EXCLUDED.business_name,website=EXCLUDED.website,email=EXCLUDED.email,phone=EXCLUDED.phone,contact_form_url=EXCLUDED.contact_form_url,contact_source_url=EXCLUDED.contact_source_url,contact_checked_at=EXCLUDED.contact_checked_at`,[JSON.stringify(patches)]),
      sql.query(`UPDATE fl_contractors_current t SET website=x.website,email=x.email,phone=x.phone,contact_form_url=x.contact_form_url,contact_source_url=x.contact_source_url,contact_checked_at=x.contact_checked_at
        FROM jsonb_to_recordset($1::jsonb) AS x(license_number text,business_name text,website text,email text,phone text,contact_form_url text,contact_source_url text,contact_checked_at timestamptz)
        WHERE t.license_number=x.license_number AND regexp_replace(upper(coalesce(nullif(trim(t.dba_name),''),t.licensee_name)),'[^A-Z0-9]','','g')=regexp_replace(upper(x.business_name),'[^A-Z0-9]','','g')
        AND coalesce(trim(t.email),'')='' AND coalesce(trim(t.phone),'')='' AND coalesce(trim(t.contact_form_url),'')=''`,[JSON.stringify(patches)]),
    ]);
  }
  fs.writeFileSync(path.join(out,`published-${stamp}.json`),JSON.stringify(patches));
  console.log(JSON.stringify({ published: patches.length }));
  process.exit(0);
}

const done = new Set([...latest].filter(([,row])=>row.contact ? row.identityVersion===2 : row.attemptVersion===3).map(([key])=>key));
const queue = [...groups].filter(([key,group]) => !group.some(reachable) && !done.has(key));
const guesses = name => {
  const tokens = name.toLowerCase().replace(/\b(inc|llc|corp|corporation|company|co|ltd|the|and|of)\b/g," ").split(/[^a-z0-9]+/).filter(Boolean);
  return [...new Set([tokens.join(""),tokens.slice(0,2).join("")])].filter(value => value.length >= 6 && value.length <= 45).map(value => `${value}.com`).filter(host => domainMatchesName(name,host));
};
const dnsCache = new Map();
const checks = { dnsFound: 0, pagesRead: 0, failures: {} };
async function publicHost(host) {
  if (!dnsCache.has(host)) dnsCache.set(host, resolve4(host,{ttl:false}).then(ips => { checks.dnsFound++; return ips.every(ip => !/^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)); }).catch(()=>false));
  return dnsCache.get(host);
}
async function page(url) {
  const host = hostOf(url);
  if (!await publicHost(host)) return null;
  try {
    const response = await fetch(url,{signal:AbortSignal.timeout(8000),headers:{"User-Agent":"LeadHubData contact research (+https://www.leadhubdata.com/contact)",Accept:"text/html",Connection:"close"},redirect:"manual"});
    if (response.status>=300 && response.status<400) {
      const next = new URL(response.headers.get("location"),url);
      await response.body?.cancel();
      if (hostOf(next.href)!==host || next.href===url) return null;
      const redirected = await fetch(next,{signal:AbortSignal.timeout(8000),headers:{"User-Agent":"LeadHubData contact research (+https://www.leadhubdata.com/contact)",Connection:"close"},redirect:"error"});
      if(!redirected.ok || !redirected.headers.get("content-type")?.includes("text/html")){await redirected.body?.cancel();return null;}
      checks.pagesRead++;
      return {url:next.href,html:(await redirected.text()).slice(0,1500000)};
    }
    if(!response.ok || !response.headers.get("content-type")?.includes("text/html")){await response.body?.cancel();return null;}
    checks.pagesRead++;
    return {url,html:(await response.text()).slice(0,1500000)};
  } catch (error) { const reason=error.cause?.code || error.name;checks.failures[reason]=(checks.failures[reason]||0)+1;return null; }
}
function contacts(html,site,row) {
  const name=business(row),city=row.city;
  const host=hostOf(site);
  const email=(html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)||[]).find(value=>value.toLowerCase().split("@")[1]===host)||"";
  const phone=cleanPhone(/href=["']tel:([^"']+)/i.exec(html)?.[1]||/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.exec(html)?.[0]||"");
  if(!pageMentionsBusiness(html,name) || !looksFlorida({html,city,phone}) || !matchesLicenseLocation(html,row))return null;
  const result=validateContact({name,website:site,email,phone});
  const form=/<form\b[\s\S]*?<textarea\b[\s\S]*?<\/(?:form)>/i.test(html) && /\b(contact|message|quote|estimate)\b/i.test(html);
  if(!result && !form)return null;
  return {website:`https://${host}`,email:result?.email||"",phone:result?.phone||"",contact_form_url:form?site:"",contact_source_url:site};
}
async function discover(row) {
  const name=business(row);
  for(const host of guesses(name)) {
    const home=await page(`https://${host}`);
    if(!home)continue;
    let result=contacts(home.html,home.url,row);
    if(result)return result;
    if(!pageMentionsBusiness(home.html,name))continue;
    const links=[...home.html.matchAll(/href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .filter(match=>/contact/i.test(match[1]+match[2])).map(match=>{try{return new URL(match[1],home.url).href;}catch{return "";}})
      .filter(url=>url.startsWith("https:")&&hostOf(url)===host);
    for(const url of [...new Set(links)].slice(0,2)) {
      const contact=await page(url);
      if(!contact)continue;
      result=contacts(home.html+contact.html,contact.url,row);
      if(result)return result;
    }
  }
  return null;
}
let cursor=0,processed=0,hits=0;
const started=Date.now();
console.log(JSON.stringify({ queuedBusinesses:queue.length, queuedLicenses:queue.reduce((sum,[,group])=>sum+group.length,0), previousAttempts:done.size }));
await Promise.all(Array.from({length:concurrency},async()=>{
  while(cursor<queue.length) {
    const [key,group]=queue[cursor++];
    const contact=await discover(group[0]);
    fs.appendFileSync(journal,JSON.stringify({key,licenses:group.map(row=>row.license_number),checked_at:new Date().toISOString(),identityVersion:2,attemptVersion:3,contact})+"\n");
    processed++;if(contact)hits++;
    if(processed%250===0)console.log(JSON.stringify({processed,total:queue.length,foundBusinesses:hits,minutes:Math.round((Date.now()-started)/60000),checks}));
  }
}));
console.log(JSON.stringify({complete:true,processed,foundBusinesses:hits,checks}));
