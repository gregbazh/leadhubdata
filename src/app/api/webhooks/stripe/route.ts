import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

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
      console.log("New subscription created:", {
        customerId: session.customer,
        subscriptionId: session.subscription,
        email: session.customer_details?.email,
        metadata: session.metadata,
      });
      // TODO: Store subscription in your database
      // TODO: Send welcome email with first batch of leads
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

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", {
        id: subscription.id,
        status: subscription.status,
        metadata: subscription.metadata,
      });
      // TODO: Update subscription status in database
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription cancelled:", {
        id: subscription.id,
        customerId: subscription.customer,
      });
      // TODO: Mark subscription as cancelled in database
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
