import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { filterChips, formatPrice, properties, type Property } from "@/lib/properties";
import heroVilla from "@/assets/hero-villa.jpg";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Property Listings — Homeloop" },
      { name: "description", content: "Discover carefully curated homes designed for modern living. Villas, apartments and luxury residences across Europe." },
      { property: "og:title", content: "Discover Your Next Home — Homeloop" },
      { property: "og:description", content: "Browse a curated collection of luxury homes across Europe's most desirable neighborhoods." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PropertiesPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

function PropertiesPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<Property | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggle = (c: string) =>
    setFilters((f) => (f.includes(c) ? f.filter((x) => x !== c) : [...f, c]));

  const filtered = useMemo(() => {
    let list = [...properties];
    const sale = filters.includes("For Sale");
    const rent = filters.includes("For Rent");
    const open = filters.includes("Open House");
    if (sale || rent || open) {
      list = list.filter((p) => (sale && p.status === "For Sale") || (rent && p.status === "For Rent") || (open && p.status === "Open House"));
    }
    const cats = ["Luxury", "Apartment", "Villa", "Townhouse", "Commercial"].filter((c) => filters.includes(c));
    if (cats.length) list = list.filter((p) => cats.includes(p.category));
    if (filters.includes("Price Low → High")) list.sort((a, b) => a.price - b.price);
    if (filters.includes("Newest")) list.sort((a, b) => b.yearBuilt - a.yearBuilt);
    return list;
  }, [filters]);

  const perPage = 6;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SiteNav overDark />
      <ListingsHero />
      <StickyFilters filters={filters} toggle={toggle} onOpenDrawer={() => setDrawerOpen(true)} />

      <section ref={gridRef} className="mx-auto max-w-[1400px] px-6 pb-24 pt-14 lg:px-10">
        {filtered.length === 0 ? (
          <EmptyState onReset={() => setFilters([])} />
        ) : (
          <MosaicGrid items={visible} onQuickView={setQuickView} />
        )}

        {filtered.length > 0 && (
          <Pagination page={page} pages={pages} onPage={(p) => { setPage(p); gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} />
        )}
      </section>

      <Footer />

      <AnimatePresence>{quickView && <QuickView p={quickView} onClose={() => setQuickView(null)} />}</AnimatePresence>
      <AnimatePresence>{drawerOpen && <FilterDrawer filters={filters} toggle={toggle} onClose={() => setDrawerOpen(false)} />}</AnimatePresence>
    </div>
  );
}

/* -------------------- Hero -------------------- */

function ListingsHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative min-h-[92svh] w-full overflow-hidden bg-ink text-primary-foreground">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={heroVilla} alt="Luxury architecture" className="h-full w-full object-cover animate-hl-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/40" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-[1400px] flex-col justify-end px-6 pb-16 pt-40 lg:px-10 lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="text-eyebrow text-primary-foreground/60">
          <span className="inline-block h-px w-6 bg-current opacity-60 mr-2 align-middle" />
          Collection · 2026 Portfolio
        </motion.div>

        <h1 className="mt-8 max-w-5xl text-[clamp(2.6rem,7vw,6.4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
          {"Discover Your Next Home".split(" ").map((w, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.07 }} className="inline-block pr-4">
              {i === 3 ? <span className="font-serif-display italic text-gold">{w}</span> : w}
            </motion.span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }} className="mt-6 max-w-xl text-lg text-primary-foreground/70">
          Browse carefully curated homes designed for modern living — from coastal villas to editorial city apartments.
        </motion.p>

        <SearchPanel />
      </div>
    </section>
  );
}

