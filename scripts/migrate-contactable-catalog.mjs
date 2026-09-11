import { neon } from "@neondatabase/serverless";
const sql=neon(process.env.DATABASE_URL);
await sql.transaction([
  sql.query("SELECT pg_advisory_xact_lock(70102)"),
  ...["contractor_contacts","fl_contractors_current"].map(table=>sql.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS contact_form_url text, ADD COLUMN IF NOT EXISTS contact_source_url text, ADD COLUMN IF NOT EXISTS contact_checked_at timestamptz`)),
  sql.query(`CREATE OR REPLACE VIEW fl_contractors_contactable AS SELECT * FROM fl_contractors_current
    WHERE coalesce(trim(email),'')<>'' OR coalesce(trim(phone),'')<>'' OR coalesce(trim(contact_form_url),'')<>''`),
]);
console.log("Contactable catalog view and contact provenance columns are ready.");
