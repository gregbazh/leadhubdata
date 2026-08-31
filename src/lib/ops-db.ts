import { getSql } from "@/lib/db";

// Read side of the ops schema (ops/schema.sql), plus the two writes the app
// itself performs: conversion attribution from the Stripe webhook and reply
// events from the Resend inbound webhook.
//
// Schema changes belong in ops/schema.sql and are applied by ops/migrate.mjs.
// Nothing here creates tables: the admin panel failing loudly on a missing
// table is better than a web request silently running DDL.

export const DEPARTMENTS = ["marketing", "product", "developer"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export type PeriodStats = {
  revenue_cents: number;
  conversions: number;
  sends: number;
  bounces: number;
  replies: number;
  sample_requests: number;
};

const EMPTY: PeriodStats = {
  revenue_cents: 0,
  conversions: 0,
  sends: 0,
  bounces: 0,
  replies: 0,
  sample_requests: 0,
};

// One round trip for a whole period. `days` back from `offsetDays` ago, so the
// same function serves both halves of a period-over-period comparison.
export async function periodStats(days: number, offsetDays = 0): Promise<PeriodStats> {
  const sql = getSql();
  const start = `${offsetDays + days} days`;
  const end = `${offsetDays} days`;
  const rows = (await sql.query(
    `SELECT
       (SELECT coalesce(sum(amount_total), 0)::int FROM conversions
          WHERE created_at >= now() - $1::interval AND created_at < now() - $2::interval) AS revenue_cents,
       (SELECT count(*)::int FROM conversions
          WHERE created_at >= now() - $1::interval AND created_at < now() - $2::interval) AS conversions,
       (SELECT count(*)::int FROM email_sends
          WHERE sent_at >= now() - $1::interval AND sent_at < now() - $2::interval) AS sends,
       (SELECT count(*)::int FROM email_events
          WHERE event_type = 'bounce'
            AND occurred_at >= now() - $1::interval AND occurred_at < now() - $2::interval) AS bounces,
       (SELECT count(*)::int FROM email_events
          WHERE event_type = 'reply'
            AND occurred_at >= now() - $1::interval AND occurred_at < now() - $2::interval) AS replies,
       (SELECT count(*)::int FROM sample_requests
          WHERE created_at >= now() - $1::interval AND created_at < now() - $2::interval) AS sample_requests`,
    [start, end]
  )) as PeriodStats[];
  return rows[0] ?? EMPTY;
}

export type CampaignRow = {
  campaign: string;
  variant: string | null;
  sends: number;
  bounces: number;
  replies: number;
  conversions: number;
  revenue_cents: number;
};

// Per-campaign and per-variant performance. Bounces and replies join on the
// address; conversions join on campaign + variant, because attribution is
// deliberately campaign-level and there is no per-recipient identifier.
export async function campaignPerformance(days = 30): Promise<CampaignRow[]> {
  const sql = getSql();
  return (await sql.query(
    `WITH s AS (
       SELECT campaign, variant, email
       FROM email_sends
       WHERE sent_at >= now() - $1::interval
     ),
     agg AS (
       SELECT s.campaign,
              s.variant,
              count(*)::int AS sends,
              count(*) FILTER (WHERE ev.event_type = 'bounce')::int AS bounces,
              count(*) FILTER (WHERE ev.event_type = 'reply')::int  AS replies
       FROM s
       LEFT JOIN email_events ev ON ev.email = s.email
       GROUP BY s.campaign, s.variant
     ),
     conv AS (
       SELECT campaign, variant,
              count(*)::int AS conversions,
              coalesce(sum(amount_total), 0)::int AS revenue_cents
       FROM conversions
       WHERE created_at >= now() - $1::interval
       GROUP BY campaign, variant
     )
     SELECT agg.campaign,
            agg.variant,
            agg.sends,
            agg.bounces,
            agg.replies,
            coalesce(conv.conversions, 0) AS conversions,
            coalesce(conv.revenue_cents, 0) AS revenue_cents
     FROM agg
     LEFT JOIN conv ON conv.campaign = agg.campaign
                   AND conv.variant IS NOT DISTINCT FROM agg.variant
     ORDER BY agg.sends DESC`,
    [`${days} days`]
  )) as CampaignRow[];
}

export type ExperimentRow = {
  id: string;
  department: string;
  hypothesis: string;
  change_summary: string;
  measurable: boolean;
  status: string;
  metric: string;
  min_sends: number;
  min_days: number;
  started_at: string | null;
  concluded_at: string | null;
  decision: string | null;
  decision_note: string | null;
  result: Record<string, unknown> | null;
  sends_so_far: number;
  days_elapsed: number;
};

// The live experiment plus how far it is from ripe. Both thresholds must clear
// before the result may be read, so the panel shows both counters.
export async function liveExperiment(): Promise<ExperimentRow | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT e.*,
            (SELECT count(*)::int FROM email_sends WHERE experiment_id = e.id) AS sends_so_far,
            coalesce(floor(extract(epoch FROM now() - e.started_at) / 86400)::int, 0) AS days_elapsed
     FROM experiments e
     WHERE e.status IN ('running', 'waiting_for_data', 'evaluating')
     ORDER BY e.measurable DESC, e.started_at
     LIMIT 1`
  )) as ExperimentRow[];
  return rows[0] ?? null;
}

export async function recentExperiments(limit = 10): Promise<ExperimentRow[]> {
  const sql = getSql();
  return (await sql.query(
    `SELECT e.*,
            (SELECT count(*)::int FROM email_sends WHERE experiment_id = e.id) AS sends_so_far,
            coalesce(floor(extract(epoch FROM now() - e.started_at) / 86400)::int, 0) AS days_elapsed
     FROM experiments e
     WHERE e.status = 'concluded'
     ORDER BY e.concluded_at DESC NULLS LAST
     LIMIT $1`,
    [limit]
  )) as ExperimentRow[];
}

export type DeptStateRow = {
  department: string;
  status: string;
  objective: string | null;
  experiment_id: string | null;
  blocked_on: string | null;
  last_run_at: string | null;
  updated_at: string;
  // The latest checkpoint line — what the department is doing right now.
  doing_now: string | null;
  running: boolean;
  run_started_at: string | null;
  pending_command: string | null;
  // The open experiment, so the card can expand into the full plan.
  exp_id: string | null;
  exp_status: string | null;
  hypothesis: string | null;
  change_summary: string | null;
  metric: string | null;
  measurable: boolean | null;
  min_sends: number | null;
  min_days: number | null;
  sends_so_far: number | null;
  days_elapsed: number | null;
  plan_proposal_id: string | null;
  plan_proposal_status: string | null;
  steps: { note: string; at: string }[] | null;
  plan_steps: { text: string; done: boolean }[] | null;
};

export async function departmentStates(): Promise<DeptStateRow[]> {
  const sql = getSql();
  return (await sql.query(
    `SELECT d.department, d.status, d.objective, d.experiment_id, d.blocked_on,
            d.last_run_at, d.updated_at,
            d.checkpoint->>'note' AS doing_now,
            d.checkpoint->'steps' AS steps,
            r.started_at AS run_started_at,
            (r.id IS NOT NULL) AS running,
            (SELECT c.action FROM commands c
              WHERE c.department = d.department AND c.status IN ('pending','running')
              ORDER BY c.id LIMIT 1) AS pending_command,
            e.id AS exp_id, e.status AS exp_status, e.hypothesis, e.change_summary,
            e.metric, e.measurable, e.min_sends, e.min_days, e.plan_steps,
            (SELECT count(*)::int FROM email_sends WHERE experiment_id = e.id) AS sends_so_far,
            coalesce(floor(extract(epoch FROM now() - e.started_at) / 86400)::int, 0) AS days_elapsed,
            p.id AS plan_proposal_id, p.status AS plan_proposal_status
     FROM dept_state d
     LEFT JOIN LATERAL (
       SELECT id, started_at FROM runs
       WHERE department = d.department AND ended_at IS NULL
         AND started_at > now() - interval '1 hour'
       ORDER BY id DESC LIMIT 1
     ) r ON true
     LEFT JOIN LATERAL (
       SELECT * FROM experiments
       WHERE department = d.department
         AND status IN ('planned','running','waiting_for_data','evaluating')
       ORDER BY created_at DESC LIMIT 1
     ) e ON true
     LEFT JOIN LATERAL (
       SELECT id, status FROM proposals
       WHERE kind = 'plan' AND payload->>'experiment_id' = e.id
       ORDER BY id DESC LIMIT 1
     ) p ON true
     ORDER BY d.department`
  )) as DeptStateRow[];
}

export async function queueCommand(department: string, action: string): Promise<void> {
  const sql = getSql();
  // One outstanding command per department; pressing a button twice while the
  // watcher is mid-poll should not queue the work twice.
  await sql.query(
    `INSERT INTO commands (department, action)
     SELECT $1, $2
     WHERE NOT EXISTS (
       SELECT 1 FROM commands
       WHERE department = $1 AND status IN ('pending','running')
     )`,
    [department, action]
  );
}

// bigserial columns arrive from the driver as strings, not numbers. Typed as
// they actually are so nothing downstream does arithmetic on them by accident.
export type RunRow = {
  id: string;
  department: string;
  outcome: string;
  reason: string | null;
  summary: string | null;
  duration_ms: number | null;
  started_at: string;
};

export async function recentRuns(limit = 25): Promise<RunRow[]> {
  const sql = getSql();
  return (await sql.query(
    `SELECT id, department, outcome, reason, summary, duration_ms, started_at
     FROM runs ORDER BY started_at DESC LIMIT $1`,
    [limit]
  )) as RunRow[];
}

export type ProposalRow = {
  id: string;
  department: string;
  kind: string;
  title: string;
  detail: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
};

export async function pendingProposals(): Promise<ProposalRow[]> {
  const sql = getSql();
  return (await sql.query(
    `SELECT id, department, kind, title, detail, payload, status, created_at
     FROM proposals WHERE status = 'pending' ORDER BY created_at`
  )) as ProposalRow[];
}

export async function decideProposal(id: number, approve: boolean): Promise<void> {
  const sql = getSql();
  await sql.query(
    `UPDATE proposals SET status = $2, decided_at = now()
     WHERE id = $1 AND status = 'pending'`,
    [id, approve ? "approved" : "rejected"]
  );
}

export type MessageRow = {
  id: string;
  department: string;
  role: string;
  body: string;
  needs_answer: boolean;
  answered_at: string | null;
  created_at: string;
};

export async function messagesFor(department: string, limit = 100): Promise<MessageRow[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, department, role, body, needs_answer, answered_at, created_at
     FROM messages WHERE department = $1 ORDER BY created_at DESC LIMIT $2`,
    [department, limit]
  )) as MessageRow[];
  return rows.reverse();
}

