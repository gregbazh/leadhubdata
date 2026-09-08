import Link from "next/link";
import { getCatalogProduct } from "@/lib/catalog";
import { contractorFaqs, restaurantFaqs, productJsonLd } from "@/lib/seo";
import BuyButton from "@/components/buy-button";
import SampleForm from "@/app/sample-form";
import SiteFooter from "@/components/site-footer";
import JsonLd from "@/components/json-ld";

export default async function ProductPage({ id }: { id: string }) {
  const product = await getCatalogProduct(id);
  const contractor = id === "fl-contractors";
  const mobile = id === "fl-food-trucks";
  const faqs = contractor ? contractorFaqs(product) : restaurantFaqs(product);
  const date = product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "Not yet refreshed";
  const stats = [
    { value: product.leadCount, label: contractor ? "active license records" : "business filing records" },
    { value: product.phoneCount, label: "records with a phone" },
    { value: product.uniqueEmailCount, label: "distinct email addresses" },
  ];
  return <div className="min-h-screen bg-white">
    <JsonLd data={productJsonLd({ product, path: `/${id}`, title: product.name, description: product.description, faqs,
      sourceUrls: [contractor ? "https://www2.myfloridalicense.com/construction-industry/public-records/" : "https://www2.myfloridalicense.com/hotels-restaurants/public-records/"],
      keywords: contractor ? ["Florida contractor contacts", "active contractor licenses"] : mobile ? ["Florida food truck leads", "commercial auto prospects"] : ["Florida food business filings", "restaurant leads"] })} />
    <nav className="border-b border-blue/10 px-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight">LEADHUB<span className="text-blue">DATA</span></Link>
        <Link href="/account" className="text-sm font-semibold text-blue">My purchases</Link>
      </div>
    </nav>
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue">Florida public-record prospects</p>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">{product.headline}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/65">{product.description}</p>
          <p className="mt-5 text-sm font-medium text-foreground/55">Source checked {date} · {product.leadCount.toLocaleString()} records</p>
          {contractor && <p className="mt-3 text-sm leading-relaxed text-foreground/60">{product.reachableCount?.toLocaleString()} records have a researched phone or email. The remaining licenses include business, address and license details.</p>}
          {mobile && <p className="mt-4 text-sm leading-relaxed text-foreground/60">For agents who write food trucks and commercial auto. These businesses have filed with the state; they have not requested insurance quotes.</p>}
          <div className="mt-8 flex flex-wrap items-center gap-5"><BuyButton productId={id} price={product.price} /><a href="#sample" className="text-sm font-bold text-blue underline underline-offset-4">Try a free sample</a></div>
          <p className="mt-3 text-xs text-foreground/50">One-time purchase · Instant download after payment · CSV format</p>
        </div>
        <aside className="self-start rounded-3xl border border-blue/15 bg-blue/[0.025] p-7">
          <h2 className="text-xl font-extrabold">Know what you&apos;re buying</h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/65">
            <li>{contractor ? "Current, active Florida certified licenses with an unexpired state license date at refresh." : "Dated plan-review filings, including retained historical records. Filing does not mean a business is open."}</li>
            <li>{contractor ? "Contacts are researched separately and matched to the license. Contact details are not supplied by DBPR or freshly mailbox-verified." : "Every row has a filing email. Contacts can be an operator or a representative, and inboxes can repeat."}</li>
            <li>{contractor ? "A license-expiration date is not an insurance-renewal date." : "The source-check column shows when a filing was last matched to the current state file. Archived statuses may be older."}</li>
            {mobile && <li>Mobile-food categories can include different vehicle setups. Confirm the business and vehicle before quoting.</li>}
          </ul>
          {mobile && <p className="mt-6 rounded-xl bg-white p-4 text-sm leading-relaxed">Already buying the <Link href="/fl-restaurants" className="font-bold text-blue underline">$199 food-business list</Link>? These mobile-food records are included. All-Access includes them too.</p>}
        </aside>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-14 sm:grid-cols-3">
        {stats.map(s => <div key={s.label} className="rounded-2xl border border-blue/10 p-6"><p className="text-3xl font-black text-blue">{s.value?.toLocaleString()}</p><p className="mt-2 text-sm text-foreground/60">{s.label}</p></div>)}
      </section>
      <section className="border-y border-blue/10 bg-blue/[0.015] px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div><h2 className="text-2xl font-extrabold">What&apos;s in your CSV</h2><div className="mt-5 flex flex-wrap gap-2">{product.fields.map(f => <span key={f} className="rounded-full border border-blue/10 bg-white px-3 py-1.5 text-xs font-semibold text-blue">{f}</span>)}</div><p className="mt-5 text-sm leading-relaxed text-foreground/60">Filter the full CSV in Excel, Google Sheets or your CRM. {contractor ? "Records with phone or email appear first." : "The newest application dates appear first."}</p></div>
          <div><h2 className="text-2xl font-extrabold">{product.mix ? "Business types included" : "Start with your territory"}</h2>
            {product.mix ? <dl className="mt-5 space-y-2">{product.mix.map(m => <div className="flex justify-between gap-4 text-sm" key={m.label}><dt>{m.label}</dt><dd className="font-bold tabular-nums">{m.count.toLocaleString()}</dd></div>)}</dl> : <p className="mt-5 text-sm leading-relaxed text-foreground/60">{contractor ? "Choose a trade for your free sample, then use the city, ZIP and county fields to focus your full list." : "Choose a county for your free sample. The full list includes all available counties, so you can work the areas your agency serves."}</p>}
          </div>
        </div>
      </section>
      <section id="sample" className="mx-auto grid max-w-6xl scroll-mt-6 gap-12 px-6 py-16 md:grid-cols-2">
        <SampleForm product={product} />
        <div><h2 className="text-2xl font-extrabold">Before you buy</h2><div className="mt-5 divide-y divide-blue/10">{faqs.map(f => <details key={f.q} className="py-4"><summary className="cursor-pointer text-sm font-bold">{f.q}</summary><p className="mt-3 text-sm leading-relaxed text-foreground/60">{f.a}</p></details>)}</div><Link href="/methodology" className="mt-5 inline-block text-sm font-semibold text-blue underline">How we build and update the data</Link></div>
      </section>
    </main><SiteFooter />
  </div>;
}
