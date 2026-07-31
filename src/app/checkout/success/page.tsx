import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { getOneTimeProductById, type OneTimeProduct } from "@/lib/products";
import { recordPurchase } from "@/lib/db";

export const metadata: Metadata = {
  title: "Order Confirmation — LeadHubData",
  robots: { index: false },
};

type SessionState =
  | { kind: "missing" }
  | { kind: "invalid" }
  | { kind: "unpaid" }
  | { kind: "paid"; sessionId: string; product: OneTimeProduct; email: string | null };

async function resolveSession(sessionId: string | undefined): Promise<SessionState> {
  if (!sessionId || !sessionId.startsWith("cs_")) return { kind: "missing" };

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return { kind: "unpaid" };

    const product = getOneTimeProductById(session.metadata?.productId ?? "");
    if (!product) return { kind: "invalid" };

    const email = session.customer_details?.email ?? null;

    // Record the purchase so it shows up in /account. The Stripe webhook does
    // this too; both writes are idempotent on session_id, and this one covers
    // the case where the webhook is delayed or misconfigured.
    if (email) {
      try {
        await recordPurchase({
          sessionId: session.id,
          email,
          productId: product.id,
          amountTotal: session.amount_total,
        });
      } catch (err) {
        console.error("success page: failed to record purchase:", err);
      }
    }

    return { kind: "paid", sessionId: session.id, product, email };
  } catch (err) {
    console.error("success page: session lookup failed:", err);
    return { kind: "invalid" };
  }
}

function CheckIcon() {
  return (
    <div className="w-20 h-20 bg-blue rounded-2xl text-white flex items-center justify-center mx-auto shadow-[0_8px_30px_rgba(0,85,255,0.3)]">
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ProblemContent({ title, body }: { title: React.ReactNode; body: string }) {
  return (
    <>
      <div className="w-20 h-20 bg-blue/8 border border-blue/15 rounded-2xl text-blue flex items-center justify-center mx-auto">
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
        {title}
      </h1>
      <p className="mt-6 text-lg text-foreground/55 font-medium leading-relaxed">{body}</p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/fl-contractors"
          className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300"
        >
          Back to the FL Contractors list
        </Link>
      </div>
    </>
  );
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const state = await resolveSession(session_id);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-lg w-full text-center">
        {state.kind === "paid" ? (
          <>
            <CheckIcon />
            <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              PAYMENT
              <br />
              <span className="text-blue">RECEIVED</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/55 font-medium leading-relaxed">
              Your list of{" "}
              <span className="text-foreground font-bold">
                {state.product.leadCount.toLocaleString()} leads
              </span>{" "}
              is ready. Download it now — we&apos;ve also emailed
              {state.email ? (
                <> <span className="text-foreground font-bold">{state.email}</span></>
              ) : (
                " you"
              )}{" "}
              this link so you can re-download anytime.
            </p>

            <a
              href={`/api/download?session_id=${encodeURIComponent(state.sessionId)}`}
              className="mt-10 inline-flex items-center justify-center gap-2 h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)] hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download CSV
            </a>

            <div className="mt-12 p-6 rounded-2xl border border-blue/10 bg-blue/[0.02] text-left">
              <h3 className="text-xs font-bold text-blue uppercase tracking-[0.25em]">
                Optional — save your purchase
              </h3>
              <p className="mt-3 text-sm font-medium text-foreground/60 leading-relaxed">
                Create a free account with{" "}
                <span className="font-bold text-foreground">
                  {state.email ?? "the email you used at checkout"}
                </span>{" "}
                to re-download this list anytime and get access to future lists. No
                password — we email you a sign-in code.
              </p>
              <Link
                href={state.email ? `/account?email=${encodeURIComponent(state.email)}` : "/account"}
                className="mt-4 inline-flex items-center justify-center h-11 px-7 text-sm font-bold text-blue border-2 border-blue/20 rounded-full hover:border-blue hover:bg-blue/5 transition-all duration-300"
              >
                Set up my account →
              </Link>
            </div>

            <p className="mt-8 text-sm text-foreground/45 font-medium">
              Trouble downloading? Reply to the receipt email and we&apos;ll sort it out.
            </p>
          </>
        ) : state.kind === "unpaid" ? (
          <ProblemContent
            title={
              <>
                PAYMENT NOT
                <br />
                <span className="text-blue">COMPLETED</span>
              </>
            }
            body="This checkout session hasn't been paid. If you cancelled, no charge was made — you can restart your purchase below. If you believe you were charged, reply to your Stripe receipt email and we'll make it right."
          />
        ) : (
          <ProblemContent
            title={
              <>
                LINK NOT
                <br />
                <span className="text-blue">RECOGNIZED</span>
              </>
            }
            body="We couldn't find a purchase for this link. If you just bought a list, use the download link in your email receipt — or head back and try again."
          />
        )}
      </div>
    </div>
  );
}
