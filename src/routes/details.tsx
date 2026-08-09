import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { PropertyCard } from "@/components/property-card";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useBooking } from "@/components/booking-context";
import { properties, type Property } from "@/lib/properties";
import heroVilla from "@/assets/hero-villa.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import area1 from "@/assets/area-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

export const Route = createFileRoute("/details")({
  head: () => ({
    meta: [
      { title: "Villa Serenne — Cap Ferrat, French Riviera | Homeloop" },
      { name: "description", content: "Villa Serenne, a contemporary villa overlooking the Mediterranean in Cap Ferrat. 5 bedrooms, 620 sqm, infinity pool, sea views. £8.45M." },
    ],
  }),
  component: DetailsPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

const GALLERY = [heroVilla, property1, property2, property3, area1];
const FEATURES = [
  { name: "Infinity Pool", icon: "pool" },
  { name: "Private Cinema", icon: "cinema" },
  { name: "Sea View", icon: "sea" },
  { name: "Wine Cellar", icon: "wine" },
  { name: "Gym", icon: "gym" },
  { name: "Smart Home", icon: "smart" },
  { name: "Landscaped Garden", icon: "garden" },
  { name: "Security System", icon: "security" },
  { name: "Home Office", icon: "office" },
  { name: "Outdoor Kitchen", icon: "kitchen" },
] as const;

const NEARBY = [
  { label: "Fine Dining", time: "5 mins", icon: "dining" },
  { label: "Private Marina", time: "4 mins", icon: "marina" },
  { label: "International School", time: "12 mins", icon: "school" },
  { label: "Airport", time: "28 mins", icon: "airport" },
  { label: "Beach", time: "2 mins", icon: "beach" },
  { label: "Hospital", time: "10 mins", icon: "hospital" },
] as const;

const SPECS_TABLE: [string, string][] = [
  ["Property ID", "HL-VSE-2024"],
  ["Property Type", "Contemporary Villa"],
  ["Status", "For Sale"],
  ["Bedrooms", "5"],
  ["Bathrooms", "6"],
  ["Interior Area", "620 sqm"],
  ["Lot Size", "1,240 sqm"],
  ["Orientation", "South-West"],
  ["View", "Panoramic Sea"],
  ["Price", "£8.45M"],
];

function DetailsPage() {
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [quickView, setQuickView] = useState<Property | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const { openBooking } = useBooking();
  const villaSerenne = properties[0];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <motion.div style={{ width: progress }} className="fixed inset-x-0 top-0 z-[80] h-[2px] bg-gold" />
      <SiteNav overDark />

      <Hero onOpenGallery={setGalleryOpen} />
      <GallerySection onOpen={setGalleryOpen} />
      <Overview />
      <SpecCards />
      <FeaturesSection />
      <Lifestyle />
      <Location />
      <FloorPlanTour />
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 lg:grid-cols-[1fr_380px] lg:gap-20 lg:px-10">
        <main className="min-w-0 space-y-24">
          <SpecsTable />
        </main>
        <StickyContact />
      </div>
      <SimilarSection onQuickView={setQuickView} />
      <FinalCTA />
      <Footer />

      <QuickViewModal property={quickView} onClose={() => setQuickView(null)} />
      <AnimatePresence>
        {galleryOpen !== null && <Lightbox images={GALLERY} start={galleryOpen} onClose={() => setGalleryOpen(null)} />}
      </AnimatePresence>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-ink/10 bg-canvas/95 p-4 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.24em] text-ink/50">Price</div>
          <div className="truncate font-display text-lg font-medium">£8.45M</div>
        </div>
        <button onClick={() => openBooking(villaSerenne)} className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground">Book viewing</button>
      </div>
    </div>
  );
}

/* -------------------- Hero -------------------- */