export async function postOwnerMessage(department: string, body: string): Promise<void> {
  const sql = getSql();
  await sql.query(`INSERT INTO messages (department, role, body) VALUES ($1, 'owner', $2)`, [
    department,
    body,
  ]);
  // Anything the agent flagged as a question is answered by the owner's reply,
  // so the next run reads the answer instead of asking again.
  await sql.query(
    `UPDATE messages SET needs_answer = false, answered_at = now()
     WHERE department = $1 AND needs_answer`,
    [department]
  );
}

// The watcher beats every couple of seconds. Anything older than half a minute
// means it is not running, whatever the panel otherwise looks like.
export async function watcherAlive(): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT beat_at > now() - interval '30 seconds' AS alive FROM watcher_heartbeat WHERE id = 1`
  )) as { alive: boolean }[];
  return rows[0]?.alive ?? false;
}

export async function getOwnerNotes(): Promise<string> {
  const sql = getSql();
  const rows = (await sql.query(`SELECT body FROM owner_notes WHERE id = 1`)) as { body: string }[];
  return rows[0]?.body ?? "";
}

export async function setOwnerNotes(body: string): Promise<void> {
  const sql = getSql();
  await sql.query(
    `INSERT INTO owner_notes (id, body, updated_at) VALUES (1, $1, now())
     ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, updated_at = now()`,
    [body.slice(0, 20000)]
  );
}

export async function unansweredCount(): Promise<number> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT count(*)::int AS n FROM messages WHERE needs_answer`
  )) as { n: number }[];
  return rows[0]?.n ?? 0;
}

