import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import ts from "typescript";
import { parse } from "csv-parse/sync";
import { toCsv, csvStream } from "../src/lib/csv.mjs";

const compiled = ts.transpileModule(fs.readFileSync("src/lib/subscription-delivery.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function harness() {
  const state = { since: null, through: "2026-09-08T01:00:00Z", records: [{ business_name: "One", email: "one@example.com" }], jobs: new Map(), calls: [], fail: false };
  const sql = {
    async query(query, args = []) {
      if (query.includes("pg_advisory_xact_lock")) return [];
      if (query.includes("FROM fl_food_available")) {
        assert.match(query, /first_seen > \$1/); assert.match(query, /first_seen <= boundary.through/);
        return [{ through: state.through, rows: state.records }];
      }
      if (query.startsWith("INSERT INTO subscription_deliveries")) {
        if (!state.jobs.has(args[0])) state.jobs.set(args[0], { payload: JSON.parse(args[4]), through_at: args[2], row_count: args[3], status: "pending", first_attempt_at: null, locked: false });
        return [];
      }
      const job = state.jobs.get(args[0]);
      if (query.includes("SET locked_until=now()")) {
        if (job.status !== "pending" || job.locked || (job.first_attempt_at && Date.parse(job.first_attempt_at) < Date.now()-23*3600000)) return [];
        job.locked = true; job.first_attempt_at ||= new Date().toISOString(); return [job];
      }
      if (query.startsWith("SELECT status")) return [job];
      if (query.includes("SET status='sent'")) { job.status = "sent"; return []; }
      if (query.includes("SET last_delivered_at")) { state.since = args[1]; return []; }
      if (query.includes("SET locked_until=NULL")) { if (job) job.locked = false; return []; }
      throw new Error("Unexpected database call");
    },
    transaction(queries) { return Promise.all(queries); },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Buffer, Date, AbortSignal, console: { error() {} },
    process: { env: { RESEND_API_KEY: "test", RESEND_FROM: "test@example.com" } },
    require(name) {
      if (name === "node:crypto") return crypto;
      if (name === "@/lib/db") return { getSql: () => sql, getActiveSubscriptions: async () => [{ stripe_subscription_id: "sub_test", email: "customer@example.com", last_delivered_at: state.since }] };
      if (name === "@/lib/products") return { getOneTimeProductById: () => ({ columns: ["business_name", "email"] }) };
      if (name === "@/lib/csv.mjs") return { toCsv };
      throw new Error(name);
    },
    async fetch(url, options) {
      state.calls.push({ url, options });
      if (state.fail) throw new Error("Simulated connection failure");
      return { ok: true, json: async () => ({ id: "email_test" }) };
    },
  });
  return { state, deliver: exports.deliverSubscriptions };
}

test("delivery advances only to the captured cutoff after provider acceptance", async () => {
  const { state, deliver } = harness();
  const result = await deliver();
  assert.equal(result.results[0].status, "accepted");
  assert.equal(state.since, state.through);
  assert.equal(state.calls.length, 1);
});

test("retry keeps the original payload and cutoff even when more records arrive", async () => {
  const { state, deliver } = harness(); state.fail = true;
  assert.equal((await deliver()).results[0].status, "failed");
  assert.equal(state.since, null);
  const originalCutoff = state.through;
  state.through = "2026-09-08T02:00:00Z"; state.records.push({ business_name: "Later", email: "later@example.com" }); state.fail = false;
  assert.equal((await deliver()).results[0].status, "accepted");
  assert.equal(state.calls[0].options.body, state.calls[1].options.body);
  assert.equal(state.calls[0].options.headers["Idempotency-Key"], state.calls[1].options.headers["Idempotency-Key"]);
  assert.equal(state.since, originalCutoff);
});

test("overlapping cron and welcome calls claim one provider send", async () => {
  const { state, deliver } = harness();
  const results = await Promise.all([deliver(), deliver()]);
  assert.equal(state.calls.length, 1);
  assert.equal(results.filter(r => r.results[0].status === "accepted").length, 1);
});

test("an uncertain delivery outside the provider idempotency window is not resent", async () => {
  const { state, deliver } = harness(); state.fail = true; await deliver();
  [...state.jobs.values()][0].first_attempt_at = new Date(Date.now()-25*3600000).toISOString(); state.fail = false;
  assert.equal((await deliver()).results[0].status, "failed");
  assert.equal(state.calls.length, 1);
  assert.equal(state.since, null);
});

test("CSV attachments preserve commas, quotes and multiline business fields", () => {
  const rows = [{ name: 'Kitchen, "North"', note: 'One\r\nTwo' }];
  assert.deepEqual(parse(toCsv(rows, ["name", "note"]), { columns: true }), rows);
});

test("streamed downloads preserve every row across chunk and Unicode boundaries", async () => {
  const rows = Array.from({length: 600}, (_, i) => ({ name: `Café ${i}, LLC`, note: 'A"B' }));
  const result = await new Response(csvStream(rows, ["name", "note"])).text();
  assert.deepEqual(parse(result, { columns: true }), rows);
});
