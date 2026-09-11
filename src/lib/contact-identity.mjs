import { cleanPhone } from "../../pipeline/contact-validate.mjs";

export function publishedPhone(html) {
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ");
  const candidates = [
    ...[...html.matchAll(/href=["']tel:([^"']+)/gi)].map(match => match[1]),
    ...[...visible.matchAll(/\b(?:1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]*[2-9]\d{2}[\s.-]*\d{4}\b/g)].map(match => match[0]),
  ];
  return candidates.map(cleanPhone).find(Boolean) || "";
}

export function matchesLicenseLocation(html, row) {
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").toUpperCase();
  const license = String(row.license_number || "").toUpperCase().replace(/[^A-Z0-9]/g,"");
  if (license && new RegExp(`\\b${license}\\b`).test(text)) return true;
  const city = String(row.city || "").toUpperCase().replace(/[^A-Z0-9 ]/g,"").trim();
  const zip = String(row.zip || "").slice(0,5);
  if (city.length < 4 || !/^\d{5}$/.test(zip)) return false;
  const cityPattern = city.split(/\s+/).join("\\s+");
  return new RegExp(`\\b${cityPattern}\\b[\\s,]+(?:FL(?:ORIDA)?[\\s,]+)?${zip}\\b`).test(text);
}
