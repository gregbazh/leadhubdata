// Product #2: New Florida food-service businesses (restaurants, caterers, mobile units).
// Sources:
//   - data-work/HR_plan_review.csv  (license applications in plan review; has emails)
//   - data-work/newfood.csv         (approved new licenses this fiscal year; has phones)
// Outputs:
//   - deliverables/fl_new_restaurants_plan_review.csv (email-bearing)
//   - deliverables/fl_new_restaurants_approved.csv
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

const OUT_DIR = "deliverables";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cleanEmail = (s) => {
  const v = (s || "").trim().toLowerCase();
  return EMAIL_RE.test(v) ? v : "";
};

async function readCsv(file, opts = {}) {
  const rows = [];
  const parser = fs.createReadStream(file).pipe(
    parse({ relax_column_count: true, relax_quotes: true, bom: true, ...opts })
  );
  for await (const row of parser) rows.push(row);
  return rows;
}

async function planReview() {
  // Index-based (header row has encoding artifacts):
  // 0 district, 1 county, 2 dba, 3 addr, 4 city, 5 zip, 6 facilityPhone,
  // 7 facilityEmail, 8 status, 9 applicationDate, 10 reviewDate, 11 appType,
  // 12 facilityType, 13 fileNum, 14 appNum, 15 licNum, 16 transaction,
  // 17 variance, 18 mailingName, 19-23 mailing addr fields,
  // 24 contactPhone, 25 contactEmail, 26 altPhone, 27 altEmail
  const rows = (await readCsv("data-work/HR_plan_review.csv")).slice(1);
  const seen = new Set();
  const out = [];
  let noEmail = 0;

  for (const r of rows) {
    const email = cleanEmail(r[7]) || cleanEmail(r[25]) || cleanEmail(r[27]);
    if (!email) { noEmail++; continue; }
    const key = (r[13] || "") + "|" + (r[2] || "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      business_name: r[2],
      legal_name: r[18],
      facility_type: r[12],
      county: r[1],
      address: r[3],
      city: r[4],
      zip: r[5],
      phone: (r[6] || "").trim() || (r[24] || "").trim() || (r[26] || "").trim(),
      email,
      plan_review_status: r[8],
      application_date: r[9],
      application_type: r[16],
    });
  }

  out.sort((a, b) => (b.application_date || "").localeCompare(a.application_date || ""));
  const outPath = path.join(OUT_DIR, "fl_new_restaurants_plan_review.csv");
  fs.writeFileSync(outPath, stringify(out, { header: true }));
  console.log(`Plan review: ${rows.length} rows, ${out.length} unique with email (${noEmail} without email)`);
  console.log(`Wrote ${outPath}`);
  return out;
}

async function approved(planRows) {
  // newfood.csv has a header row; use named columns.
  const rows = await readCsv("data-work/newfood.csv", { columns: (h) => h.map((c) => c.trim()) });
  // Emails aren't in this file; borrow from plan-review by business name + zip.
  const emailIdx = new Map();
  for (const p of planRows) {
    emailIdx.set(`${(p.business_name || "").toUpperCase()}|${p.zip}`, p.email);
  }

  const out = rows.map((r) => ({
    business_name: r["Business Name"],
    legal_name: r["Licensee Name"],
    license_number: r["License Number"],
    approval_date: r["Application Approval Date"],
    address: r["Location Street Address"],
    city: r["Location City"],
    zip: r["Location Zip Code"],
    county: r["Location County"],
    phone: (r["Primary Phone Number"] || "").trim() || (r["Secondary Phone Number"] || "").trim(),
    email: emailIdx.get(`${(r["Business Name"] || "").toUpperCase()}|${r["Location Zip Code"]}`) || "",
    seats: r["Number of Seats"],
    license_expires: r["License Expiry Date"],
  }));

  const outPath = path.join(OUT_DIR, "fl_new_restaurants_approved.csv");
  fs.writeFileSync(outPath, stringify(out, { header: true }));
  const withEmail = out.filter((r) => r.email).length;
  const withPhone = out.filter((r) => r.phone).length;
  console.log(`Approved new establishments: ${out.length} (${withPhone} with phone, ${withEmail} matched an email)`);
  console.log(`Wrote ${outPath}`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const planRows = await planReview();
  await approved(planRows);
}

main().catch((e) => { console.error(e); process.exit(1); });