function Hero({ onOpenGallery }: { onOpenGallery: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const { openBooking } = useBooking();
  const villaSerenne = properties[0];

  const stats = ["5 Bedrooms", "6 Bathrooms", "620 sqm", "Contemporary Villa"];

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-primary-foreground">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={heroVilla} alt="Villa Serenne overlooking the ocean at golden hour" className="h-full w-full object-cover animate-hl-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 px-6 pb-24 pt-32 lg:grid-cols-12 lg:px-10 lg:pb-32 lg:pt-36">
        <motion.nav initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="lg:col-span-12 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-primary-foreground/60">
          <span>Home</span><span>/</span><span>Properties</span><span>/</span>
          <span className="text-primary-foreground/90">Villa Serenne</span>
        </motion.nav>

        <div className="lg:col-span-8 lg:self-end">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="text-eyebrow text-primary-foreground/60">
            <span className="mr-2 inline-block h-px w-6 bg-current align-middle opacity-60" />
            For Sale
          </motion.div>

          <h1 className="mt-6 max-w-3xl text-[clamp(2.4rem,6vw,5.4rem)] font-medium leading-[1] tracking-[-0.03em]">
            {["Villa", "Serenne"].map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }} className="inline-block pr-3">
                {i === 1 ? <span className="font-serif-display text-gold">{w}</span> : w}
              </motion.span>
            ))}
          </h1>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.5 }} className="mt-6 flex items-center gap-2 text-primary-foreground/70">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            <span className="text-sm">Cap Ferrat, French Riviera</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.6 }} className="mt-8 font-display text-3xl font-medium tracking-tight lg:text-4xl">
            £8.45M
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.7 }} className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary-foreground/80">
            {stats.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                {s}
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.85 }} className="mt-10 flex flex-wrap items-center gap-3">
            <button onClick={() => openBooking(villaSerenne)} className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[13px] font-medium text-ink transition-transform hover:scale-[1.03]">
              Book a Viewing
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-ink/30 px-6 py-3 text-[13px] font-medium text-primary-foreground backdrop-blur transition-all hover:border-primary-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9z" /></svg>
              Save Property
            </button>
            <button onClick={() => onOpenGallery(0)} className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-ink/30 px-5 py-3 text-[13px] font-medium text-primary-foreground backdrop-blur transition-all hover:border-primary-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 17l-6-6-8 8" /></svg>
              {GALLERY.length} photos
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Gallery -------------------- */

