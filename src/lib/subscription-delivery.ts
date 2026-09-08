import { createHash } from "node:crypto";
import { getSql, getActiveSubscriptions } from "@/lib/db";
import { getOneTimeProductById } from "@/lib/products";
import { toCsv } from "@/lib/csv.mjs";

export async function deliverSubscriptions(onlySubscriptionId?: string) {
  if (!process.env.RESEND_API_KEY || !(process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM)) throw new Error("Delivery email is not configured");
  const sql = getSql();
  const subscribers = (await getActiveSubscriptions()).filter(s => !onlySubscriptionId || s.stripe_subscription_id === onlySubscriptionId);
  const results: { status: string; rows: number }[] = [];
  for (const sub of subscribers) {
    const since = sub.last_delivered_at;
    const id = createHash("sha256").update(`${sub.stripe_subscription_id}|${since || "archive"}`).digest("hex");
    try {
      // Share the refresh lock so the cutoff cannot pass records that have not committed yet.
      const [, snapshot] = await sql.transaction([
        sql.query("SELECT pg_advisory_xact_lock(70101)"),
        sql.query(`WITH boundary AS MATERIALIZED (SELECT clock_timestamp() AS through)
          SELECT through::text, coalesce((SELECT jsonb_agg(r ORDER BY to_date(r.application_date,'MM/DD/YYYY') DESC, r.record_key)
            FROM fl_food_available r WHERE ($1::timestamptz IS NULL OR first_seen > $1::timestamptz) AND first_seen <= boundary.through), '[]'::jsonb) AS rows
          FROM boundary`, [since]),
      ]);
      const { through, rows } = snapshot[0];
      if (!rows.length) { results.push({ status: "nothing_new", rows: 0 }); continue; }
      const product = getOneTimeProductById("fl-restaurants")!;
      const payload = {
        from: process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM,
        to: [sub.email], reply_to: process.env.RESEND_REPLY_TO || undefined,
        subject: since ? `${rows.length.toLocaleString()} additions to your Florida food-business list` : "Your Florida food-business archive",
        text: [since ? `${rows.length.toLocaleString()} records were added since your last delivery.` : `Your food-business archive is attached: ${rows.length.toLocaleString()} filing records.`,
          "", "These are public-record business prospects. Application dates and source-check dates are included; some filings are historical.", "",
          `Download all your lists and manage your subscription: ${process.env.NEXT_PUBLIC_BASE_URL || "https://www.leadhubdata.com"}/account`, "", "Questions? Reply to this email."].join("\n"),
        attachments: [{ filename: `fl_food_businesses_${through.slice(0,10)}.csv`, content: Buffer.from(toCsv(rows, product.columns)).toString("base64") }],
      };
      // Persist the exact message before sending. Retries must use the same body and idempotency key.
      await sql.query(`INSERT INTO subscription_deliveries (id, subscription_id, through_at, row_count, payload) VALUES ($1,$2,$3,$4,$5::jsonb) ON CONFLICT (id) DO NOTHING`, [id, sub.stripe_subscription_id, through, rows.length, JSON.stringify(payload)]);
      const [job] = await sql.query(`UPDATE subscription_deliveries SET locked_until=now()+interval '5 minutes', first_attempt_at=coalesce(first_attempt_at,now())
        WHERE id=$1 AND status='pending' AND (locked_until IS NULL OR locked_until<now())
        AND (first_attempt_at IS NULL OR first_attempt_at>now()-interval '23 hours')
        AND EXISTS (SELECT 1 FROM subscriptions WHERE stripe_subscription_id=$2 AND status IN ('active','trialing'))
        RETURNING payload, through_at, row_count`, [id, sub.stripe_subscription_id]);
      if (!job) {
        const [existing] = await sql.query("SELECT status, first_attempt_at FROM subscription_deliveries WHERE id=$1", [id]);
        if (existing?.status === "pending" && existing.first_attempt_at && Date.parse(existing.first_attempt_at) < Date.now()-23*3600000) throw new Error("Delivery needs reconciliation before retrying outside the provider idempotency window");
        results.push({ status: "already_claimed", rows: 0 }); continue;
      }
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `food-delivery/${id}` },
        body: JSON.stringify(job.payload),
      });
      if (!response.ok) throw new Error(`Delivery provider returned ${response.status}`);
      const result = await response.json();
      if (typeof result.id !== "string") throw new Error("Delivery provider returned no email ID");
      await sql.transaction([
        sql.query("UPDATE subscription_deliveries SET status='sent', resend_id=$2, locked_until=NULL WHERE id=$1", [id, result.id]),
        sql.query("UPDATE subscriptions SET last_delivered_at=$2 WHERE stripe_subscription_id=$1 AND (last_delivered_at IS NULL OR last_delivered_at<$2)", [sub.stripe_subscription_id, job.through_at]),
      ]);
      results.push({ status: "accepted", rows: job.row_count });
    } catch (error) {
      await sql.query("UPDATE subscription_deliveries SET locked_until=NULL WHERE id=$1 AND status='pending'", [id]);
      console.error("Subscription delivery failed:", error instanceof Error ? error.message : "Unknown error");
      results.push({ status: "failed", rows: 0 });
    }
  }
  return { subscribers: subscribers.length, results };
}
