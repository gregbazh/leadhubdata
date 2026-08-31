import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import { getResource, resources } from "@/lib/resources";
import { articleJsonLd, createMetadata } from "@/lib/seo";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) return {};

  return createMetadata({
    title: resource.seoTitle,
    description: resource.description,
    path: `/resources/${resource.slug}`,
    type: "article",
  });
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) notFound();

  const related = resources.filter((item) => item.slug !== resource.slug).slice(0, 3);
  const sourceUrls = resource.sources.map((source) => source.url);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: resource.title,
          description: resource.description,
          path: `/resources/${resource.slug}`,
          publishedAt: resource.publishedAt,
          updatedAt: resource.updatedAt,
          sources: sourceUrls,
        })}
      />

      <article>
        <header className="border-b border-blue/8 bg-blue/[0.02] px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <nav className="text-sm font-semibold text-foreground/45" aria-label="Breadcrumb">
              <Link href="/resources" className="hover:text-blue">Resources</Link>
              <span aria-hidden="true"> / </span>
              <span>{resource.eyebrow}</span>
            </nav>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-blue">{resource.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-foreground md:text-6xl">
              {resource.title}
            </h1>
            <p className="mt-6 text-lg font-medium leading-relaxed text-foreground/62">{resource.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-foreground/42">
              <span>By LeadHubData</span>
              <span>Reviewed against primary sources</span>
              <span>{resource.readingMinutes} minute read</span>
              <span>Updated <time dateTime={resource.updatedAt}>August 30, 2026</time></span>
            </div>
          </div>
        </header>

        <div className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-14">
              {resource.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black tracking-[-0.025em] text-foreground md:text-3xl">{section.heading}</h2>
                  <div className="mt-5 space-y-5 text-base font-medium leading-8 text-foreground/68">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 space-y-3 rounded-2xl border border-blue/10 bg-blue/[0.025] p-6 text-sm font-semibold leading-relaxed text-foreground/65">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <section className="mt-16 border-t border-blue/10 pt-10" aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="text-xl font-black text-foreground">Primary sources</h2>
              <ul className="mt-5 space-y-3">
                {resource.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue underline decoration-blue/25 underline-offset-4 hover:text-blue-dark">
                      {source.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-medium leading-relaxed text-foreground/50">
                LeadHubData is independent of the agencies linked above. Source pages can change; verify time-sensitive requirements directly with the responsible agency.
              </p>
            </section>

            {resource.relatedProduct && (
              <aside className="mt-12 rounded-3xl bg-blue px-7 py-8 text-white md:px-9">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Related dataset</p>
                <h2 className="mt-3 text-2xl font-black">See the fields, counts, source, and limitations before buying.</h2>
                <Link href={resource.relatedProduct} className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-blue hover:bg-blue-50">
                  {resource.relatedProductLabel} →
                </Link>
              </aside>
            )}
          </div>
        </div>
      </article>

      <section className="border-t border-blue/8 bg-blue/[0.02] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-black tracking-[-0.025em] text-foreground">Keep reading</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/resources/${item.slug}`} className="rounded-2xl border border-blue/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue/25">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">{item.eyebrow}</p>
                <h3 className="mt-3 text-base font-black leading-snug text-foreground">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
