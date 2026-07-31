import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPlanById, getOneTimeProductById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const { planId, productId } = await req.json();

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
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product=${product.id}`,
        cancel_url: `${baseUrl}/${product.id}`,
      });
      return NextResponse.json({ url: session.url });
    }

    const result = getPlanById(planId);
    if (!result) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { category, plan } = result;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${category.name} — ${plan.name}`,
              description: `${plan.leadsPerMonth.toLocaleString()} verified ${category.name.toLowerCase()} delivered monthly`,
              metadata: {
                categoryId: category.id,
                planId: plan.id,
              },
            },
            unit_amount: plan.price * 100,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          planId: plan.id,
          categoryId: category.id,
          leadsPerMonth: plan.leadsPerMonth.toString(),
        },
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/leads/${category.id}`,
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