function SearchPanel() {
  const fields = [
    { label: "Location", value: "Any city" },
    { label: "Property Type", value: "Any type" },
    { label: "Bedrooms", value: "2+" },
    { label: "Bathrooms", value: "2+" },
    { label: "Budget", value: "€1M — €5M" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 0.7 }}
      className="mt-12 w-full rounded-3xl border border-primary-foreground/10 bg-canvas/95 p-3 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
    >
      <div className="grid grid-cols-2 gap-1 md:grid-cols-6">
        {fields.map((f) => (
          <button key={f.label} className="group rounded-2xl px-5 py-4 text-left transition-all duration-300 hover:bg-ink/[0.04]">
            <div className="text-[10px] uppercase tracking-[0.24em] text-ink/50">{f.label}</div>
            <div className="mt-1 truncate text-sm font-medium text-ink">{f.value}</div>
          </button>
        ))}
        <button className="group col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-medium text-primary-foreground transition-all duration-500 hover:bg-gold hover:text-ink md:col-span-1">
          Search
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------- Sticky filter bar -------------------- */

function StickyFilters({ filters, toggle, onOpenDrawer }: { filters: string[]; toggle: (c: string) => void; onOpenDrawer: () => void }) {
  return (
    <div className="sticky top-14 z-40 border-b border-ink/10 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 py-4 lg:px-10">
        {/* Desktop */}
        <div className="hidden items-center gap-2 overflow-x-auto md:flex">
          {filterChips.map((chip) => {
            const active = filters.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => toggle(chip)}
                className={`group relative shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                  active
                    ? "border-ink bg-ink text-primary-foreground scale-[1.03]"
                    : "border-ink/15 bg-transparent text-ink/70 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {active && <motion.span layoutId={`chipdot-${chip}`} className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold" />}
                {chip}
              </button>
            );
          })}
        </div>
        {/* Mobile */}
        <button onClick={onOpenDrawer} className="flex w-full items-center justify-between rounded-full border border-ink/15 px-5 py-3 text-sm font-medium text-ink md:hidden">
          <span>Filters {filters.length > 0 && <span className="ml-1 rounded-full bg-ink px-2 py-0.5 text-[11px] text-primary-foreground">{filters.length}</span>}</span>
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h12M4 8h8M6 12h4" /></svg>
        </button>
      </div>
    </div>
  );
}

function FilterDrawer({ filters, toggle, onClose }: { filters: string[]; toggle: (c: string) => void; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[60] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div onClick={onClose} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease }}
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-canvas p-6 pb-10"
      >
        <div className="mx-auto mb-6 h-1.5 w-10 rounded-full bg-ink/15" />
        <div className="text-eyebrow mb-4">Refine</div>
        <div className="flex flex-wrap gap-2">
          {filterChips.map((chip) => {
            const active = filters.includes(chip);
            return (
              <button key={chip} onClick={() => toggle(chip)} className={`rounded-full border px-4 py-2 text-sm transition-all ${active ? "border-ink bg-ink text-primary-foreground" : "border-ink/15 text-ink/70"}`}>
                {chip}
              </button>
            );
          })}
        </div>
        <button onClick={onClose} className="mt-8 w-full rounded-full bg-ink py-4 text-sm font-medium text-primary-foreground">Show results</button>
      </motion.div>
    </motion.div>
  );
}

/* -------------------- Grid -------------------- */

const spanClass: Record<NonNullable<Property["span"]>, string> = {
  sm: "md:col-span-4",
  md: "md:col-span-4",
  lg: "md:col-span-8 md:row-span-2",
  wide: "md:col-span-8",
  tall: "md:col-span-4 md:row-span-2",
};

function MosaicGrid({ items, onQuickView }: { items: Property[]; onQuickView: (p: Property) => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:auto-rows-[280px]">
      {items.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: (i % 3) * 0.08 }}
          className={`${spanClass[p.span ?? "sm"]} md:row-span-1`}
        >
          <PropertyCard p={p} onQuickView={onQuickView} tall={p.span === "lg" || p.span === "tall"} />
        </motion.div>
      ))}
    </div>
  );
}

function PropertyCard({ p, onQuickView, tall = false }: { p: Property; onQuickView: (p: Property) => void; tall?: boolean }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const onEnter = () => {
    timer.current = setInterval(() => setImgIdx((i) => (i + 1) % p.images.length), 1400);
  };
  const onLeave = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setImgIdx(0);
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-3xl bg-ink text-primary-foreground transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]"
    >
      <div className="absolute inset-0">
        {p.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={p.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out group-hover:scale-110 ${i === imgIdx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
      </div>

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between p-6">
        <span className="rounded-full bg-canvas/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink backdrop-blur">
          {p.status}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/25 bg-ink/40 backdrop-blur transition-all hover:scale-110 hover:border-gold"
          aria-label="Save property"
        >
          <svg className={`h-4 w-4 transition-all ${saved ? "fill-gold stroke-gold" : "fill-none stroke-primary-foreground"}`} viewBox="0 0 24 24" strokeWidth="1.6">
            <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" />
          </svg>
        </button>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[12px] text-primary-foreground/70">
              <svg className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
              <span className="truncate">{p.location}</span>
            </div>
            <h3 className={`mt-1 font-display font-medium tracking-tight ${tall ? "text-3xl" : "text-xl"}`}>{p.title}</h3>
          </div>
          <div className={`shrink-0 font-display font-medium tracking-tight transition-transform duration-500 group-hover:scale-[1.06] ${tall ? "text-3xl" : "text-xl"}`}>
            {formatPrice(p.price)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-primary-foreground/70">
          <span>{p.beds} beds</span>
          <span className="opacity-40">·</span>
          <span>{p.baths} baths</span>
          <span className="opacity-40">·</span>
          <span>{p.area} sqm</span>
        </div>

        {/* Reveal row */}
        <div className="mt-2 grid grid-cols-[auto_1fr_auto] items-center gap-3 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          <img src={p.agent.avatar} alt={p.agent.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-foreground/20" />
          <span className="truncate text-[12px] text-primary-foreground/80">{p.agent.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(p); }}
              className="rounded-full border border-primary-foreground/30 px-3 py-1.5 text-[11px] font-medium text-primary-foreground/90 transition-all hover:border-gold hover:text-gold"
            >
              Quick view
            </button>
            <Link
              to="/properties/$id"
              params={{ id: p.id }}
              className="rounded-full bg-gold px-3 py-1.5 text-[11px] font-medium text-ink transition-all hover:scale-105"
            >
              Schedule viewing
            </Link>
          </div>
        </div>
      </div>

      <Link to="/properties/$id" params={{ id: p.id }} className="absolute inset-0 z-[5]" aria-label={p.title} />
    </div>
  );
}

/* -------------------- Pagination / Empty -------------------- */

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  const items = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="mt-20 flex items-center justify-center gap-2">
      <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className="group flex items-center gap-2 text-sm text-ink/70 disabled:opacity-30">
        <span className="relative">
          Previous
          <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
        </span>
      </button>
      <div className="mx-6 flex items-center gap-1">
        {items.map((n) => (
          <button key={n} onClick={() => onPage(n)} className={`grid h-9 w-9 place-items-center rounded-full text-sm transition-all ${n === page ? "bg-ink text-primary-foreground" : "text-ink/60 hover:bg-ink/5 hover:text-ink"}`}>
            {n}
          </button>
        ))}
      </div>
      <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages} className="group flex items-center gap-2 text-sm text-ink/70 disabled:opacity-30">
        <span className="relative">
          Next
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
        </span>
      </button>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="relative mb-10 h-40 w-40">
        <div className="absolute inset-0 rounded-full border border-ink/10" />
        <div className="absolute inset-4 rounded-full border border-ink/10" />
        <div className="absolute inset-8 rounded-full border border-ink/10" />
        <svg className="absolute inset-0 m-auto h-16 w-16 text-gold" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M8 32L32 12l24 20v20H8V32z" />
          <path d="M26 52V38h12v14" />
        </svg>
      </div>
      <h3 className="max-w-lg text-3xl font-medium tracking-tight md:text-4xl">No homes match your filters.</h3>
      <p className="mt-3 max-w-md text-sm text-ink/60">Loosen a few filters or reset the collection to see the full portfolio.</p>
      <button onClick={onReset} className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-gold hover:text-ink">
        Reset filters
      </button>
    </div>
  );
}

/* -------------------- Quick View Modal -------------------- */

function QuickView({ p, onClose }: { p: Property; onClose: () => void }) {
  const [i, setI] = useState(0);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10">
      <div onClick={onClose} className="absolute inset-0 bg-ink/70 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10 grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[28px] bg-canvas shadow-2xl md:grid-cols-2"
      >
        <div className="relative aspect-[4/3] md:aspect-auto">
          <AnimatePresence mode="wait">
            <motion.img
              key={i}
              src={p.images[i]}
              initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-0 h-full w-full object-cover"
              alt={p.title}
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
            <div className="flex gap-1.5">
              {p.images.map((_, idx) => (
                <button key={idx} onClick={() => setI(idx)} className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-primary-foreground" : "w-4 bg-primary-foreground/40"}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col p-8 md:p-10">
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-canvas/80 backdrop-blur hover:bg-ink hover:text-primary-foreground" aria-label="Close">
            <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
          <div className="text-eyebrow">{p.status}</div>
          <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">{p.title}</h3>
          <div className="mt-1 text-sm text-ink/60">{p.location}</div>
          <div className="mt-4 font-display text-2xl font-medium">{formatPrice(p.price)}</div>
          <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-ink/70">{p.description}</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            {[["Beds", p.beds], ["Baths", p.baths], ["Area", `${p.area} sqm`]].map(([k, v]) => (
              <div key={k as string} className="rounded-2xl border border-ink/10 p-3">
                <div className="text-[10px] uppercase tracking-[0.24em] text-ink/50">{k}</div>
                <div className="mt-1 font-medium">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.amenities.slice(0, 6).map((a) => (
              <span key={a} className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/70">{a}</span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <button className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-gold hover:text-ink">Book viewing</button>
            <Link to="/properties/$id" params={{ id: p.id }} className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-primary-foreground">
              View details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-canvas">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center lg:px-10">
        <div className="font-display text-lg font-semibold">Homeloop<span className="text-gold">.</span></div>
        <div className="text-xs text-ink/50">© 2026 Homeloop. Curated homes, worldwide.</div>
      </div>
    </footer>
  );
}