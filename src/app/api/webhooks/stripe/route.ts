import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById } from "@/lib/products";
import { recordPurchase, upsertSubscription, getSql } from "@/lib/db";
import { recordConversion } from "@/lib/ops-db";
import Stripe from "stripe";

export const runtime = "nodejs";

// Credit the sale to the campaign that produced it. Kept separate from
// recordPurchase so a failure here can never cost a customer their download --
// measurement is worth less than fulfilment.
async function attribute(session: Stripe.Checkout.Session, email: string, productId: string) {
  try {
    const m = session.metadata ?? {};
    await recordConversion({
      sessionId: session.id,
      email,
      productId,
      amountTotal: session.amount_total,
      campaign: m.campaign ?? null,
      variant: m.variant ?? null,
      utmSource: m.utm_source ?? null,
      utmMedium: m.utm_medium ?? null,
    });
  } catch (err) {
    console.error("webhook: failed to record conversion:", err);
  }
}

// Purchase receipt with a durable download link, so the buyer isn't stranded
// if they close the success page before downloading.
async function sendDownloadEmail(to: string, sessionId: string, productId: string) {
  const product = getOneTimeProductById(productId);
  if (!product || !process.env.RESEND_API_KEY || !(process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM)) return;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_TRANSACTIONAL_FROM || process.env.RESEND_FROM,
      to: [to],
      reply_to: process.env.RESEND_REPLY_TO || undefined,
      subject: `Your download: ${product.name}`,
      text: [
        `Thanks for your purchase.`,
        ``,
        `Download your CSV (${product.leadCount.toLocaleString()} leads):`,
        `${baseUrl}/api/download?session_id=${sessionId}`,
        ``,
        `This link is tied to your purchase and keeps working if you need to re-download.`,
        `Questions? Just reply to this email.`,
      ].join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("Download email failed:", res.status, await res.text().catch(() => ""));
  }
}

// New subscribers get their first delivery immediately by calling the same
// cron endpoint that runs weekly, so there is one code path for delivery and
// no chance of the welcome batch drifting from the recurring one.
async function sendSubscriptionWelcome(email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET not set — first delivery will wait for the weekly run");
    return;
  }
  try {
    const res = await fetch(`${baseUrl}/api/cron/deliver`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    if (!res.ok) console.error("welcome delivery failed:", res.status, await res.text().catch(() => ""));
    else console.log(`welcome delivery triggered for ${email}`);
  } catch (err) {
    console.error("welcome delivery error:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "payment" && session.metadata?.productId) {
        const email = session.customer_details?.email;
        console.log("One-time purchase completed:", {
          productId: session.metadata.productId,
          email,
          amount: session.amount_total,
        });
        if (email) {
          // Persist first so the buyer's /account works even if email fails.
          try {
            await recordPurchase({
              sessionId: session.id,
              email,
              productId: session.metadata.productId,
              amountTotal: session.amount_total,
            });
          } catch (err) {
            console.error("webhook: failed to record purchase:", err);
          }
          await attribute(session, email, session.metadata.productId);
          await sendDownloadEmail(email, session.id, session.metadata.productId);
        }
        break;
      }
      const subEmail = session.customer_details?.email;
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      console.log("New subscription created:", { subscriptionId: subId, email: subEmail });
      if (subEmail && subId) {
        try {
          await upsertSubscription({ stripeSubscriptionId: subId, email: subEmail, status: "active" });
        } catch (err) {
          console.error("webhook: failed to record subscription:", err);
        }
        await attribute(session, subEmail, session.metadata?.productId ?? "subscription");
        // The first delivery is the full archive, sent now rather than waiting
        // for the weekly cron -- nobody should pay $299 and get nothing today.
        await sendSubscriptionWelcome(subEmail);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const paidSub = invoice.parent?.subscription_details?.subscription;
      console.log("Invoice paid:", {
        customerId: invoice.customer,
        subscriptionId: paidSub,
        amountPaid: invoice.amount_paid,
      });
      // TODO: Deliver monthly leads to customer
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const failedSub = invoice.parent?.subscription_details?.subscription;
      console.log("Payment failed:", {
        customerId: invoice.customer,
        subscriptionId: failedSub,
      });
      // TODO: Notify customer of failed payment
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // "deleted" still arrives with a status ("canceled"); trust it either way
      // so a lapsed subscriber stops receiving deliveries immediately.
      const status = event.type === "customer.subscription.deleted" ? "canceled" : subscription.status;
      console.log(`Subscription ${event.type}:`, { id: subscription.id, status });
      try {
        const sql = getSql();
        await sql.query(`UPDATE subscriptions SET status = $1 WHERE stripe_subscription_id = $2`, [
          status,
          subscription.id,
        ]);
      } catch (err) {
        console.error("webhook: failed to update subscription status:", err);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
