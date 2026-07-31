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
