import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById } from "@/lib/products";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

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
        metadata: { productId: product.id },
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
