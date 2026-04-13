import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBundleById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const { bundleId } = await req.json();

    const result = getBundleById(bundleId);
    if (!result) {
      return NextResponse.json({ error: "Invalid bundle" }, { status: 400 });
    }

    const { category, bundle } = result;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${category.name} — ${bundle.label}`,
              description: `${bundle.leads.toLocaleString()} verified ${category.name.toLowerCase()} delivered within 24 hours`,
            },
            unit_amount: bundle.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/leads/${category.id}`,
      metadata: {
        bundleId: bundle.id,
        categoryId: category.id,
        leadCount: bundle.leads.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
