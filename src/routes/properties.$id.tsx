import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { findProperty, formatPrice, properties, type Property } from "@/lib/properties";

export const Route = createFileRoute("/properties/$id")({
  loader: ({ params }) => {
    const p = findProperty(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Property — Homeloop" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.title} — ${loaderData.location} | Homeloop` },
        { name: "description", content: `${loaderData.title} in ${loaderData.location}. ${loaderData.beds} bedrooms, ${loaderData.baths} baths, ${loaderData.area} sqm. ${formatPrice(loaderData.price)}.` },
        { property: "og:title", content: `${loaderData.title} — ${loaderData.location}` },
        { property: "og:description", content: `${loaderData.description.slice(0, 150)}…` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PropertyDetail,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
      <div>
        <h1 className="font-display text-4xl">Property not found</h1>
        <Link to="/properties" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground">Back to collection</Link>
      </div>
    </div>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;

function PropertyDetail() {
  const p = Route.useLoaderData();
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const similar = useMemo(() => properties.filter((x) => x.id !== p.id).slice(0, 3), [p.id]);

  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <motion.div style={{ width: progress }} className="fixed inset-x-0 top-0 z-[80] h-[2px] bg-gold" />
      <SiteNav overDark />

      <DetailHero p={p} onOpenGallery={(i) => setGalleryOpen(i)} />

      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 lg:grid-cols-[1fr_380px] lg:gap-20 lg:px-10">
        <main className="min-w-0 space-y-24">
          <Overview p={p} />
          <Features p={p} />
          <Gallery p={p} onOpen={setGalleryOpen} />
          <FloorPlan />
          <VirtualTour p={p} />
          <MapSection p={p} />
          <Lifestyle p={p} />
          <MortgageCalculator price={p.price} />
          <AgentSection p={p} />
          <FAQ />
        </main>
        <StickyBooking p={p} />
      </div>

      <SimilarSection items={similar} />
      <FinalCTA />
      <Footer />

      <AnimatePresence>
        {galleryOpen !== null && <FullscreenGallery images={p.images} start={galleryOpen} onClose={() => setGalleryOpen(null)} />}
      </AnimatePresence>

      {/* Mobile bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink/10 bg-canvas/95 p-4 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.24em] text-ink/50">Price</div>
          <div className="truncate font-display text-lg font-medium">{formatPrice(p.price)}</div>
        </div>
        <button className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground">Book viewing</button>
      </div>
    </div>
  );
}

/* -------------------- Hero -------------------- */

function DetailHero({ p, onOpenGallery }: { p: Property; onOpenGallery: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative min-h-[95svh] w-full overflow-hidden bg-ink text-primary-foreground">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover animate-hl-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[95svh] max-w-[1400px] grid-cols-1 gap-8 px-6 pb-14 pt-40 lg:grid-cols-12 lg:px-10 lg:pb-20">
        <div className="lg:col-span-8 lg:self-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="text-eyebrow text-primary-foreground/60">
            <span className="inline-block h-px w-6 bg-current opacity-60 mr-2 align-middle" />
            {p.status} · {p.category}
          </motion.div>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-[1] tracking-[-0.03em]">
            {p.title.split(" ").map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }} className="inline-block pr-3">
                {i === p.title.split(" ").length - 1 ? <span className="font-serif-display italic text-gold">{w}</span> : w}
              </motion.span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.5 }} className="mt-6 flex items-center gap-2 text-primary-foreground/70">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <span className="text-sm">{p.location}</span>
          </motion.div>

          <motion.button
            onClick={() => onOpenGallery(0)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.7 }}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-ink/40 px-5 py-2.5 text-[13px] font-medium text-primary-foreground backdrop-blur transition-all hover:border-gold hover:text-gold"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 17l-6-6-8 8" /></svg>
            View all {p.images.length} photos
          </motion.button>
        </div>

        <div className="lg:col-span-4 lg:self-end">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.5 }}
            className="rounded-3xl border border-primary-foreground/10 bg-canvas/95 p-6 text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className="text-eyebrow">{p.status}</div>
            <div className="mt-2 font-display text-3xl font-medium">{formatPrice(p.price)}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink/10 pt-4 text-center text-sm">
              <div><div className="font-medium">{p.beds}</div><div className="text-[10px] uppercase tracking-[0.2em] text-ink/50">Beds</div></div>
              <div className="border-x border-ink/10"><div className="font-medium">{p.baths}</div><div className="text-[10px] uppercase tracking-[0.2em] text-ink/50">Baths</div></div>
              <div><div className="font-medium">{p.area}</div><div className="text-[10px] uppercase tracking-[0.2em] text-ink/50">Sqm</div></div>
            </div>
            <button className="mt-5 w-full rounded-full bg-ink py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-gold hover:text-ink">Book viewing</button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="rounded-full border border-ink/15 py-2.5 text-[12px] font-medium hover:bg-ink/5">Save</button>
              <button className="rounded-full border border-ink/15 py-2.5 text-[12px] font-medium hover:bg-ink/5">Share</button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Sections -------------------- */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
      <div className="text-eyebrow"><span className="inline-block h-px w-6 bg-current opacity-40 mr-2 align-middle" />{eyebrow}</div>
      <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
    </motion.div>
  );
}

function Overview({ p }: { p: Property }) {
  return (
    <section>
      <SectionHeader eyebrow="Overview" title="A quiet architectural statement." />
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease, delay: 0.15 }}
        className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/75">
        {p.description}
      </motion.p>
    </section>
  );
}

