import { NextRequest, NextResponse } from "next/server";
import {
  verifyResendSignature,
  detectIntent,
  isAutomatedSender,
  extractEmail,
  stripQuotedReply,
  type SvixHeaders,
} from "@/lib/inbound";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Resend inbound webhook: fires "email.received" when someone replies to a
// campaign. The payload is metadata only, so we fetch the body by email_id,
// figure out what the person wants, auto-respond, and forward a copy to the
// owner's real inbox so a human can still follow up.
//
// Required env:
//   RESEND_API_KEY                  send auto-replies + fetch inbound content
//   RESEND_INBOUND_SIGNING_SECRET   whsec_... from the webhook's settings
//   RESEND_FROM                     verified From address for auto-replies
//   CAMPAIGN_OWNER_EMAIL            where replies get forwarded (your Gmail)
//   CAMPAIGN_CHECKOUT_URL           buy link sent in the SAMPLE auto-reply
//
// For this to receive anything, the campaign's reply_to must be an address on
// a domain whose MX points at Resend inbound. See the setup notes in chat.

// Best-effort in-memory idempotency. Resend retries with the same svix-id;
// this skips a retry that lands on a warm instance. Not durable across cold
// starts -- fine here because the worst case is a duplicate forward, and
// unsubscribe/blocklist actions are themselves idempotent.
const seen = new Set<string>();
const remember = (id: string) => {
  seen.add(id);
  if (seen.size > 500) seen.delete(seen.values().next().value as string);
};

async function fetchInboundContent(emailId: string): Promise<{ text: string; from: string; subject: string }> {
  const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  if (!res.ok) throw new Error(`receiving.get ${res.status}: ${await res.text().catch(() => "")}`);
  const data = await res.json();
  const text: string =
    data.text || (typeof data.html === "string" ? data.html.replace(/<[^>]+>/g, " ") : "") || "";
  return { text, from: data.from || "", subject: data.subject || "" };
}

async function sendEmail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [opts.to],
      reply_to: opts.replyTo || process.env.CAMPAIGN_OWNER_EMAIL || undefined,
      subject: opts.subject,
      text: opts.text,
    }),
  });
  if (!res.ok) {
    console.error(`resend-inbound: auto-send failed ${res.status}: ${await res.text().catch(() => "")}`);
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const secret = process.env.RESEND_INBOUND_SIGNING_SECRET;
  if (!secret) {
    console.error("resend-inbound: RESEND_INBOUND_SIGNING_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const h = req.headers;
  const headers: SvixHeaders = {
    id: h.get("svix-id") || h.get("webhook-id"),
    timestamp: h.get("svix-timestamp") || h.get("webhook-timestamp"),
    signature: h.get("svix-signature") || h.get("webhook-signature"),
  };
  if (!verifyResendSignature({ rawBody, headers, secret })) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: { type?: string; data?: { email_id?: string; from?: string; subject?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  // Acknowledge anything that isn't an inbound reply so Resend stops retrying.
  if (event.type !== "email.received" || !event.data?.email_id) {
    return NextResponse.json({ received: true });
  }

  const dedupeKey = headers.id || event.data.email_id;
  if (seen.has(dedupeKey)) return NextResponse.json({ received: true, deduped: true });
  remember(dedupeKey);

  const ownDomain = (process.env.RESEND_FROM || "").split("@")[1]?.replace(/>$/, "");
  const owner = process.env.CAMPAIGN_OWNER_EMAIL;

  let text = "";
  let from = event.data.from || "";
  let subject = event.data.subject || "";
  try {
    const content = await fetchInboundContent(event.data.email_id);
    text = content.text;
    from = content.from || from;
    subject = content.subject || subject;
  } catch (e) {
    console.error(`resend-inbound: ${(e as Error).message}`);
    // Still forward the metadata so the owner knows a reply came in.
    if (owner) {
      await sendEmail({
        to: owner,
        subject: `[reply] ${subject || "(no subject)"} — from ${from}`,
        text: `A reply came in from ${from} but the body couldn't be fetched (email_id ${event.data.email_id}). Check the Resend dashboard.`,
      });
    }
    return NextResponse.json({ received: true, note: "content fetch failed" });
  }

  const sender = extractEmail(from);
  const intent = detectIntent(text);
  const cleaned = stripQuotedReply(text);
  console.log(`resend-inbound: from=${sender} intent=${intent} subject=${JSON.stringify(subject)}`);

  const automated = isAutomatedSender(from, ownDomain);

  // Always forward the human's reply to the owner's real inbox.
  if (owner) {
    const tag = intent === "unsubscribe" ? "UNSUBSCRIBE — add to blocklist" : intent.toUpperCase();
    await sendEmail({
      to: owner,
      replyTo: sender,
      subject: `[reply · ${tag}] ${subject || "(no subject)"}`,
      text:
        `From: ${from}\nDetected intent: ${intent}\n` +
        (intent === "unsubscribe"
          ? `\nHonor it: node pipeline/bounce-sync.mjs --block ${sender} unsubscribe\n`
          : "") +
        `\n----- their message -----\n${cleaned || text}`,
    });
  }

  if (automated) {
    return NextResponse.json({ received: true, intent, autoReply: "skipped (automated sender)" });
  }

  if (intent === "unsubscribe") {
    await sendEmail({
      to: sender,
      subject: `Re: ${subject || "unsubscribe"}`,
      text: "You're unsubscribed — you won't hear from me again. Sorry for the interruption.",
    });
  } else if (intent === "sample") {
    const url = process.env.CAMPAIGN_CHECKOUT_URL;
    await sendEmail({
      to: sender,
      subject: `Re: ${subject || "your sample"}`,
      text:
        "Thanks for the reply! I'm pulling your free county sample now and will send it shortly.\n\n" +
        (url ? `If you'd rather grab the full list right away, it's here (one-time, instant CSV):\n${url}\n\n` : "") +
        "Either way I'll be in touch soon.",
    });
  }
  // "other" gets no auto-reply -- it's forwarded to the owner to handle by hand.

  return NextResponse.json({ received: true, intent });
}
