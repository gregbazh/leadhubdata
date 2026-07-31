import crypto from "node:crypto";

// Verification + parsing helpers for Resend inbound ("email.received") webhooks.
// Kept dependency-free and pure so they can be unit-tested without a server.

export type Intent = "unsubscribe" | "sample" | "other";

export interface SvixHeaders {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
}

// Resend signs webhooks with the Svix / Standard Webhooks scheme:
// base64( HMAC-SHA256( `${id}.${timestamp}.${rawBody}` ) ), keyed on the
// base64-decoded portion of the secret after the `whsec_` prefix. The
// signature header may carry several space-delimited `v1,<sig>` entries
// (secret rotation) -- any match is valid. Headers also come in `webhook-*`
// aliases on some plans, which the route normalizes before calling this.
export function verifyResendSignature(opts: {
  rawBody: string;
  headers: SvixHeaders;
  secret: string;
  toleranceSec?: number;
  now?: number;
}): boolean {
  const { rawBody, headers, secret } = opts;
  const tolerance = opts.toleranceSec ?? 300;
  const now = opts.now ?? Date.now();

  if (!headers.id || !headers.timestamp || !headers.signature || !secret) return false;

  // Replay protection: reject timestamps outside the tolerance window.
  const ts = Number(headers.timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(now / 1000 - ts) > tolerance) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${headers.id}.${headers.timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", key).update(signedContent).digest("base64");
  const expectedBuf = Buffer.from(expected);

  return headers.signature.split(" ").some((part) => {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    if (!sig) return false;
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf);
  });
}

// Cut a reply down to just what the person typed, dropping the quoted original
// beneath it. This is essential: our own template contains the words "SAMPLE"
// and "unsubscribe", so without stripping the quote every reply would match
// both intents. We cut at the first common quote marker.
const QUOTE_MARKERS: RegExp[] = [
  /^>.*/m, // quoted lines
  /^On .+ wrote:$/m, // Gmail / Apple Mail
  /^-{2,}\s*Original Message\s*-{2,}/im, // Outlook
  /^_{5,}/m, // Outlook divider
  /^From:\s.+/m, // forwarded/replied header block
  /^Sent from my /m, // mobile signatures often precede quotes
  /^\s*El .+ escribió:$/m, // Spanish clients
];

export function stripQuotedReply(text: string): string {
  if (!text) return "";
  const normalized = text.replace(/\r\n/g, "\n");
  let cut = normalized.length;
  for (const re of QUOTE_MARKERS) {
    const m = re.exec(normalized);
    if (m && m.index < cut) cut = m.index;
  }
  return normalized.slice(0, cut).trim();
}

const UNSUBSCRIBE_RE = /\b(unsubscribe|remove me|opt(?:\s+me)?[\s-]*out|take me off|stop emailing|do not (?:email|contact))\b/i;
const SAMPLE_RE = /\bsample\b/i;

// Detect intent from the recipient's own words (quote already stripped).
// Unsubscribe wins ties -- honoring an opt-out is legally required and always
// takes priority over a sample request in the same message.
export function detectIntent(replyText: string): Intent {
  const body = stripQuotedReply(replyText);
  if (UNSUBSCRIBE_RE.test(body)) return "unsubscribe";
  if (SAMPLE_RE.test(body)) return "sample";
  return "other";
}

// Guard against auto-reply loops: never auto-respond to system senders or to
// our own sending address.
export function isAutomatedSender(from: string, ownDomain?: string): boolean {
  const addr = (from || "").toLowerCase();
  if (/(^|<)(mailer-daemon|postmaster|no-?reply|do-?not-?reply|bounce|notifications?)@/.test(addr)) {
    return true;
  }
  if (ownDomain && addr.includes(`@${ownDomain.toLowerCase()}`)) return true;
  return false;
}

// Pull a bare email address out of a possibly-decorated From header
// ("Name <a@b.com>" -> "a@b.com").
export function extractEmail(from: string): string {
  const m = /<([^>]+)>/.exec(from || "");
  return (m ? m[1] : from || "").trim().toLowerCase();
}
