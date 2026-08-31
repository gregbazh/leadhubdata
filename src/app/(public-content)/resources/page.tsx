import type { Metadata } from "next";
import Link from "next/link";
import { resources } from "@/lib/resources";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Florida Business-Data Resource Library",
  description:
    "Plain-language guides to Florida contractor licenses, restaurant plan-review records, public-record lead lists, data quality, and responsible outreach.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-blue/8 bg-blue/[0.02] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue">Resource library</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.045em] text-foreground md:text-6xl">
            Understand the data before you use it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-foreground/60">
            Source-led guides for evaluating Florida public records, interpreting business signals, and building outreach around facts instead of assumptions.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {resources.map((resource) => (
            <article key={resource.slug} className="flex flex-col rounded-3xl border border-blue/10 bg-white p-7 shadow-[0_12px_40px_rgba(0,50,140,0.04)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue">{resource.eyebrow}</p>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-foreground">
                <Link href={`/resources/${resource.slug}`} className="transition-colors hover:text-blue">
                  {resource.title}
                </Link>
              </h2>
              <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-foreground/58">{resource.excerpt}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-blue/8 pt-5">
                <span className="text-xs font-semibold text-foreground/40">{resource.readingMinutes} minute read</span>
                <Link href={`/resources/${resource.slug}`} className="text-sm font-bold text-blue hover:text-blue-dark">
                  Read guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
