import Link from "next/link";

const groups = [
  {
    title: "Lead lists",
    links: [
      ["Florida contractors", "/fl-contractors"],
      ["Florida food businesses", "/fl-restaurants"],
      ["Florida food trucks", "/fl-food-trucks"],
      ["Weekly subscription", "/subscribe"],
      ["My purchases", "/account"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Resource library", "/resources"],
      ["Data methodology", "/methodology"],
      ["About LeadHubData", "/about"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Refund policy", "/refund-policy"],
    ],
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-blue/8 bg-blue/[0.015] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="LeadHubData home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue text-sm font-black text-white">L</span>
            <span className="text-lg font-extrabold tracking-tight">
              LEADHUB<span className="text-blue">DATA</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-foreground/55">
            Documented Florida public-record datasets, cleaned and packaged as practical CSV files for business research and outreach.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-foreground/40">
            LeadHubData is an independent business and is not affiliated with or endorsed by the State of Florida or DBPR.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/70">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm font-medium text-foreground/50 transition-colors hover:text-blue">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-blue/8 pt-6 text-xs font-medium text-foreground/35">
        © 2026 LeadHubData. Public-record status does not remove a user&apos;s responsibility to follow outreach, privacy, and do-not-contact laws.
      </div>
    </footer>
  );
}
