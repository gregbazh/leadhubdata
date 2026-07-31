import Link from "next/link";
import { oneTimeProducts } from "@/lib/products";

// Focused single-product homepage. The original six-category subscription
// storefront is archived at src/legacy/home-storefront.tsx — restore it once
// those products are actually sold and fulfilled.

const product = oneTimeProducts[0];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ─── NAV ─── */}
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
          <div className="flex items-center gap-6">
            <Link
              href="/account"
              className="hidden sm:block text-sm font-bold text-foreground/60 hover:text-blue transition-colors"
            >
              My Purchases
            </Link>
            <Link
              href="/fl-contractors"
              className="text-sm font-bold text-white bg-blue px-6 py-2.5 rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
            >
              Get the List
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, #0055FF 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div
            className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.08) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[0%] right-[5%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-[-0.05em] leading-[0.85]">
            WE SELL THE
            <br />
            <span className="text-blue">BEST LEADS.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-foreground/55 max-w-lg mx-auto font-medium leading-relaxed">
            Fresh data from public records. One-time purchase, instant CSV download.
            No subscription.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fl-contractors"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,85,255,0.35)] hover:scale-105"
            >
              See the current list →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED LIST ─── */}
      <section className="relative py-16 md:py-24 px-6 bg-blue/[0.015] border-y border-blue/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs md:text-sm font-bold text-blue uppercase tracking-[0.25em] mb-4 text-center">
            Available Now
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] leading-[0.9] text-center">
            {product.leadCount.toLocaleString()} Florida contractors
            <br />
            <span className="text-blue">renewing by August 31</span>
          </h2>

          <div className="mt-12 max-w-3xl mx-auto p-8 md:p-10 rounded-3xl border-2 border-blue bg-white shadow-[0_8px_40px_rgba(0,85,255,0.12)]">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                  {product.name}
                </h3>
                <p className="mt-3 text-sm text-foreground/60 font-medium leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {product.fields.slice(0, 8).map((field) => (
                    <span
                      key={field}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue/5 text-blue/80 border border-blue/8"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:w-56 shrink-0 text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-5xl font-black text-blue">${product.price}</span>
                  <span className="text-sm font-semibold text-foreground/50">once</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground/50">
                  {((product.price / product.leadCount) * 100).toFixed(1)}¢ per lead ·
                  instant download
                </p>
                <Link
                  href="/fl-contractors"
                  className="mt-5 inline-flex w-full items-center justify-center h-12 px-6 text-sm font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
                >
                  View the list →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                title: "Buy once",
                desc: "Secure Stripe checkout. No account or subscription required.",
              },
              {
                step: "2",
                title: "Download instantly",
                desc: "Your CSV is ready the second payment clears — and we email you the link too.",
              },
              {
                step: "3",
                title: "Re-download anytime",
                desc: "Optionally create a free account with your checkout email to keep every list handy.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-7 rounded-2xl border border-blue/8 bg-white hover:border-blue/15 hover:shadow-[0_10px_40px_rgba(0,85,255,0.05)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-blue text-white text-base font-black flex items-center justify-center shadow-[0_2px_10px_rgba(0,85,255,0.3)]">
                  {item.step}
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-foreground tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/55 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] leading-[0.85]">
            READY TO
            <br />
            <span className="text-blue">START CLOSING?</span>
          </h2>
          <p className="mt-8 text-lg text-foreground/55 font-medium max-w-md mx-auto leading-relaxed">
            {product.leadCount.toLocaleString()} contractors with a hard deadline. Call
            them before your competition does.
          </p>
          <Link
            href="/fl-contractors"
            className="mt-10 inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,85,255,0.35)] hover:scale-105"
          >
            Get Instant Access — ${product.price}
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-auto py-10 md:py-12 px-6 border-t border-blue/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">L</span>
              </div>
              <span className="text-base font-extrabold tracking-tight">
                LEADHUB<span className="text-blue">DATA</span>
              </span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/fl-contractors" className="text-sm text-foreground/45 hover:text-blue transition-colors font-medium">
                FL Contractors
              </Link>
              <Link href="/account" className="text-sm text-foreground/45 hover:text-blue transition-colors font-medium">
                My Purchases
              </Link>
            </div>
            <p className="text-xs text-foreground/35 font-medium">© 2026 LeadHubData</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
