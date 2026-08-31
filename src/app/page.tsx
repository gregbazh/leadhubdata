import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/json-ld";
import SiteFooter from "@/components/site-footer";
import { oneTimeProducts, SUBSCRIPTION } from "@/lib/products";
import { absoluteUrl, createMetadata, SITE_URL } from "@/lib/seo";

// Focused single-product homepage. The original six-category subscription
// storefront is archived at src/legacy/home-storefront.tsx — restore it once
// those products are actually sold and fulfilled.

const totalRecords = oneTimeProducts.reduce((n, p) => n + p.leadCount, 0);

export const metadata: Metadata = createMetadata({
  title: "Florida Public-Record Business Lead Lists",
  description:
    "Download Florida contractor and food-business lead lists built from official public records. Review exact fields and limitations before buying an instant CSV.",
  path: "/",
});

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/#collection`,
  url: SITE_URL,
  name: "Florida public-record business lead lists",
  description:
    "Documented Florida contractor and food-business datasets available as downloadable CSV files.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: oneTimeProducts.length,
    itemListElement: oneTimeProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/${product.id}`),
    })),
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <JsonLd data={homeJsonLd} />
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
              href="/subscribe"
              className="text-sm font-bold text-white bg-blue px-6 py-2.5 rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
            >
              Subscribe
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
            Florida businesses pulled straight from state records. Subscribe for a fresh
            batch every week, or buy any single list outright.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,85,255,0.35)] hover:scale-105"
            >
              Get the weekly feed — ${SUBSCRIPTION.price}/mo
            </Link>
            <Link
              href="/fl-contractors"
              className="inline-flex items-center justify-center h-14 px-10 text-base font-bold text-blue border-2 border-blue/20 rounded-full hover:border-blue hover:bg-blue/5 transition-all duration-300"
            >
              Or buy one list →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AVAILABLE LISTS ─── */}
      <section className="relative py-16 md:py-24 px-6 bg-blue/[0.015] border-y border-blue/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs md:text-sm font-bold text-blue uppercase tracking-[0.25em] mb-4 text-center">
            Available Now
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-[-0.04em] leading-[0.9] text-center">
            Two Florida lists,
            <br />
            <span className="text-blue">built this month</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {oneTimeProducts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col p-8 rounded-3xl border-2 border-blue bg-white shadow-[0_8px_40px_rgba(0,85,255,0.12)]"
              >
                <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                  {p.name}
                </h3>
                <p className="mt-3 flex-1 text-sm text-foreground/60 font-medium leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.fields.slice(0, 6).map((field) => (
                    <span
                      key={field}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue/5 text-blue/80 border border-blue/8"
                    >
                      {field}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-blue">${p.price}</span>
                  <span className="text-sm font-semibold text-foreground/50">once</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-foreground/50">
                  {((p.price / p.leadCount) * 100).toFixed(1)}¢ per record · instant download
                </p>
                <Link
                  href={`/${p.id}`}
                  className="mt-5 inline-flex w-full items-center justify-center h-12 px-6 text-sm font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,85,255,0.3)]"
                >
                  View the list →
                </Link>
              </div>
            ))}
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
            {totalRecords.toLocaleString()} Florida businesses across both lists, pulled
            from state records this month. Reach them before your competition does.
          </p>
          <Link
            href={`/${oneTimeProducts[0].id}`}
            className="mt-10 inline-flex items-center justify-center h-14 px-10 text-base font-bold text-white bg-blue rounded-full hover:bg-blue-dark transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,85,255,0.35)] hover:scale-105"
          >
            Browse the lists
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