// --- writes performed by the app's own webhooks ----------------------------

export async function recordConversion(p: {
  sessionId: string;
  email: string;
  productId: string;
  amountTotal: number | null;
  campaign: string | null;
  variant: string | null;
  utmSource: string | null;
  utmMedium: string | null;
}): Promise<void> {
  const sql = getSql();
  // The experiment that owns this campaign+variant at the time of sale. Read
  // from the send log rather than stored on the link, so a purchase always
  // lands against the experiment that actually mailed the recipient.
  await sql.query(
    `INSERT INTO conversions
       (session_id, email, product_id, amount_total, campaign, variant, utm_source, utm_medium, experiment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
       (SELECT experiment_id FROM email_sends
         WHERE campaign IS NOT DISTINCT FROM $5
           AND variant IS NOT DISTINCT FROM $6
           AND experiment_id IS NOT NULL
         ORDER BY sent_at DESC LIMIT 1))
     ON CONFLICT (session_id) DO NOTHING`,
    [
      p.sessionId,
      p.email.toLowerCase(),
      p.productId,
      p.amountTotal,
      p.campaign,
      p.variant,
      p.utmSource,
      p.utmMedium,
    ]
  );
}

export async function recordEmailEvent(p: {
  email: string;
  eventType: "bounce" | "reply" | "complaint" | "unsubscribe";
  intent?: string | null;
  detail?: string | null;
}): Promise<void> {
  const sql = getSql();
  // Replies are not deduped -- a prospect may legitimately write twice, and the
  // partial unique index only covers the one-per-address event types.
  await sql.query(
    `INSERT INTO email_events (email, event_type, intent, detail)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT DO NOTHING`,
    [p.email.toLowerCase(), p.eventType, p.intent ?? null, p.detail ?? null]
  );
}
