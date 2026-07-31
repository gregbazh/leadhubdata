// Product #6: Florida contractors with licenses expiring soon.
// Source: DBPR CONSTRUCTIONLICENSE_1.csv (headerless LICENSEE FILE layout).
// Output: deliverables/fl_contractors_expiring_90d.csv
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify/sync";

const INPUT = "data-work/CONSTRUCTIONLICENSE_1.csv";
const CE_FILE = "data-work/cilb_certified.csv"; // used to derive trade code -> description
const OUT_DIR = "deliverables";
const WINDOW_DAYS = 90;

// LICENSEE FILE layout (readme): board, occCode, name, dba, classCode,
// addr1, addr2, addr3, city, state, zip, countyCode, licNum, priStatus,
// secStatus, origDate, effDate, expDate, blank, renewalPeriod, altLic
const COL = {
  occCode: 1, name: 2, dba: 3, classCode: 4,
  addr1: 5, addr2: 6, addr3: 7, city: 8, state: 9, zip: 10,
  countyCode: 11, priStatus: 13, secStatus: 14,
  origDate: 15, expDate: 17, altLic: 20,
};

function parseDate(s) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((s || "").trim());
  if (!m) return null;
  return new Date(+m[3], +m[1] - 1, +m[2]);
}

async function buildTradeMap() {
  // CE file col0 = rank code (e.g. CGC), col1 = short description (e.g. "Cert General").
  const map = new Map();
  const parser = fs.createReadStream(CE_FILE).pipe(
    parse({ relax_column_count: true, relax_quotes: true })
  );
  for await (const row of parser) {
    if (row.length >= 2 && row[0] && !map.has(row[0])) map.set(row[0], row[1]);
  }
  return map;
}

async function main() {
  const tradeMap = fs.existsSync(CE_FILE) ? await buildTradeMap() : new Map();
  console.log(`Trade codes learned: ${tradeMap.size}`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const windowEnd = new Date(today.getTime() + WINDOW_DAYS * 86400000);

  const statusCounts = {};
  const out = [];
  let total = 0;

  const parser = fs.createReadStream(INPUT).pipe(
    parse({ relax_column_count: true, relax_quotes: true })
  );
  for await (const row of parser) {
    total++;
    const status = `${row[COL.priStatus]}/${row[COL.secStatus]}`;
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    // Current + Active only (inactive licensees don't need bonds/insurance now)
    if (row[COL.priStatus] !== "C" || row[COL.secStatus] !== "A") continue;

    const exp = parseDate(row[COL.expDate]);
    if (!exp || exp < today || exp > windowEnd) continue;

    const days = Math.round((exp - today) / 86400000);
    out.push({
      license_number: row[COL.altLic] || row[COL.occCode] + row[12],
      trade_code: row[COL.occCode],
      trade: tradeMap.get(row[COL.occCode]) || "",
      licensee_name: row[COL.name],
      dba_name: row[COL.dba],
      address: [row[COL.addr1], row[COL.addr2], row[COL.addr3]]
        .filter(Boolean).join(", "),
      city: row[COL.city],
      state: row[COL.state],
      zip: row[COL.zip],
      county_code: row[COL.countyCode],
      originally_licensed: row[COL.origDate],
      license_expires: row[COL.expDate],
      days_until_expiry: days,
    });
  }

  out.sort((a, b) => a.days_until_expiry - b.days_until_expiry);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `fl_contractors_expiring_${WINDOW_DAYS}d.csv`);
  fs.writeFileSync(outPath, stringify(out, { header: true }));

  console.log(`Total rows scanned: ${total}`);
  console.log("Status breakdown:", statusCounts);
  console.log(`Expiring within ${WINDOW_DAYS} days (Current/Active): ${out.length}`);
  console.log(`Wrote ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
