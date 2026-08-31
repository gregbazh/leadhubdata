import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById, SUBSCRIPTION } from "@/lib/products";

export const runtime = "nodejs";

// Campaign attribution travels on the Stripe session so the webhook can credit
// a sale to the email that caused it. Campaign-level only: these values name a
// campaign and a copy variant, never a recipient.
type Attribution = {
  campaign?: unknown;
  variant?: unknown;
  source?: unknown;
  medium?: unknown;
};

function attributionMetadata(a: Attribution | undefined): Record<string, string> {
  if (!a || typeof a !== "object") return {};
  const out: Record<string, string> = {};
  // Re-validated here rather than trusted from the client: this lands in Stripe
  // metadata and in the ops tables, and the request body is user-controlled.
  const put = (key: string, value: unknown) => {
    if (typeof value !== "string") return;
    const v = value.trim().slice(0, 64);
    if (v && /^[\w.\-]+$/.test(v)) out[key] = v;
  };
  put("campaign", a.campaign);
  put("variant", a.variant);
  put("utm_source", a.source);
  put("utm_medium", a.medium);
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const { productId, attribution } = await req.json();
    const attrib = attributionMetadata(attribution);

    if (productId === SUBSCRIPTION.id) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: SUBSCRIPTION.name,
                description: "Every Florida list, plus new food businesses emailed weekly",
              },
              recurring: { interval: SUBSCRIPTION.interval },
              unit_amount: SUBSCRIPTION.price * 100,
            },
            quantity: 1,
          },
        ],
        metadata: { productId: SUBSCRIPTION.id, ...attrib },
        // Copied onto the subscription itself so the webhook can tell which
        // product a subscription event belongs to.
        subscription_data: { metadata: { productId: SUBSCRIPTION.id, ...attrib } },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/subscribe`,
      });
      return NextResponse.json({ url: session.url });
    }

    if (productId) {
      const product = getOneTimeProductById(productId);
      if (!product) {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 });
      }
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const session = await getStripe().checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: `${product.leadCount.toLocaleString()} leads — instant CSV download`,
                metadata: { productId: product.id },
              },
              unit_amount: product.price * 100,
            },
            quantity: 1,
          },
        ],
        metadata: { productId: product.id, ...attrib },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/${product.id}`,
      });
      return NextResponse.json({ url: session.url });
    }

    // Subscription plans are not currently sold. The plan catalog still lives
    // in src/lib/products.ts; restore the mode:"subscription" branch from git
    // history when subscriptions launch.
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
