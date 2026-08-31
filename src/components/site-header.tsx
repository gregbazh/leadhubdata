import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-blue/8 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="inline-flex items-center gap-2.5" aria-label="LeadHubData home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue text-sm font-black text-white shadow-[0_2px_10px_rgba(0,85,255,0.3)]">
            L
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            LEADHUB<span className="text-blue">DATA</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm font-semibold text-foreground/60" aria-label="Main navigation">
          <Link href="/resources" className="transition-colors hover:text-blue">Resources</Link>
          <Link href="/methodology" className="transition-colors hover:text-blue">Methodology</Link>
          <Link href="/about" className="transition-colors hover:text-blue">About</Link>
          <Link href="/account" className="transition-colors hover:text-blue">My Purchases</Link>
          <Link href="/subscribe" className="rounded-full bg-blue px-5 py-2.5 text-white transition-colors hover:bg-blue-dark">
            View Plans
          </Link>
        </nav>
      </div>
    </header>
  );
}