function Features({ p }: { p: Property }) {
  const items: [string, string][] = [
    [`${p.beds}`, "Bedrooms"], [`${p.baths}`, "Bathrooms"], [`${p.parking}`, "Parking"],
    [`${p.area}`, "Sqm"], [`${p.yearBuilt}`, "Built"], [p.energy, "Energy"],
    ...p.amenities.slice(0, 4).map((a) => ["·", a] as [string, string]),
  ];
  return (
    <section>
      <SectionHeader eyebrow="Features" title="Every detail, considered." />
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 md:grid-cols-3">
        {items.map(([v, l], i) => (
          <motion.div
            key={l + i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease, delay: (i % 3) * 0.08 }}
            className="bg-canvas p-6 md:p-8"
          >
            <div className="font-display text-4xl font-medium tracking-tight">{v}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-ink/50">{l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Gallery({ p, onOpen }: { p: Property; onOpen: (i: number) => void }) {
  return (
    <section>
      <SectionHeader eyebrow="Gallery" title="Step inside." />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {p.images.concat(p.images).slice(0, 6).map((src, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease, delay: (i % 4) * 0.07 }}
            onClick={() => onOpen(i % p.images.length)}
            className={`group relative overflow-hidden rounded-2xl bg-ink/5 ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/5]"}`}
          >
            <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function FloorPlan() {
  return (
    <section>
      <SectionHeader eyebrow="Floor plan" title="Understand the flow." />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_240px]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink/10 bg-canvas p-10">
          <svg viewBox="0 0 400 250" className="h-full w-full text-ink/60" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="20" y="20" width="360" height="210" rx="4" />
            <path d="M20 130h180M200 20v100M200 160v70M200 170h100M300 130v40" />
            <text x="80" y="80" className="fill-current stroke-none text-[10px]">Living</text>
            <text x="250" y="70" className="fill-current stroke-none text-[10px]">Kitchen</text>
            <text x="240" y="200" className="fill-current stroke-none text-[10px]">Master</text>
            <text x="330" y="200" className="fill-current stroke-none text-[10px]">Bath</text>
            <text x="80" y="200" className="fill-current stroke-none text-[10px]">Terrace</text>
          </svg>
        </div>
        <div className="flex flex-col justify-between gap-3">
          <p className="text-sm text-ink/60">Explore each room. Zoom and download for offline viewing.</p>
          <div className="grid gap-2">
            <button className="rounded-full border border-ink/15 py-2.5 text-sm hover:bg-ink/5">Zoom</button>
            <button className="rounded-full border border-ink/15 py-2.5 text-sm hover:bg-ink/5">Fullscreen</button>
            <button className="rounded-full bg-ink py-2.5 text-sm text-primary-foreground hover:bg-gold hover:text-ink">Download PDF</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function VirtualTour({ p }: { p: Property }) {
  return (
    <section>
      <SectionHeader eyebrow="Virtual tour" title="Wander through." />
      <div className="group relative mt-10 aspect-video overflow-hidden rounded-3xl">
        <img src={p.images[1]} alt="Virtual tour preview" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
        <div className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/30" />
        <button className="absolute inset-0 grid place-items-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-canvas/95 text-ink shadow-2xl transition-transform group-hover:scale-110">
            <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
        <div className="absolute bottom-6 left-6 text-primary-foreground">
          <div className="text-eyebrow text-primary-foreground/70">Immersive · 3D</div>
          <div className="mt-1 font-display text-2xl">4-min guided tour</div>
        </div>
      </div>
    </section>
  );
}

function MapSection({ p }: { p: Property }) {
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - 0.02},${p.lat - 0.02},${p.lng + 0.02},${p.lat + 0.02}&layer=mapnik&marker=${p.lat},${p.lng}`;
  return (
    <section>
      <SectionHeader eyebrow="Location" title="What's nearby." />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 md:aspect-auto">
          <iframe title="Map" src={map} className="absolute inset-0 h-full w-full grayscale" loading="lazy" />
        </div>
        <ul className="grid grid-cols-1 gap-3">
          {p.nearby.map((n, i) => (
            <motion.li key={n.label}
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              className="flex items-center justify-between rounded-2xl border border-ink/10 bg-canvas p-4">
              <span className="text-sm">{n.label}</span>
              <span className="text-xs text-ink/50">{n.distance}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Lifestyle({ p }: { p: Property }) {
  const cards = [
    { title: "The neighborhood", body: "Cobbled walking streets, morning light on stone facades, and cafés that have belonged to the same families for generations.", img: p.images[2] },
    { title: "Schools & learning", body: "Three internationally accredited schools within a fifteen-minute drive, plus a beloved public library.", img: p.images[0] },
    { title: "Everyday commute", body: "Twelve minutes to the coastal expressway, twenty-two minutes to the international terminal by high-speed rail.", img: p.images[1] },
  ];
  return (
    <section>
      <SectionHeader eyebrow="Lifestyle" title="A day in the neighborhood." />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.article key={c.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.1 }}
            className="group overflow-hidden rounded-3xl bg-canvas">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={c.img} alt="" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function MortgageCalculator({ price }: { price: number }) {
  const [deposit, setDeposit] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(4.2);
  const [years, setYears] = useState(25);
  const loan = Math.max(0, price - deposit);
  const monthly = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return loan / n;
    return (loan * r) / (1 - Math.pow(1 + r, -n));
  }, [loan, rate, years]);

  return (
    <section>
      <SectionHeader eyebrow="Financing" title="Estimate your monthly payment." />
      <div className="mt-10 grid gap-6 rounded-3xl border border-ink/10 bg-canvas p-8 md:grid-cols-2 md:p-10">
        <div className="space-y-6">
          <Field label="Deposit" value={`€${deposit.toLocaleString()}`}>
            <input type="range" min={0} max={price} step={10000} value={deposit} onChange={(e) => setDeposit(+e.target.value)} className="w-full accent-[color:var(--gold)]" />
          </Field>
          <Field label="Interest rate" value={`${rate.toFixed(2)}%`}>
            <input type="range" min={1} max={9} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full accent-[color:var(--gold)]" />
          </Field>
          <Field label="Loan term" value={`${years} years`}>
            <input type="range" min={5} max={35} step={1} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-[color:var(--gold)]" />
          </Field>
        </div>
        <div className="flex flex-col justify-center rounded-2xl bg-ink p-8 text-primary-foreground">
          <div className="text-eyebrow text-primary-foreground/60">Estimated monthly</div>
          <motion.div key={Math.round(monthly)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-3 font-display text-5xl font-medium tracking-tight md:text-6xl">
            €{Math.round(monthly).toLocaleString()}
          </motion.div>
          <div className="mt-4 text-xs text-primary-foreground/60">Loan €{loan.toLocaleString()} · {years} years · {rate.toFixed(2)}%</div>
          <button className="mt-8 self-start rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:scale-105 transition-transform">Speak to a broker</button>
        </div>
      </div>
    </section>
  );
}
function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-[11px] uppercase tracking-[0.24em] text-ink/50">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function AgentSection({ p }: { p: Property }) {
  return (
    <section>
      <SectionHeader eyebrow="Your agent" title="Speak with someone who knows the street." />
      <div className="mt-10 grid gap-8 rounded-3xl bg-canvas md:grid-cols-[280px_1fr]">
        <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
          <img src={p.agent.avatar} alt={p.agent.name} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="font-display text-3xl font-medium">{p.agent.name}</div>
          <div className="mt-1 text-sm text-ink/60">{p.agent.role}</div>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ink/70">
            {p.agent.name.split(" ")[0]} has helped over {p.agent.sold} families place roots in {p.location.split(",")[0]}. Fluent in the quiet cadence of private sales, sensitive to the small details that make a house feel like home.
          </p>
          <div className="mt-6 flex gap-6 border-y border-ink/10 py-4">
            <Stat k="Sold" v={`${p.agent.sold}+`} />
            <Stat k="Years" v={`${p.agent.years}`} />
            <Stat k="Response" v="< 1 hr" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-ink px-5 py-2.5 text-sm text-primary-foreground hover:bg-gold hover:text-ink transition-all">Schedule meeting</button>
            <button className="rounded-full border border-ink/15 px-5 py-2.5 text-sm hover:bg-ink/5">Message</button>
            <a href={`tel:${p.agent.phone}`} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm hover:bg-ink/5">{p.agent.phone}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
function Stat({ k, v }: { k: string; v: string }) {
  return <div><div className="font-display text-2xl font-medium">{v}</div><div className="text-[11px] uppercase tracking-[0.2em] text-ink/50">{k}</div></div>;
}

function FAQ() {
  const items = [
    ["Can I schedule a viewing?", "Yes — book directly from this page or through the agent panel. In-person and private virtual viewings are both available, seven days a week."],
    ["Can I make an offer?", "Absolutely. Our agents will guide you through the offer letter, deposit structure and legal timeline, tailored to your jurisdiction."],
    ["Are pets allowed?", "Most residences welcome pets. Individual buildings may have their own guidelines — your agent will confirm before you sign."],
    ["How is financing handled?", "We partner with private banks across Europe. From soft eligibility to notarial completion, everything is coordinated in one thread."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section>
      <SectionHeader eyebrow="FAQ" title="Answered honestly." />
      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {items.map(([q, a], i) => (
          <div key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left">
              <span className="font-display text-lg md:text-xl">{q}</span>
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-transform ${open === i ? "rotate-45 bg-ink text-primary-foreground" : ""}`}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" /></svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                  <p className="pb-6 pr-16 text-sm leading-relaxed text-ink/70">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Sticky booking rail -------------------- */

function StickyBooking({ p }: { p: Property }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-3xl border border-ink/10 bg-canvas p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <img src={p.agent.avatar} alt={p.agent.name} className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{p.agent.name}</div>
              <div className="truncate text-xs text-ink/50">{p.agent.role}</div>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <button className="w-full rounded-full bg-ink py-3 text-sm font-medium text-primary-foreground hover:bg-gold hover:text-ink transition-all">Book viewing</button>
            <button className="w-full rounded-full border border-ink/15 py-3 text-sm hover:bg-ink/5">Schedule tour</button>
            <button className="w-full rounded-full border border-ink/15 py-3 text-sm hover:bg-ink/5">Message agent</button>
            <a href={`tel:${p.agent.phone}`} className="block w-full rounded-full border border-ink/15 py-3 text-center text-sm hover:bg-ink/5">{p.agent.phone}</a>
          </div>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-primary-foreground">
          <div className="text-eyebrow text-primary-foreground/60">Estimate</div>
          <div className="mt-2 font-display text-2xl font-medium">€{Math.round((p.price * 0.8 * (0.042 / 12)) / (1 - Math.pow(1 + 0.042 / 12, -300))).toLocaleString()}/mo</div>
          <div className="mt-1 text-xs text-primary-foreground/60">25y · 4.2% · 20% down</div>
          <button className="mt-4 text-xs text-gold underline underline-offset-4">Adjust calculator</button>
        </div>
      </div>
    </aside>
  );
}

/* -------------------- Similar + CTA -------------------- */

function SimilarSection({ items }: { items: Property[] }) {
  return (
    <section className="border-t border-ink/10 bg-canvas py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader eyebrow="You might also love" title="Handpicked next steps." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              className="group">
              <Link to="/properties/$id" params={{ id: p.id }} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                    <div className="text-[11px] uppercase tracking-[0.2em] opacity-70">{p.location}</div>
                    <div className="mt-1 flex items-end justify-between">
                      <div className="font-display text-2xl">{p.title}</div>
                      <div className="font-display text-lg">{formatPrice(p.price)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-primary-foreground">
      <img src="/__missing__" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30" onError={(e) => (e.currentTarget.style.display = "none")} />
      <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.03em]">
          Ready to see it <span className="font-serif-display italic text-gold">in person?</span>
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink hover:scale-105 transition-transform">Book viewing</button>
          <button className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-medium hover:bg-primary-foreground hover:text-ink transition-all">Contact agent</button>
        </motion.div>
      </div>
    </section>
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

/* -------------------- Fullscreen gallery -------------------- */

function FullscreenGallery({ images, start, onClose }: { images: string[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink">
      <button onClick={onClose} className="absolute right-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink" aria-label="Close">
        <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
      </button>
      <div className="grid h-full place-items-center p-6 md:p-14">
        <AnimatePresence mode="wait">
          <motion.img
            key={i} src={images[i]}
            initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="max-h-full max-w-full rounded-lg object-contain"
            alt=""
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
        <button onClick={() => setI((n) => (n - 1 + images.length) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink">
          <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5" fill="none" /></svg>
        </button>
        <div className="text-sm text-primary-foreground/70">{i + 1} / {images.length}</div>
        <button onClick={() => setI((n) => (n + 1) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink">
          <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M6 3l5 5-5 5" fill="none" /></svg>
        </button>
      </div>
    </motion.div>
  );
}