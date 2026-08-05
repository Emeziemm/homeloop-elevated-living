function ArrowRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function SiteFooter() {
  const cols = [
    { title: "Discover", items: ["Properties", "Neighborhoods", "New developments", "Off-market"] },
    { title: "Company", items: ["About", "Agents", "Journal", "Press"] },
    { title: "Contact", items: ["Book viewing", "General enquiry", "+1 (310) 555 0187", "hello@homeloop.co"] },
  ];
  return (
    <footer className="bg-canvas pt-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="font-display text-2xl tracking-tight">Homeloop<span className="text-gold">.</span></div>
            <p className="mt-6 max-w-sm text-ink/60">
              Get one exceptional home in your inbox each Sunday. No noise. Cancel any time.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex max-w-sm items-center gap-2 border-b border-ink/20 pb-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent text-sm text-ink placeholder-ink/40 outline-none"
              />
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-primary-foreground transition-transform hover:translate-x-1">
                <ArrowRight />
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-eyebrow">{c.title}</div>
                <ul className="mt-6 space-y-3">
                  {c.items.map((i) => (
                    <li key={i}><a className="text-sm text-ink/70 transition-colors hover:text-ink" href="#">{i}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-ink/10 py-10 text-xs text-ink/50 md:flex-row md:items-center">
          <div>© 2026 Homeloop Studio. A conversion system for modern real estate.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ink">Instagram</a>
            <a href="#" className="hover:text-ink">Dribbble</a>
            <a href="#" className="hover:text-ink">LinkedIn</a>
            <a href="#" className="hover:text-ink">Privacy</a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="pointer-events-none select-none whitespace-nowrap px-2 pb-6 text-center font-display font-medium leading-none tracking-tighter text-ink/[0.08]" style={{ fontSize: "clamp(4rem, 20vw, 20rem)" }}>
          Homeloop.
        </div>
      </div>
    </footer>
  );
}