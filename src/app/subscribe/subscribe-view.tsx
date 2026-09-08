import Link from "next/link";
import { SUBSCRIPTION } from "@/lib/products";
import { getCatalog } from "@/lib/catalog";
import BuyButton from "@/components/buy-button";
import SiteFooter from "@/components/site-footer";

export default async function SubscribeView() {
  const products = await getCatalog();
  const total = products.filter(p => !p.includedIn).reduce((n, p) => n + p.leadCount, 0);
  return <div className="min-h-screen bg-white">
    <nav className="border-b border-blue/10 px-6"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between"><Link href="/" className="text-lg font-extrabold">LEADHUB<span className="text-blue">DATA</span></Link><Link href="/account" className="text-sm font-semibold text-blue">My account</Link></div></nav>
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">Florida All-Access</p>
      <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">Your prospect lists,<br /><span className="text-blue">kept up to date.</span></h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60">Download every current list and receive new food-business records each week when available. Start with the archive, then work the additions without sorting through the same file again.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border-2 border-blue p-8"><h2 className="text-4xl font-black text-blue">${SUBSCRIPTION.price}<span className="text-base font-medium text-foreground/55"> / month</span></h2><ul className="my-7 space-y-4 text-sm leading-relaxed">{SUBSCRIPTION.includes.map(s => <li key={s}>✓ {s}</li>)}</ul><BuyButton productId={SUBSCRIPTION.id} price={SUBSCRIPTION.price} subscription /><p className="mt-4 text-xs text-foreground/55">Cancel future renewals from your account at any time.</p></section>
        <section className="rounded-3xl bg-blue/[0.025] p-8"><h2 className="text-2xl font-extrabold">What you receive</h2><p className="mt-5 text-sm leading-relaxed text-foreground/65">Your first email contains the food-business archive. Contractor and food-truck CSVs are available in your account as soon as your subscription is active.</p><p className="mt-4 text-sm leading-relaxed text-foreground/65">Weekly deliveries contain records first added since your last delivery. Some filings are older records newly found in the source. Volume varies; no email is sent when there is nothing new.</p><p className="mt-4 text-sm leading-relaxed text-foreground/65">The main datasets currently contain {total.toLocaleString()} license and filing records. The food-truck subset is included in the food-business total.</p><p className="mt-4 text-sm leading-relaxed text-foreground/65">We retain historical food filings and show when each was last seen in the state source. A retained filing is not proof that a business is still operating.</p></section>
      </div>
      <p className="mt-10 text-sm text-foreground/60">Prefer to start small? <Link href="/fl-food-trucks" className="font-bold text-blue underline">Food-truck prospects are $99 once</Link>, and the <Link href="/fl-restaurants" className="font-bold text-blue underline">full food archive is $199 once</Link>.</p>
    </main><SiteFooter />
  </div>;
}
