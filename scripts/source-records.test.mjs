import test from "node:test";
import assert from "node:assert/strict";
import { stringify } from "csv-stringify/sync";
import { parseFood, parseContractors, foodKey } from "../src/lib/source-records.mjs";

test("food refresh retains one identity when the filing contact changes", () => {
  const row = Array(28).fill("");
  row[2] = "Sample Kitchen"; row[3] = "100 Main St"; row[5] = "33101";
  row[7] = "old@example.com"; row[9] = "09/07/2026"; row[12] = "Mobile MFDV";
  const changed = [...row]; changed[7] = "new@example.com"; changed[8] = "Approved";
  const parsed = parseFood(stringify([Array(28).fill("header"), row, changed]));
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].email, "new@example.com");
  assert.equal(parsed[0].plan_review_status, "Approved");
  assert.equal(foodKey({ ...parsed[0], email: "other@example.com" }), parsed[0].record_key);
});

test("food parser rejects a web page and excludes unusable contacts", () => {
  assert.throws(() => parseFood("<html>Access denied</html>"), /markup/);
  const row = Array(28).fill(""); row[2] = "Business"; row[9] = "09/07/2026"; row[7] = "invalid";
  assert.deepEqual(parseFood(stringify([Array(28).fill("header"), row])), []);
});

test("contractor cohort excludes expired, inactive, non-Florida and non-contractor rows", () => {
  const row = Array(21).fill("");
  row[1] = "CGC"; row[2] = "Example Builder"; row[9] = "FL"; row[12] = "123";
  row[13] = "C"; row[14] = "A"; row[17] = "08/31/2028"; row[20] = "CGC123";
  const variants = [[17,"08/31/2026"],[14,"I"],[9,"GA"],[1,"QB"]].map(([i,value]) => { const r=[...row];r[i]=value;return r; });
  const parsed = parseContractors(stringify([row, row, ...variants]), "2026-09-08");
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].license_number, "CGC123");
  assert.equal(parsed[0].trade, "Cert General");
  assert.equal(+parsed[0].days_until_expiry, 723);
});
