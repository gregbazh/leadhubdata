// Cold email campaign sender via Resend.
//
// Usage:
//   node pipeline/send-campaign.mjs contractors            (dry run - prints what would send)
//   node pipeline/send-campaign.mjs contractors --test     (sends ONE email to CAMPAIGN_TEST_TO)
//   node pipeline/send-campaign.mjs contractors --live     (actually sends, up to --limit)
//   node pipeline/send-campaign.mjs restaurants --live --limit 50 --segment all
//
// Options:
//   --limit N      max emails this run (default 10 - keep this low, warm up your domain)
//   --segment X    contractors: "hot" (default: surety/construction/commercial/trucking hints) or "all"
//                  restaurants: "resident" (default: FL resident agencies) or "all"
//   --offset N     skip the first N eligible rows (default 0)
//
// Never emails the same address twice (tracked in pipeline/.sent-log.json).
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

// Minimal .env.local loader (no dependency on Next runtime)
for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

// Prefer the most-verified list available:
// SMTP-probed (verify-mailboxes.mjs) > MX-cleaned (clean-list.mjs) > raw.
const preferClean = (p) => {
  for (const suffix of [".clean.smtp-clean.csv", ".smtp-clean.csv", ".clean.csv"]) {
    const c = p.replace(/\.csv$/i, suffix);
    if (fs.existsSync(c)) return c;
  }
  return p;
};

const CAMPAIGNS = {
  contractors: {
    template: "pipeline/templates/campaign-expiring-contractors.txt",
    csv: preferClean("deliverables/buyers_fl_insurance_agencies.csv"),
    emailCol: "email",
    nameCol: "agency_name",
    filter: (row, segment) =>
      segment === "all" ? true : Boolean(row.name_segment_hint),
    defaultSegment: "hot",
  },
  restaurants: {
    template: "pipeline/templates/campaign-new-restaurants.txt",
    csv: preferClean("deliverables/buyers_fl_insurance_agencies.csv"),
    emailCol: "email",
    nameCol: "agency_name",
    filter: (row, segment) =>
      segment === "all" ? true : row.residency === "Resident" && row.state === "FL",
    defaultSegment: "resident",
  },
};

const SENT_LOG = "pipeline/.sent-log.json";
const BLOCKLIST = "pipeline/.blocklist.json";
const SEND_INTERVAL_MS = 1200; // stay under Resend rate limits

// Load the bounce blocklist maintained by bounce-sync.mjs. Blocked emails are
// never retried; custom domains that hard-bounced before are skipped entirely
// (freemail providers like gmail.com are exempt from domain-level blocking).
function loadBlocklist() {
  if (!fs.existsSync(BLOCKLIST)) return { emails: {}, domains: {} };
  const b = JSON.parse(fs.readFileSync(BLOCKLIST, "utf8"));
  return { emails: b.emails || {}, domains: b.domains || {} };
}

function titleCase(s) {
  return (s || "").toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .replace(/\b(Llc|Inc|Pa|Pl|Lp|Llp)\b/g, (m) => m.toUpperCase());
}

function renderTemplate(file, vars) {
  const raw = fs.readFileSync(file, "utf8");
  const [subjectLine, ...rest] = raw.split("\n");
  const subject = subjectLine.replace(/^SUBJECT:\s*/, "").trim();
  let body = rest.join("\n").trim() + "\n";
  for (const [k, v] of Object.entries(vars)) {
    body = body.replaceAll(`{{${k}}}`, v);
  }
  return { subject, body };
}

async function sendEmail({ to, subject, text }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [to],
      reply_to: process.env.RESEND_REPLY_TO || undefined,
      subject,
      text,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);
  return data.id;
}

