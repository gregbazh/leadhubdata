import { neon } from "@neondatabase/serverless";

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// Lazily create the tables the account system needs. Memoized per lambda
// instance so the DDL round-trip only happens once per cold start. All
// statements are idempotent, so concurrent instances are safe.
let schemaReady: Promise<void> | null = null;

export function ensureAccountSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql.query(`
        CREATE TABLE IF NOT EXISTS purchases (
          session_id   text PRIMARY KEY,
          email        text NOT NULL,
          product_id   text NOT NULL,
          amount_total integer,
          created_at   timestamptz NOT NULL DEFAULT now()
        )`);
      await sql.query(
        `CREATE INDEX IF NOT EXISTS purchases_email_idx ON purchases (email)`
      );
      await sql.query(`
        CREATE TABLE IF NOT EXISTS login_codes (
          id         bigserial PRIMARY KEY,
          email      text NOT NULL,
          code_hash  text NOT NULL,
          expires_at timestamptz NOT NULL,
          attempts   integer NOT NULL DEFAULT 0,
          used       boolean NOT NULL DEFAULT false,
          created_at timestamptz NOT NULL DEFAULT now()
        )`);
      await sql.query(
        `CREATE INDEX IF NOT EXISTS login_codes_email_idx ON login_codes (email, created_at)`
      );
    })().catch((err) => {
      // Allow a retry on the next request instead of caching the failure.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

// Sample requests are the only capture point for the ~99% of visitors who
// don't buy on the first visit, so they're stored even though the sample is
// emailed immediately -- the address is the asset, not the delivery receipt.
let sampleSchemaReady: Promise<void> | null = null;

export function ensureSampleSchema(): Promise<void> {
  if (!sampleSchemaReady) {
    sampleSchemaReady = (async () => {
      const sql = getSql();
      await sql.query(`
        CREATE TABLE IF NOT EXISTS sample_requests (
          id         bigserial PRIMARY KEY,
          email      text NOT NULL,
          product_id text NOT NULL,
          filter     text,
          created_at timestamptz NOT NULL DEFAULT now()
        )`);
      await sql.query(
        `CREATE INDEX IF NOT EXISTS sample_requests_email_idx ON sample_requests (email, created_at)`
      );
    })().catch((err) => {
      sampleSchemaReady = null;
      throw err;
    });
  }
  return sampleSchemaReady;
}

// One sample per address per product per day, so the form can't be used to
// drain the list a hundred rows at a time.
export async function recentSampleCount(email: string, productId: string): Promise<number> {
  await ensureSampleSchema();
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT count(*)::int AS n FROM sample_requests
     WHERE email = $1 AND product_id = $2 AND created_at > now() - interval '24 hours'`,
    [email.toLowerCase(), productId]
  )) as { n: number }[];
  return rows[0]?.n ?? 0;
}

export async function recordSampleRequest(p: {
  email: string;
  productId: string;
  filter: string | null;
}): Promise<void> {
  await ensureSampleSchema();
  const sql = getSql();
  await sql.query(
    `INSERT INTO sample_requests (email, product_id, filter) VALUES ($1, $2, $3)`,
    [p.email.toLowerCase(), p.productId, p.filter]
  );
}

// Active subscribers and how far through the feed each one has been served.
// last_delivered_at is the watermark: a delivery sends every business whose
// first_seen is newer than it, so a missed week self-heals on the next run
// instead of silently skipping records the subscriber paid for.
let subscriptionSchemaReady: Promise<void> | null = null;

export function ensureSubscriptionSchema(): Promise<void> {
  if (!subscriptionSchemaReady) {
    subscriptionSchemaReady = (async () => {
      const sql = getSql();
      await sql.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          stripe_subscription_id text PRIMARY KEY,
          email                  text NOT NULL,
          status                 text NOT NULL,
          created_at             timestamptz NOT NULL DEFAULT now(),
          last_delivered_at      timestamptz
        )`);
      await sql.query(
        `CREATE INDEX IF NOT EXISTS subscriptions_email_idx ON subscriptions (email)`
      );
    })().catch((err) => {
      subscriptionSchemaReady = null;
      throw err;
    });
  }
  return subscriptionSchemaReady;
}

export type SubscriptionRow = {
  stripe_subscription_id: string;
  email: string;
  status: string;
  created_at: string;
  last_delivered_at: string | null;
};

export async function upsertSubscription(p: {
  stripeSubscriptionId: string;
  email: string;
  status: string;
}): Promise<void> {
  await ensureSubscriptionSchema();
  const sql = getSql();
  await sql.query(
    `INSERT INTO subscriptions (stripe_subscription_id, email, status)
     VALUES ($1, $2, $3)
     ON CONFLICT (stripe_subscription_id)
     DO UPDATE SET status = EXCLUDED.status, email = EXCLUDED.email`,
    [p.stripeSubscriptionId, p.email.toLowerCase(), p.status]
  );
}

export async function getActiveSubscriptions(): Promise<SubscriptionRow[]> {
  await ensureSubscriptionSchema();
  const sql = getSql();
  return (await sql.query(
    `SELECT stripe_subscription_id, email, status, created_at, last_delivered_at
     FROM subscriptions WHERE status IN ('active', 'trialing') ORDER BY created_at`
  )) as SubscriptionRow[];
}

export async function hasActiveSubscription(email: string): Promise<boolean> {
  await ensureSubscriptionSchema();
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT 1 FROM subscriptions WHERE email = $1 AND status IN ('active', 'trialing') LIMIT 1`,
    [email.toLowerCase()]
  )) as unknown[];
  return rows.length > 0;
}

export async function markDelivered(stripeSubscriptionId: string): Promise<void> {
  await ensureSubscriptionSchema();
  const sql = getSql();
  await sql.query(
    `UPDATE subscriptions SET last_delivered_at = now() WHERE stripe_subscription_id = $1`,
    [stripeSubscriptionId]
  );
}

export type PurchaseRow = {
  session_id: string;
  email: string;
  product_id: string;
  amount_total: number | null;
  created_at: string;
};

// Idempotent: replays of the same Stripe session are ignored.
export async function recordPurchase(p: {
  sessionId: string;
  email: string;
  productId: string;
  amountTotal: number | null;
}): Promise<void> {
  await ensureAccountSchema();
  const sql = getSql();
  await sql.query(
    `INSERT INTO purchases (session_id, email, product_id, amount_total)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (session_id) DO NOTHING`,
    [p.sessionId, p.email.toLowerCase(), p.productId, p.amountTotal]
  );
}

export async function getPurchasesByEmail(email: string): Promise<PurchaseRow[]> {
  await ensureAccountSchema();
  const sql = getSql();
  return (await sql.query(
    `SELECT session_id, email, product_id, amount_total, created_at
     FROM purchases WHERE email = $1 ORDER BY created_at DESC`,
    [email.toLowerCase()]
  )) as PurchaseRow[];
}
