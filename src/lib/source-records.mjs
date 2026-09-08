import { createHash } from "node:crypto";
import { parse } from "csv-parse/sync";

export const FOOD_COLUMNS = ["business_name", "legal_name", "facility_type", "county", "address", "city", "zip", "phone", "email", "plan_review_status", "application_date", "application_type"];
export const CONTRACTOR_COLUMNS = ["license_number", "trade_code", "trade", "licensee_name", "dba_name", "address", "city", "state", "zip", "county_code", "originally_licensed", "license_expires", "days_until_expiry"];
export const TRADES = { CGC: "Cert General", CBC: "Cert Building", CAC: "Cert Air", CCC: "Cert Roofing", CRC: "Cert Residential", CFC: "Cert Plumbing", CPC: "Cert Pool", SCC: "Cert Specialty", CUC: "Cert Underground", CMC: "Cert Mechanical", CVC: "Cert Solar", PCC: "Cert Pollutant", CSC: "Cert Metal" };

export function foodKey(row) {
  // A representative's changed email must not turn an existing filing into a new lead.
  const value = [row.business_name, row.address, row.zip, row.application_date]
    .map(v => String(v || "").trim().toUpperCase()).join("|");
  return createHash("sha256").update(value).digest("hex");
}

function email(value) {
  const clean = (value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) ? clean : "";
}

export function parseFood(csv) {
  if (csv.trimStart().startsWith("<")) throw new Error("Food source returned markup instead of CSV");
  const raw = parse(csv, { relax_column_count: true, relax_quotes: true, bom: true }).slice(1);
  const records = new Map();
  for (const r of raw) {
    const contact = email(r[7]) || email(r[25]) || email(r[27]);
    if (!contact || !r[2]?.trim() || !/^\d{2}\/\d{2}\/\d{4}$/.test(r[9] || "")) continue;
    const row = {
      business_name: r[2].trim(), legal_name: r[18] || "", facility_type: r[12] || "",
      county: r[1] || "", address: r[3] || "", city: r[4] || "", zip: r[5] || "",
      phone: (r[6] || "").trim() || (r[24] || "").trim() || (r[26] || "").trim(),
      email: contact, plan_review_status: r[8] || "", application_date: r[9], application_type: r[16] || "",
    };
    records.set(foodKey(row), { ...row, record_key: foodKey(row) });
  }
  return [...records.values()];
}

export function parseContractors(csv, today = new Date().toISOString().slice(0, 10)) {
  if (csv.trimStart().startsWith("<")) throw new Error("Contractor source returned markup instead of CSV");
  const raw = parse(csv, { relax_column_count: true, relax_quotes: true, bom: true });
  const records = new Map();
  for (const r of raw) {
    if (r[13] !== "C" || r[14] !== "A" || r[9] !== "FL" || !TRADES[r[1]]) continue;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(r[17] || "");
    if (!match) continue;
    const expiry = `${match[3]}-${match[1]}-${match[2]}`;
    if (expiry < today) continue;
    const license = (r[20] || r[1] + r[12]).trim();
    records.set(license, {
      license_number: license, trade_code: r[1], trade: TRADES[r[1]], licensee_name: r[2] || "", dba_name: r[3] || "",
      address: [r[5], r[6], r[7]].filter(Boolean).join(", "), city: r[8] || "", state: r[9], zip: r[10] || "",
      county_code: r[11] || "", originally_licensed: r[15] || "", license_expires: r[17],
      days_until_expiry: String(Math.round((Date.parse(expiry) - Date.parse(today)) / 86400000)),
    });
  }
  return [...records.values()];
}

export async function fetchSource(filename) {
  const response = await fetch(`https://www2.myfloridalicense.com/sto/file_download/extracts/${filename}`, {
    signal: AbortSignal.timeout(120000),
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", Referer: "https://www2.myfloridalicense.com/", "Accept-Language": "en-US,en;q=0.9", "Upgrade-Insecure-Requests": "1" },
    cache: "no-store",
  });
  if (!response.ok || response.headers.get("content-type")?.includes("text/html")) throw new Error(`State source ${filename} returned HTTP ${response.status} (${response.headers.get("content-type")})`);
  return { csv: await response.text(), modified: response.headers.get("last-modified") };
}