async function main() {
  const [campaignName, ...flags] = process.argv.slice(2);
  const campaign = CAMPAIGNS[campaignName];
  if (!campaign) {
    console.error(`Usage: node pipeline/send-campaign.mjs <${Object.keys(CAMPAIGNS).join("|")}> [--live|--test] [--limit N] [--segment X] [--offset N]`);
    process.exit(1);
  }
  const live = flags.includes("--live");
  const test = flags.includes("--test");
  const argOf = (name, dflt) => {
    const i = flags.indexOf(name);
    return i >= 0 ? flags[i + 1] : dflt;
  };
  const limit = parseInt(argOf("--limit", "10"), 10);
  const offset = parseInt(argOf("--offset", "0"), 10);
  const segment = argOf("--segment", campaign.defaultSegment);

  if ((live || test) && (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM)) {
    console.error("Set RESEND_API_KEY and RESEND_FROM in .env.local first.");
    process.exit(1);
  }
  if (!process.env.CAMPAIGN_PHYSICAL_ADDRESS && live) {
    console.error("Set CAMPAIGN_PHYSICAL_ADDRESS in .env.local (CAN-SPAM requires a physical postal address).");
    process.exit(1);
  }
  // Both templates now include a {{checkout_url}} buy link. Don't let a live
  // (or test) send go out with a blank link.
  const templateSrc = fs.readFileSync(campaign.template, "utf8");
  if (templateSrc.includes("{{checkout_url}}") && !process.env.CAMPAIGN_CHECKOUT_URL && (live || test)) {
    console.error("Set CAMPAIGN_CHECKOUT_URL in .env.local (the template has a buy link).");
    process.exit(1);
  }

  const sentLog = fs.existsSync(SENT_LOG) ? JSON.parse(fs.readFileSync(SENT_LOG, "utf8")) : {};
  const blocklist = loadBlocklist();
  const rows = parse(fs.readFileSync(campaign.csv, "utf8"), { columns: true });

  let blockedSkipped = 0;
  const eligible = rows.filter((r) => {
    const email = (r[campaign.emailCol] || "").trim().toLowerCase();
    if (!email || sentLog[email] || !campaign.filter(r, segment)) return false;
    const domain = email.split("@")[1];
    if (blocklist.emails[email] || blocklist.domains[domain]) {
      blockedSkipped++;
      return false;
    }
    return true;
  }).slice(offset, offset + limit);

  console.log(`Using list: ${campaign.csv}`);
  console.log(`Campaign "${campaignName}" segment "${segment}": ${eligible.length} recipients this run (limit ${limit}, offset ${offset}, ${blockedSkipped} skipped via blocklist)`);

  if (test) {
    const to = process.env.CAMPAIGN_TEST_TO;
    if (!to) { console.error("Set CAMPAIGN_TEST_TO in .env.local"); process.exit(1); }
    const sample = eligible[0] || rows[0];
    const { subject, body } = renderTemplate(campaign.template, {
      name: titleCase(sample?.[campaign.nameCol] || "there"),
      signature: process.env.CAMPAIGN_SIGNATURE || "",
      physical_address: process.env.CAMPAIGN_PHYSICAL_ADDRESS || "[address not set]",
      checkout_url: process.env.CAMPAIGN_CHECKOUT_URL || "",
    });
    const id = await sendEmail({ to, subject, text: body });
    console.log(`Test email sent to ${to} (id ${id})`);
    return;
  }

  let sent = 0;
  for (const row of eligible) {
    const email = row[campaign.emailCol].trim().toLowerCase();
    const { subject, body } = renderTemplate(campaign.template, {
      name: titleCase(row[campaign.nameCol]) || "there",
      signature: process.env.CAMPAIGN_SIGNATURE || "",
      physical_address: process.env.CAMPAIGN_PHYSICAL_ADDRESS || "",
      checkout_url: process.env.CAMPAIGN_CHECKOUT_URL || "",
    });

    if (!live) {
      console.log(`[dry-run] -> ${email}  |  ${subject}  |  ${titleCase(row[campaign.nameCol])}`);
      continue;
    }
    try {
      const id = await sendEmail({ to: email, subject, text: body });
      sentLog[email] = { campaign: campaignName, at: new Date().toISOString(), id };
      sent++;
      console.log(`sent ${sent}/${eligible.length} -> ${email}`);
      fs.writeFileSync(SENT_LOG, JSON.stringify(sentLog, null, 2));
    } catch (e) {
      console.error(`FAILED -> ${email}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, SEND_INTERVAL_MS));
  }
  if (live) console.log(`Done. ${sent} emails sent. Log: ${SENT_LOG}`);
  else console.log(`Dry run complete. Re-run with --live to send, or --test to send yourself one.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
