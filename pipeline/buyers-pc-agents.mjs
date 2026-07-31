// Buyer list v2: individual General Lines (P&C) agents licensed in Florida, with emails.
// Source: DFS AllValidLicensesIndividual.csv
// Output: deliverables/buyers_fl_pc_agents.csv
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

const OUT_DIR = "deliverables";
const TYPES = new Set(["GENERAL LINES (PROP & CAS)", "NONRES GEN LINES (PROP & CAS)"]);
const unwrap = (s) => (s || "").replace(/^="?|"?$/g, "").trim();

async function main() {
  const parser = fs.createReadStream("data-work/AllValidLicensesIndividual.csv").pipe(
    parse({ relax_column_count: true, relax_quotes: true, columns: true, bom: true })
  );

  const out = [];
  let noEmail = 0;
  for await (const r of parser) {
    if (!TYPES.has(r["License TYCL Desc"])) continue;
    const email = (r["Email Address"] || "").trim().toLowerCase();
    if (!email || !email.includes("@")) { noEmail++; continue; }
    out.push({
      full_name: r["Full Name"],
      license_number: r["License Number"],
      npn: unwrap(r["NPN Number"]),
      residency: r["Residency Type"],
      email,
      phone: unwrap(r["Business Phone"]),
      city: r["Business City"],
      state: r["Business State"],
      zip: unwrap(r["Business Zip"]).slice(0, 5),
      county: r["Business County"],
      licensed_since: (r["License Issue Date"] || "").split(" ")[0],
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, "buyers_fl_pc_agents.csv");
  fs.writeFileSync(outPath, stringify(out, { header: true }));
  const res = out.filter((r) => r.residency === "Resident").length;
  console.log(`P&C agents written: ${out.length} (${res} resident, ${out.length - res} non-resident, ${noEmail} skipped for no email)`);
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
