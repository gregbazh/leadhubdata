import Link from "next/link";

export default function ContentShell({
  eyebrow,
  title,
  intro,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-blue/8 bg-blue/[0.02] px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-foreground md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-foreground/62">{intro}</p>
          {updatedAt && <p className="mt-5 text-xs font-semibold text-foreground/40">Last updated {updatedAt}</p>}
        </div>
      </header>
      <div className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-base font-medium leading-8 text-foreground/68 [&_a]:font-semibold [&_a]:text-blue [&_a]:underline [&_a]:decoration-blue/25 [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-[-0.025em] [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-black [&_h3]:text-foreground [&_li]:mt-2 [&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
          <div className="mt-14 rounded-2xl border border-blue/10 bg-blue/[0.025] p-6 text-sm leading-relaxed text-foreground/60">
            Questions or corrections? <Link href="/contact">Contact LeadHubData</Link>.
          </div>
        </div>
      </div>
    </>
  );
}
