import fs from "node:fs";
import { neon } from "@neondatabase/serverless";
import { parse } from "csv-parse/sync";
import { FOOD_COLUMNS, CONTRACTOR_COLUMNS, foodKey } from "../src/lib/source-records.mjs";

const sql = neon(process.env.DATABASE_URL);
await sql.query(`CREATE TABLE IF NOT EXISTS subscription_deliveries (
  id text PRIMARY KEY, subscription_id text NOT NULL, through_at timestamptz NOT NULL,
  row_count integer NOT NULL, payload jsonb NOT NULL, status text NOT NULL DEFAULT 'pending',
  first_attempt_at timestamptz, locked_until timestamptz, resend_id text,
  created_at timestamptz NOT NULL DEFAULT now()
)`);
await sql.query(`CREATE TABLE IF NOT EXISTS data_refreshes (dataset text PRIMARY KEY, checked_at timestamptz NOT NULL, source_modified_at timestamptz, source_rows integer NOT NULL)`);
await sql.query(`CREATE TABLE IF NOT EXISTS contractor_contacts (license_number text PRIMARY KEY, website text, email text, phone text, business_name text)`);
await sql.query(`ALTER TABLE contractor_contacts ADD COLUMN IF NOT EXISTS business_name text`);
await sql.query(`CREATE TABLE IF NOT EXISTS fl_contractors_current (${CONTRACTOR_COLUMNS.map(c => `${c} text`).join(",")}, website text, email text, phone text, source_checked_at timestamptz NOT NULL, PRIMARY KEY (license_number))`);
await sql.query(`CREATE TABLE IF NOT EXISTS fl_food_filings (record_key text PRIMARY KEY, ${FOOD_COLUMNS.map(c => `${c} text`).join(",")}, first_seen timestamptz NOT NULL, source_checked_at timestamptz)`);
await sql.query(`CREATE INDEX IF NOT EXISTS food_first_seen_idx ON fl_food_filings (first_seen)`);
await sql.query(`CREATE OR REPLACE VIEW fl_food_available AS SELECT * FROM fl_food_filings WHERE plan_review_status <> 'Denied'`);
await sql.query(`CREATE OR REPLACE VIEW fl_food_trucks AS SELECT * FROM fl_food_available WHERE facility_type = 'Mobile MFDV'`);

const backup = `private-data/catalog-backup-${new Date().toISOString().replace(/[:.]/g, "-")}`;
fs.mkdirSync(backup, { recursive: true });
const [food, contractors] = await Promise.all([sql.query("SELECT * FROM fl_restaurants"), sql.query("SELECT * FROM fl_contractors")]);
fs.writeFileSync(`${backup}/food.json`, JSON.stringify(food));
fs.writeFileSync(`${backup}/contractors.json`, JSON.stringify(contractors));
const archive = new Map();
for (const r of food) {
  const key = foodKey(r);
  const old = archive.get(key);
  const first_seen = r.first_seen || "2026-08-05T00:00:00Z";
  archive.set(key, { ...r, record_key: key, first_seen: old && old.first_seen < first_seen ? old.first_seen : first_seen });
}
await sql.query(`INSERT INTO fl_food_filings (record_key, ${FOOD_COLUMNS.join(",")}, first_seen)
  SELECT record_key, ${FOOD_COLUMNS.join(",")}, first_seen FROM jsonb_to_recordset($1::jsonb) AS x(record_key text, ${FOOD_COLUMNS.map(c => `${c} text`).join(",")}, first_seen timestamptz)
  ON CONFLICT (record_key) DO NOTHING`, [JSON.stringify([...archive.values()])]);

const contacts = new Map(contractors.map(r => [r.license_number, r]));
const contactPath = "deliverables/fl_contractors_expiring_verified.csv";
if (fs.existsSync(contactPath)) {
  for (const row of parse(fs.readFileSync(contactPath), { columns: true })) {
    const old = contacts.get(row.license_number) || {};
    contacts.set(row.license_number, { ...row, website: row.website || old.website || "", email: row.email || old.email || "", phone: row.phone || old.phone || "" });
  }
}
await sql.query(`INSERT INTO contractor_contacts (license_number, website, email, phone, business_name)
  SELECT license_number, website, email, phone, coalesce(nullif(trim(dba_name),''),licensee_name)
  FROM jsonb_to_recordset($1::jsonb) AS x(license_number text, website text, email text, phone text, dba_name text, licensee_name text)
  ON CONFLICT (license_number) DO UPDATE SET website=EXCLUDED.website,email=EXCLUDED.email,phone=EXCLUDED.phone,business_name=EXCLUDED.business_name`, [JSON.stringify([...contacts.values()])]);
console.log(JSON.stringify({ backup, archivedFood: archive.size, contactRows: contacts.size }));
