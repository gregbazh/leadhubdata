import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionValue, SESSION_COOKIE } from "@/lib/auth";
import { getPurchasesByEmail, type PurchaseRow } from "@/lib/db";
import { getOneTimeProductById } from "@/lib/products";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Your Account — LeadHubData",
  description: "Re-download your purchased lead lists.",
  robots: { index: false },
};

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-blue/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center shadow-[0_2px_10px_rgba(0,85,255,0.3)]">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            LEADHUB<span className="text-blue">DATA</span>
          </span>
        </Link>
        <Link
          href="/fl-contractors"
          className="text-sm font-bold text-foreground/60 hover:text-blue transition-colors"
        >
          Get the FL Contractors list →
        </Link>
      </div>
    </nav>
  );
}

function PurchaseCard({ purchase }: { purchase: PurchaseRow }) {
  const product = getOneTimeProductById(purchase.product_id);
  const date = new Date(purchase.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="p-6 md:p-7 rounded-2xl border border-blue/10 bg-white flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
      <div>
        <div className="text-base font-extrabold text-foreground tracking-tight">
          {product?.name ?? purchase.product_id}
        </div>
        <div className="mt-1 text-sm font-medium text-foreground/50">
          Purchased {date}
          {purchase.amount_total != null && (
            <> · ${(purchase.amount_total / 100).toFixed(0)}</>
          )}
          {product && <> · {product.leadCount.toLocaleString()} leads</>}
        </div>
      </div>
      <a
        href={`/api/download?session_id=${encodeURIComponent(purchase.session_id)}`}
        className="inline-flex items-center justify-center gap-2 h-11 px-6 shrink-0 text-sm font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Download CSV
      </a>
    </div>
  );
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const cookieStore = await cookies();
  const email = verifySessionValue(cookieStore.get(SESSION_COOKIE)?.value);

  if (!email) {
    const { email: prefill } = await searchParams;
    return (
      <div className="min-h-screen bg-white">
        <Nav />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-md mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
              YOUR <span className="text-blue">ACCOUNT</span>
            </h1>
            <p className="mt-4 text-base text-foreground/55 font-medium">
              Access every list you&apos;ve purchased and re-download anytime.
            </p>
          </div>
          <SignInForm initialEmail={typeof prefill === "string" ? prefill : undefined} />
        </main>
      </div>
    );
  }

  let purchases: PurchaseRow[] = [];
  let loadError = false;
  try {
    purchases = await getPurchasesByEmail(email);
  } catch (err) {
    console.error("account: failed to load purchases:", err);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-foreground leading-[0.9]">
                YOUR <span className="text-blue">PURCHASES</span>
              </h1>
              <p className="mt-3 text-sm font-medium text-foreground/50">
                Signed in as <span className="font-bold text-foreground">{email}</span>
              </p>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm font-bold text-foreground/50 hover:text-blue transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>

          <div className="mt-10 space-y-4">
            {loadError ? (
              <div className="p-8 rounded-2xl border border-blue/10 bg-blue/[0.02] text-center">
                <p className="text-base font-semibold text-foreground/60">
                  We couldn&apos;t load your purchases right now. Refresh the page or try
                  again in a minute.
                </p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="p-8 rounded-2xl border border-blue/10 bg-blue/[0.02] text-center">
                <p className="text-base font-semibold text-foreground/60">
                  No purchases found for {email} yet.
                </p>
                <p className="mt-2 text-sm font-medium text-foreground/45">
                  Bought a list with a different email? Sign out and sign back in with
                  the email you used at checkout.
                </p>
                <Link
                  href="/fl-contractors"
                  className="mt-6 inline-flex items-center justify-center h-11 px-7 text-sm font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300"
                >
                  Browse the FL Contractors list →
                </Link>
              </div>
            ) : (
              purchases.map((p) => <PurchaseCard key={p.session_id} purchase={p} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
