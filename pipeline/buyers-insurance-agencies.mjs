// Buyer list: Florida-licensed insurance agencies with emails.
// Source: DFS AllValidLicensesBusiness.csv (has header).
// Output: deliverables/buyers_fl_insurance_agencies.csv
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

const OUT_DIR = "deliverables";

// DFS wraps some values in ="..." to force Excel text formatting.
const unwrap = (s) => (s || "").replace(/^="?|"?$/g, "").trim();

const INCLUDE_TYPES = new Set(["AGENCY LICENSE", "MANAGING GENERAL AGENT"]);

const SEGMENT_PATTERNS = [
  [/SURETY|BOND/i, "surety-bond"],
  [/TRUCK|TRANSPORT|COMMERCIAL AUTO|FLEET/i, "trucking-commercial-auto"],
  [/COMMERCIAL|BUSINESS INS/i, "commercial"],
  [/CONTRACTOR|CONSTRUCTION|BUILDER/i, "construction-focused"],
];

async function main() {
  const parser = fs.createReadStream("data-work/AllValidLicensesBusiness.csv").pipe(
    parse({ relax_column_count: true, relax_quotes: true, columns: true, bom: true })
  );

  const out = [];
  let considered = 0, noEmail = 0;
  for await (const r of parser) {
    if (!INCLUDE_TYPES.has(r["License TYCL Desc"])) continue;
    considered++;
    const email = (r["Email Address"] || "").trim().toLowerCase();
    if (!email || !email.includes("@")) { noEmail++; continue; }

    const name = r["Full Name"] || "";
    let segment = "";
    for (const [re, label] of SEGMENT_PATTERNS) {
      if (re.test(name)) { segment = label; break; }
    }

    out.push({
      agency_name: name,
      license_number: r["License Number"],
      npn: unwrap(r["NPN Number"]),
      license_type: r["License TYCL Desc"],
      residency: r["Residency Type"],
      email,
      phone: unwrap(r["Business Phone"]),
      address: [r["Business Address1"], r["Business Address2"]].filter(Boolean).join(", "),
      city: r["Business City"],
      state: r["Business State"],
      zip: unwrap(r["Business Zip"]).slice(0, 5),
      county: r["Business County"],
      licensed_since: (r["License Issue Date"] || "").split(" ")[0],
      name_segment_hint: segment,
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, "buyers_fl_insurance_agencies.csv");
  fs.writeFileSync(outPath, stringify(out, { header: true }));

  const segCounts = {};
  for (const r of out) if (r.name_segment_hint) segCounts[r.name_segment_hint] = (segCounts[r.name_segment_hint] || 0) + 1;
  console.log(`Agencies considered: ${considered}, without email: ${noEmail}, written: ${out.length}`);
  console.log("Name-based segment hints:", segCounts);
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
