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
