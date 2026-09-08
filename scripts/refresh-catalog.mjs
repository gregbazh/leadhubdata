import { neon } from "@neondatabase/serverless";
import { syncFood, syncContractors } from "../src/lib/data-sync.mjs";
const sql = neon(process.env.DATABASE_URL);
for (const [name, sync] of [["food", syncFood], ["contractors", syncContractors]]) {
  console.log(JSON.stringify({ dataset: name, result: await sync(sql) }));
}
