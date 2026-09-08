import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSql } from "@/lib/db";
import { syncFood, syncContractors } from "@/lib/data-sync.mjs";
export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = getSql();
  const results = await Promise.allSettled([syncFood(sql), syncContractors(sql)]);
  for (const path of ["/", "/fl-contractors", "/fl-restaurants", "/fl-food-trucks", "/subscribe"]) revalidatePath(path);
  const summary = results.map((result, i) => ({ dataset: i === 0 ? "food" : "contractors", ...(result.status === "fulfilled" ? { ok: true, ...result.value } : { ok: false, error: result.reason instanceof Error ? result.reason.message : "Refresh failed" }) }));
  const ok = results.every(result => result.status === "fulfilled");
  console.log("Catalog refresh:", JSON.stringify(summary));
  return NextResponse.json({ ok, results: summary }, { status: ok ? 200 : 500 });
}
