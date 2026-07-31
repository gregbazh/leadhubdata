// Load the FL contractors deliverable into Neon Postgres, where the
// storefront's /api/download route reads it at purchase time.
//
// Usage:
//   node pipeline/load-leads-neon.mjs            (create table + load, refuses if table has rows)
//   node pipeline/load-leads-neon.mjs --replace  (drop and reload from scratch)
//
// Needs DATABASE_URL (Neon connection string) in the environment or .env.local.
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { neon } from "@neondatabase/serverless";

const INPUT = "deliverables/fl_contractors_expiring_90d.csv";
const TABLE = "fl_contractors";
const BATCH = 500;

for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL (Neon connection string) in .env.local or the environment.");
  process.exit(1);
}

const COLUMNS = [
  "license_number", "trade_code", "trade", "licensee_name", "dba_name",
  "address", "city", "state", "zip", "county_code", "originally_licensed",
  "license_expires", "days_until_expiry",
];

async function main() {
  const replace = process.argv.includes("--replace");
  const sql = neon(process.env.DATABASE_URL);

  if (replace) {
    await sql.query(`DROP TABLE IF EXISTS ${TABLE}`);
  }
  await sql.query(`CREATE TABLE IF NOT EXISTS ${TABLE} (
    ${COLUMNS.map((c) => `${c} text`).join(",\n    ")}
  )`);

  const [{ count }] = await sql.query(`SELECT count(*)::int AS count FROM ${TABLE}`);
  if (count > 0) {
    console.error(`${TABLE} already has ${count} rows. Re-run with --replace to reload.`);
    process.exit(1);
  }

  const rows = parse(fs.readFileSync(INPUT, "utf8"), { columns: true });
  console.log(`Loading ${rows.length} rows from ${INPUT} into ${TABLE}...`);

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const values = [];
    const params = [];
    for (const [ri, row] of chunk.entries()) {
      values.push(`(${COLUMNS.map((_, ci) => `$${ri * COLUMNS.length + ci + 1}`).join(",")})`);
      params.push(...COLUMNS.map((c) => row[c] ?? ""));
    }
    await sql.query(
      `INSERT INTO ${TABLE} (${COLUMNS.join(",")}) VALUES ${values.join(",")}`,
      params
    );
    if ((i / BATCH) % 10 === 0) console.log(`  ...${Math.min(i + BATCH, rows.length)}/${rows.length}`);
  }

  const [{ count: final }] = await sql.query(`SELECT count(*)::int AS count FROM ${TABLE}`);
  console.log(`DONE. ${TABLE} now has ${final} rows.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