function GallerySection({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Gallery" title="Step inside." />
      <div className="mt-10 hidden gap-4 md:grid md:grid-cols-4 md:grid-rows-2">
        <motion.button initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.8, ease }}
          onClick={() => onOpen(0)} className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl bg-ink/5">
          <img src={GALLERY[0]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
        </motion.button>
        {GALLERY.slice(1, 5).map((src, i) => (
          <motion.button key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease, delay: 0.08 * (i + 1) }}
            onClick={() => onOpen(i + 1)} className="group relative overflow-hidden rounded-3xl bg-ink/5">
            <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
          </motion.button>
        ))}
      </div>
      <div className="mt-8 -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 md:hidden">
        {GALLERY.map((src, i) => (
          <button key={i} onClick={() => onOpen(i)} className="relative aspect-[4/5] w-[78%] shrink-0 snap-center overflow-hidden rounded-2xl bg-ink/5">
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Overview -------------------- */

function Overview() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Overview" title="About the Property" />
      <div className="mt-10 max-w-[640px] space-y-8">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }}
          className="text-[17px] leading-[1.75] text-ink/75">
          Perched above the Mediterranean on the most coveted stretch of Cap Ferrat, Villa Serenne is a study in restrained contemporary architecture. Floor-to-ceiling glass dissolves the boundary between interior and horizon, while hand-troweled plaster and brushed oak bring warmth to the clean lines. Every principal room faces the sea, and every terrace catches the last gold of the evening.
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="text-[17px] leading-[1.75] text-ink/75">
          Designed by an award-winning studio and completed in 2024, the villa balances five generous bedroom suites with vast, flexible living spaces — a glass-walled living room, a chef's kitchen opening to the outdoor kitchen, and a lower-ground wellness level with pool, cinema and wine cellar. The infinity pool seems to spill into the bay below, and the landscaped garden offers complete privacy from the coastal path.
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------- Spec cards -------------------- */

function SpecCards() {
  const cards: [string, string][] = [
    ["Year Built", "2024"],
    ["Lot Size", "1,240 sqm"],
    ["Parking", "3 Spaces"],
    ["Energy Rating", "A+"],
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-6 pb-8 lg:px-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(([k, v], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease, delay: i * 0.08 }}
            className="rounded-3xl bg-canvas p-8 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
            <div className="font-display text-3xl font-medium tracking-tight">{v}</div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-ink/50">{k}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Features -------------------- */

function FeatureIcon({ name }: { name: string }) {
  const common = "h-6 w-6";
  const paths: Record<string, ReactNode> = {
    pool: <><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" /><path d="M6 14V5a2 2 0 0 1 4 0" /></>,
    cinema: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M10 9l5 3-5 3z" /></>,
    sea: <><path d="M12 3c-3 5-6 7-6 11a6 6 0 0 0 12 0c0-4-3-6-6-11z" /></>,
    wine: <><path d="M8 2h8l-1 7a4 4 0 0 1-6 0z" /><path d="M12 9v11" /><path d="M8 21h8" /></>,
    gym: <><path d="M6 8v8M18 8v8M3 11v2M21 11v2M6 12h12" /></>,
    smart: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></>,
    garden: <><path d="M12 22V8" /><path d="M12 8c0-3 2-5 5-5 0 3-2 5-5 5z" /><path d="M12 11c0-3-2-5-5-5 0 3 2 5 5 5z" /></>,
    security: <><path d="M12 2l8 3v7c0 5-4 9-8 10-4-1-8-5-8-10V5z" /><path d="M9 12l2 2 4-4" /></>,
    office: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v16" /></>,
    kitchen: <><path d="M4 20h16M6 20v-8a4 4 0 0 1 8 0v8M14 12v8" /><path d="M10 4v4" /></>,
  };
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Features" title="Key Features" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease, delay: (i % 3) * 0.08 }}
            className="group flex items-center gap-4 rounded-3xl border border-ink/8 bg-canvas p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.2)]">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-primary-foreground transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
              <FeatureIcon name={f.icon} />
            </span>
            <span className="font-display text-lg font-medium tracking-tight">{f.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Lifestyle -------------------- */

function Lifestyle() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader eyebrow="Lifestyle" title="Living on the Cap." />
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl">
            <img src={area1} alt="Cap Ferrat lifestyle" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
            className="max-w-xl space-y-6">
            <p className="text-[17px] leading-[1.75] text-ink/75">
              Cap Ferrat is a wooded peninsula of private villas, hidden coves and a single coastal path that threads the rocks between Beaulieu and Villefranche. Mornings belong to the sea; afternoons to the garden; evenings to long, unhurried dinners under the pines.
            </p>
            <ul className="space-y-4 text-sm text-ink/70">
              {[
                ["Private beaches", "Three secluded coves within a ten-minute walk, two with beach clubs open through October."],
                ["Fine dining", "A two-star table and a handful of family-run trattorias, all on the peninsula."],
                ["Marina", "The port of Saint-Jean-Cap-Ferrat holds 400 berths and a sailing school five minutes away."],
                ["Shopping", "A daily market, a fromagerie, a bakery — and the designer quarter of Beaulieu ten minutes by car."],
                ["International schools", "Three accredited schools within a fifteen-minute drive, plus a bilingual crèche."],
                ["Walking distance", "Everything for daily life — bakery, pharmacy, café, beach — sits within a short walk of the gate."],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span><span className="font-medium text-ink">{t}.</span> {b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Location -------------------- */

function NearbyIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    dining: <><path d="M6 2v8a3 3 0 0 0 6 0V2M9 2v20" /><path d="M18 2c-2 0-3 3-3 6s1 4 3 4v10" /></>,
    marina: <><path d="M2 20h20M4 20V8l5-3 5 3 6-3v12" /><path d="M12 5v15" /></>,
    school: <><path d="M12 4l9 4-9 4-9-4 9-4z" /><path d="M7 10v5c0 1 2 3 5 3s5-2 5-3v-5" /></>,
    airport: <><path d="M10 2L8 8 2 11l6 3 2 6 2-6 6-3-6-3z" /><path d="M10 2v20" /></>,
    beach: <><circle cx="6" cy="7" r="3" /><path d="M2 20c2-4 8-4 10 0M14 20c2-4 6-4 8 0" /></>,
    hospital: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 8v8M8 12h8" /></>,
  };
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] ?? <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

function Location() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Location" title="What's nearby." />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease }}
          className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 bg-ink/5 md:aspect-auto md:min-h-[420px]">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center text-ink/40">
              <svg className="mx-auto h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
              <div className="mt-3 text-xs uppercase tracking-[0.24em]">Cap Ferrat, France</div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.04)_100%)]" />
        </motion.div>
        <div className="grid grid-cols-1 gap-3">
          {NEARBY.map((n, i) => (
            <motion.div key={n.label} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              className="flex items-center justify-between rounded-2xl border border-ink/8 bg-canvas p-5 transition-all hover:border-gold/40">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink/70"><NearbyIcon name={n.icon} /></span>
                <span className="text-sm font-medium">{n.label}</span>
              </div>
              <span className="text-sm text-ink/50">{n.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Floor plan & virtual tour -------------------- */

function FloorPlanTour() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
      <SectionHeader eyebrow="Explore" title="Floor Plan & Virtual Tour" />
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease }}
          className="group overflow-hidden rounded-3xl border border-ink/8 bg-canvas p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.2)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink/5">
            <svg viewBox="0 0 400 250" className="h-full w-full text-ink/50" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="20" y="20" width="360" height="210" rx="4" />
              <path d="M20 130h180M200 20v100M200 160v70M200 170h100M300 130v40" />
              <text x="80" y="80" className="fill-current stroke-none text-[10px]">Living</text>
              <text x="250" y="70" className="fill-current stroke-none text-[10px]">Kitchen</text>
              <text x="240" y="200" className="fill-current stroke-none text-[10px]">Master</text>
              <text x="330" y="200" className="fill-current stroke-none text-[10px]">Bath</text>
              <text x="80" y="200" className="fill-current stroke-none text-[10px]">Terrace</text>
            </svg>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <div className="font-display text-xl font-medium">Floor Plan</div>
              <div className="mt-1 text-sm text-ink/50">3 levels · 620 sqm</div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium transition-all hover:bg-ink hover:text-primary-foreground">
              View Floor Plan
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="group relative overflow-hidden rounded-3xl">
          <img src={property3} alt="Virtual tour preview" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
          <div className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/30" />
          <button className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-canvas/95 text-ink shadow-2xl transition-transform group-hover:scale-110">
              <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
          <div className="absolute bottom-6 left-6 text-primary-foreground">
            <div className="text-eyebrow text-primary-foreground/70">Immersive · 3D</div>
            <div className="mt-1 font-display text-2xl">Virtual Tour</div>
            <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-105">
              Start Virtual Tour
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Sticky contact -------------------- */

function StickyContact() {
  const { openBooking } = useBooking();
  const villaSerenne = properties[0];
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-3xl border border-ink/10 bg-canvas p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
          <div className="text-eyebrow">Schedule a Viewing</div>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">Book a private tour of this property. Our agents host in-person and virtual visits, seven days a week.</p>
          <div className="mt-5 space-y-2">
            <button onClick={() => openBooking(villaSerenne)} className="w-full rounded-full bg-ink py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-gold hover:text-ink">Book Viewing</button>
            <button className="w-full rounded-full border border-ink/15 py-3 text-sm transition-all hover:bg-ink/5">Request Information</button>
          </div>
          <div className="my-6 h-px bg-ink/10" />
          <div className="flex items-center gap-3">
            <img src={agent2} alt="Julien Moreau" className="h-14 w-14 rounded-full object-cover" />
            <div className="min-w-0">
              <div className="truncate font-display text-base font-medium">Julien Moreau</div>
              <div className="truncate text-xs text-ink/50">Luxury Property Specialist</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-ink/70">
              <svg className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" /></svg>
              +33 4 89 55 0198
            </div>
            <div className="flex items-center gap-2 text-ink/70">
              <svg className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
              julien@homeloop.studio
            </div>
            <div className="flex items-center gap-2 text-ink/70">
              <svg className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              Replies under 2 hours
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["French", "English", "German"].map((l) => (
              <span key={l} className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/70">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* -------------------- Specs table -------------------- */

function SpecsTable() {
  return (
    <section>
      <SectionHeader eyebrow="Details" title="Property Specifications" />
      <div className="mt-10">
        <dl className="divide-y divide-ink/8">
          {SPECS_TABLE.map(([k, v], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.5, ease, delay: i * 0.04 }}
              className="flex items-center justify-between py-4">
              <dt className="text-[11px] uppercase tracking-[0.24em] text-ink/50">{k}</dt>
              <dd className="font-display text-base font-medium">{v}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------- Similar -------------------- */

function SimilarSection({ onQuickView }: { onQuickView: (p: Property) => void }) {
  const items = properties.slice(1, 4);
  return (
    <section className="border-t border-ink/10 bg-canvas py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <SectionHeader eyebrow="You May Also Like" title="Similar properties." />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <PropertyCard key={p.id} p={p} index={i} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */

function FinalCTA() {
  const { openBooking } = useBooking();
  const villaSerenne = properties[0];
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-primary-foreground">
      <img src={ctaBg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/60" />
      <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-10">
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
          className="relative mx-auto max-w-3xl text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.03em]">
          Ready to Experience <span className="font-serif-display text-gold">Villa Serenne</span> in Person?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-primary-foreground/70">
          Schedule a private viewing at your pace. Our agents host in-person and virtual tours of Villa Serenne, seven days a week.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease, delay: 0.25 }}
          className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => openBooking(villaSerenne)} className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-105">Book a Viewing</button>
          <button className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-medium transition-all hover:bg-primary-foreground hover:text-ink">Contact Agent</button>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Footer (matches Homepage) -------------------- */

function Footer() {
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

/* -------------------- Lightbox -------------------- */

function Lightbox({ images, start, onClose }: { images: string[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((n) => (n + 1) % images.length);
      if (e.key === "ArrowLeft") setI((n) => (n - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);
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
        <button onClick={() => setI((n) => (n - 1 + images.length) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink" aria-label="Previous">
          <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M10 3L5 8l5 5" fill="none" /></svg>
        </button>
        <div className="text-sm text-primary-foreground/70">{i + 1} / {images.length}</div>
        <button onClick={() => setI((n) => (n + 1) % images.length)} className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink" aria-label="Next">
          <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5"><path d="M6 3l5 5-5 5" fill="none" /></svg>
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------- Shared -------------------- */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease }}>
      <div className="text-eyebrow"><span className="mr-2 inline-block h-px w-6 bg-current align-middle opacity-40" />{eyebrow}</div>
      <h2 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
    </motion.div>
  );
}
