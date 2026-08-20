import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useBooking } from "@/components/booking-context";
import { properties, type Property } from "@/lib/properties";
import heroVilla from "@/assets/hero-villa.jpg";
import area1 from "@/assets/area-1.jpg";
import area2 from "@/assets/area-2.jpg";
import area3 from "@/assets/area-3.jpg";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import ctaBg from "@/assets/cta-bg.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Homeloop — Find the place you'll never want to leave" },
      { name: "description", content: "The buyer conversion system for modern real estate agencies, brokers and luxury developers. Turn visitors into booked viewings." },
      { property: "og:title", content: "Homeloop — The Buyer Conversion System" },
      { property: "og:description", content: "Turn visitors into booked viewings. A premium website template for agencies, brokers and luxury developers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* -------------------- shared UI -------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-eyebrow flex items-center gap-2 ${className}`}>
      <span className="inline-block h-px w-6 bg-current opacity-40" />
      {children}
    </div>
  );
}

function GoldButton({ children, variant = "solid" }: { children: ReactNode; variant?: "solid" | "ghost" }) {
  if (variant === "ghost") {
    return (
      <button className="group inline-flex items-center gap-2 text-sm font-medium tracking-tight text-ink">
        <span className="relative">
          {children}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 group-hover:scale-x-100" />
        </span>
        <ArrowRight />
      </button>
    );
  }
  return (
    <button className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-500 hover:pl-7 hover:pr-8">
      <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative">{children}</span>
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform duration-500 group-hover:translate-x-1">
        <ArrowRight />
      </span>
    </button>
  );
}

function ArrowRight({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* -------------------- Navigation -------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["Properties", "Neighborhoods", "Agents", "Process", "Journal"];
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-canvas/70 border-b border-ink/5" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10 transition-all duration-500 ${scrolled ? "h-14" : "h-20"}`}>
        <a href="#" className="flex items-center gap-2">
          <span className={`font-display font-semibold tracking-tight transition-all duration-500 ${scrolled ? "text-lg" : "text-xl"} text-ink`}>
            Homeloop<span className="text-gold">.</span>
          </span>
        </a>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="group relative text-[13px] font-medium text-ink/70 transition-colors hover:text-ink">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="hidden text-[13px] font-medium text-ink/70 hover:text-ink md:inline">Sign in</button>
          <button
            onClick={() => openBooking()}
            className={`rounded-full border transition-all duration-500 text-[13px] font-medium ${
            scrolled
              ? "bg-ink text-primary-foreground border-ink px-4 py-2"
              : "border-ink/20 text-ink px-4 py-2 hover:bg-ink hover:text-primary-foreground hover:border-ink"
          }`}>
            Book a viewing
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/* -------------------- Hero -------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, (v) => v * 0.35);
  const bgY = useTransform(sy, (v) => v * 0.35);
  const markerX = useTransform(sx, (v) => v * 1.1);
  const markerY = useTransform(sy, (v) => v * 1.1);
  const textX = useTransform(sx, (v) => v * -0.14);
  const textY = useTransform(sy, (v) => v * -0.14);

  const onMove = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 20);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  };

  return (
    <section ref={ref} onMouseMove={onMove} className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-primary-foreground">
      {/* Backdrop image */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-[-3%]"
        >
          <motion.img
            initial={{ clipPath: "inset(12% 0% 12% 0%)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            transition={{ duration: 1.6, ease }}
            src={heroVilla}
            alt="Luxury cliffside villa at golden hour"
            className="h-full w-full object-cover animate-hl-hero-zoom"
            width={1920}
            height={1200}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </motion.div>

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-gold/70 animate-hl-shimmer"
            style={{
              left: `${(i * 47) % 100}%`,
              top: `${(i * 83) % 100}%`,
              animationDelay: `${(i % 8) * 0.6}s`,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      <Nav />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-6 pb-10 pt-32 lg:px-10 lg:pt-40">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Headline */}
          <motion.div style={{ x: textX, y: textY }} className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.1 }}>
              <Eyebrow className="text-primary-foreground/60">The Buyer Conversion System · Est. 2026</Eyebrow>
            </motion.div>
            <h1 className="mt-8 max-w-5xl text-[clamp(2.6rem,6.8vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em]">
              {"Find the place you'll".split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.06 }}
                  className="inline-block pr-3"
                >
                  {w}
                </motion.span>
              ))}
              <br />
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.55 }}
                className="inline-block"
              >
                <span className="font-serif-display text-gold">never</span> want to leave.
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.8 }}
              className="mt-10 max-w-xl text-base leading-relaxed text-primary-foreground/70"
            >
              Helping modern buyers discover exceptional homes — while helping agencies convert more visitors into qualified enquiries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.95 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <Link
                to="/properties"
                search={{ location: undefined, type: undefined, beds: undefined, min: undefined, max: undefined }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-500 hover:pl-7 hover:pr-8"
              >
                <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Explore Properties</span>
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform duration-500 group-hover:translate-x-1">
                  <ArrowRight />
                </span>
              </Link>
              <button className="group inline-flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 transition-all group-hover:border-gold group-hover:bg-gold/10">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" /></svg>
                </span>
                Watch the film
              </button>
            </motion.div>
          </motion.div>

          {/* Editorial property marker — desktop */}
          <motion.div
            style={{ x: markerX, y: markerY }}
            className="pointer-events-none relative hidden lg:col-span-4 lg:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease, delay: 1.5 }}
              className="absolute right-0 top-16 xl:top-24"
            >
              <PropertyMarker />
            </motion.div>
          </motion.div>
        </div>

        {/* Editorial property marker — tablet / mobile */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.4 }}
          className="mt-10 lg:hidden"
        >
          <PropertyMarker compact />
        </motion.div>

        {/* Stats */}
        <div className="relative z-20 mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1.6 }}
            className="mb-6 hidden justify-end lg:flex"
          >
            <ScrollIndicator />
          </motion.div>
          <div className="grid grid-cols-2 gap-8 border-t border-primary-foreground/10 pt-8 md:grid-cols-4">
            <Stat value="98%" label="Properties sold" delay={1.4} />
            <Stat value="<10 min" label="Avg response" delay={1.5} />
            <Stat value="5,200+" label="Qualified buyers" delay={1.6} />
            <Stat value="A+" label="Client rating" delay={1.7} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyMarker({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 text-primary-foreground/70">
        <span className="text-[10px] tracking-[0.28em]">01</span>
        <span className="h-px w-6 shrink-0 bg-primary-foreground/30" />
        <div className="leading-relaxed">
          <span className="text-[10px] uppercase tracking-[0.24em] text-primary-foreground">Villa Serenne</span>
          <span className="mx-2 text-[10px] uppercase tracking-[0.2em] text-primary-foreground/55">Cap Ferrat, France</span>
          <span className="font-display text-[11px] tracking-[0.12em] text-gold">€8.45M</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-4">
      <div className="pt-1">
        <span className="block h-px w-14 bg-primary-foreground/35" />
      </div>
      <div className="text-right">
        <div className="text-[10px] tracking-[0.3em] text-primary-foreground/50">01</div>
        <div className="mt-3 text-[11px] uppercase tracking-[0.28em] text-primary-foreground">Villa Serenne</div>
        <div className="mt-1.5 text-[10px] uppercase tracking-[0.22em] text-primary-foreground/55">Cap Ferrat, France</div>
        <div className="mt-3 font-display text-[13px] tracking-[0.1em] text-gold">€8.45M</div>
        <span className="mt-4 ml-auto block h-14 w-px bg-gradient-to-b from-primary-foreground/35 to-transparent" />
      </div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="flex items-center gap-3 text-primary-foreground/50">
      <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
      <svg className="h-3.5 w-3.5 animate-hl-scroll-arrow" viewBox="0 0 12 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 1v13M2 10l4 4 4-4" />
      </svg>
    </div>
  );
}

function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      <div className="font-display text-3xl font-medium tracking-tight md:text-4xl">{value}</div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-primary-foreground/50">{label}</div>
    </motion.div>
  );
}

/* -------------------- Marquee logos -------------------- */

function LogoStrip() {
  const items = ["Sotheby's", "Christie's", "Compass", "Douglas Elliman", "Knight Frank", "Corcoran", "The Agency"];
  return (
    <section className="border-y border-ink/10 bg-canvas py-8">
      <div className="mx-auto max-w-[1400px] overflow-hidden px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="text-eyebrow shrink-0">Trusted worldwide</div>
          <div className="flex-1 overflow-hidden mask-fade-b">
            <div className="flex w-max animate-hl-marquee items-center gap-16 whitespace-nowrap">
              {[...items, ...items].map((it, i) => (
                <span key={i} className="font-serif-display text-2xl text-ink/40">{it}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Featured properties -------------------- */

function FeaturedProperties() {
  const [quickView, setQuickView] = useState<Property | null>(null);
  const items = properties.slice(0, 3).map((p) => ({
    p,
    image: p.images[0],
    title: p.title,
    price: `${(p.price / 1_000_000).toFixed(1)}M`,
    loc: p.location,
    beds: `${p.beds} bed · ${p.baths} bath · ${p.area} sqm`,
    size: (p.span === "lg" || p.span === "wide" ? "large" : "portrait") as "large" | "portrait",
  }));
  return (
    <>
    <section id="properties" className="bg-canvas py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow>Featured Residences · 24 available</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight text-ink">
              A private collection <span className="font-serif-display text-gold">worth stepping inside.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <GoldButton variant="ghost">Explore the collection</GoldButton>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-6 lg:gap-8">
          <PropertyCard {...items[0]} className="col-span-12 md:col-span-8" onQuickView={setQuickView} />
          <PropertyCard {...items[1]} className="col-span-12 md:col-span-4" onQuickView={setQuickView} />
          <PropertyCard {...items[2]} className="col-span-12 md:col-span-5" onQuickView={setQuickView} />
          <div className="col-span-12 flex flex-col justify-between md:col-span-7">
            <div className="rounded-2xl border border-ink/10 p-8 lg:p-12">
              <Eyebrow>Property Experience</Eyebrow>
              <h3 className="mt-5 font-display text-2xl leading-snug tracking-tight lg:text-3xl">
                Every listing is a mini experience — gallery, floor plan, virtual tour, mortgage teaser and a two-tap "book viewing".
              </h3>
              <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                {["Gallery preview", "Floor plan", "Virtual tour", "Nearby amenities", "Mortgage teaser", "Live agent"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-ink/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <QuickViewModal property={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}

function PropertyCard({
  image,
  title,
  price,
  loc,
  beds,
  size,
  className = "",
  onQuickView,
}: {
  image: string;
  title: string;
  price: string;
  loc: string;
  beds: string;
  size: "large" | "portrait";
  className?: string;
  onQuickView?: (p: Property) => void;
}) {
  const p = properties.find((x) => x.title === title);
  const { openBooking } = useBooking();
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease }}
      className={`group relative overflow-hidden rounded-2xl bg-ink ${className}`}
      onClick={() => p && onQuickView?.(p)}
      role="button"
      tabIndex={0}
    >
      <div className={`relative overflow-hidden ${size === "large" ? "aspect-[16/10]" : "aspect-[4/5]"}`}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        <button className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M6 3h12v18l-6-4-6 4V3z" /></svg>
        </button>

        <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground lg:p-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md">For sale</span>
            <span className="text-[11px] text-white/70">{loc}</span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-medium leading-tight tracking-tight lg:text-3xl">{title}</h3>
              <p className="mt-2 text-[13px] text-white/70">{beds}</p>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl">{price}</div>
            </div>
          </div>
          <div className="mt-6 max-h-0 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-h-20 group-hover:opacity-100">
            <div className="flex items-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); openBooking(p ?? null); }} className="rounded-full bg-gold px-4 py-2 text-xs font-medium text-ink">Book viewing</button>
              <button className="rounded-full border border-white/30 px-4 py-2 text-xs font-medium text-white">Virtual tour</button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------- Why choose us -------------------- */

function WhyUs() {
  const rows = [
    { n: "01", title: "A conversion system, not a brochure.", body: "Every scroll is designed to move visitors closer to booking a viewing. Warmth is engineered, not decorative." },
    { n: "02", title: "Reply in under ten minutes.", body: "Enquiries route to the right agent instantly. The typical Homeloop agency responds in under 10 minutes, 24/7." },
    { n: "03", title: "Editorial, always.", body: "Photography, typography and pacing borrowed from the magazines your buyers actually read. Never generic, never templated." },
    { n: "04", title: "Built to be featured.", body: "Framer-native motion, mobile-perfect, Awwwards-ready. Your website becomes marketing, not a cost." },
  ];
  return (
    <section className="bg-white py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-24 lg:px-10">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <Eyebrow>Why choose Homeloop</Eyebrow>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight">
            The website your <span className="font-serif-display text-gold">best buyer</span> would expect from you.
          </h2>
          <p className="mt-6 max-w-md text-ink/60">
            Homeloop is not a theme. It's a system. Four principles keep every page pointed at one outcome — a booked viewing.
          </p>
          <div className="mt-10 flex gap-3">
            <GoldButton>Start the tour</GoldButton>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="hairline" />
          {rows.map((r) => (
            <motion.div
              key={r.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="group grid grid-cols-12 gap-6 py-10 border-b border-ink/10"
            >
              <div className="col-span-2 font-serif-display text-2xl text-ink/40 transition-colors group-hover:text-gold">{r.n}</div>
              <div className="col-span-10">
                <h3 className="font-display text-2xl font-medium tracking-tight lg:text-3xl">{r.title}</h3>
                <p className="mt-3 max-w-xl text-ink/60">{r.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Testimonials -------------------- */

function Testimonials() {
  const stories = [
    {
      label: "Client Story · Cap Ferrat",
      quote:
        "Homeloop made the entire process feel effortless. From the first conversation to the final viewing, every detail was handled with care.",
      name: "Amelia Hart",
      role: "Director, Hart & Co.",
      location: "Cap Ferrat",
      purchased: "Purchased: Villa Serenne · Cap Ferrat",
      portrait: agent1,
      property: { name: "Villa Serenne", place: "Cap Ferrat, France", price: "€8.45M", img: property1 },
    },
    {
      label: "Client Story · London",
      quote:
        "The template feels handcrafted for our brand. It never looked like a template.",
      name: "Marcus Beaumont",
      role: "Principal Broker, Beaumont",
      location: "London",
      purchased: "Purchased: The Chilton Residence · Mayfair",
      portrait: agent2,
      property: { name: "The Chilton Residence", place: "Mayfair, London", price: "£6.20M", img: property2 },
    },
    {
      label: "Client Story · Barcelona",
      quote:
        "Response times improved dramatically. The entire experience finally feels as premium as the properties we represent.",
      name: "Sofia Villareal",
      role: "Head of Sales, Casa Nova",
      location: "Barcelona",
      purchased: "Purchased: Casa Lumière · Eixample",
      portrait: agent3,
      property: { name: "Casa Lumière", place: "Eixample, Barcelona", price: "€3.90M", img: property3 },
    },
  ];

  const [index, setIndex] = useState(0);
  const active = stories[index]!;
  const go = (dir: number) => setIndex((i) => (i + dir + stories.length) % stories.length);
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <section className="bg-canvas py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <motion.div {...reveal(0)}>
          <Eyebrow>What our clients say</Eyebrow>
        </motion.div>
        <motion.h2 {...reveal(0.08)} className="mt-6 max-w-3xl text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.05] tracking-tight">
          Good homes deserve a<br className="hidden sm:block" />{" "}
          <span className="font-serif-display text-gold">great experience.</span>
        </motion.h2>

        {/* Featured story */}
        <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          <motion.div {...reveal(0.12)} className="lg:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.portrait}
                  src={active.portrait}
                  alt={active.name}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.03, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="lg:col-span-7 lg:pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease }}
              >
                <div className="text-eyebrow">{active.label}</div>
                <p className="mt-8 max-w-2xl font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium leading-[1.28] tracking-tight text-ink">
                  “{active.quote}”
                </p>
                <div className="mt-10">
                  <div className="text-base font-medium tracking-tight">{active.name}</div>
                  <div className="mt-1 text-sm text-ink/55">{active.role}</div>
                  <div className="mt-3 text-[11px] tracking-wide text-ink/40">{active.purchased}</div>
                </div>

                {/* Property connection */}
                <div className="mt-10 flex max-w-sm items-center gap-4 border-t border-ink/10 pt-6">
                  <img
                    src={active.property.img}
                    alt={active.property.name}
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-ink/40">Property</div>
                    <div className="mt-1 truncate text-sm font-medium tracking-tight">{active.property.name}</div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-ink/45">
                      {active.property.place}
                    </div>
                  </div>
                  <div className="ml-auto whitespace-nowrap text-sm font-medium text-gold">{active.property.price}</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-12 flex items-center gap-8">
              <span className="text-xs tabular-nums tracking-[0.18em] text-ink/45">
                {String(index + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}
              </span>
              <div className="relative h-px w-28 bg-ink/15">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-gold"
                  animate={{ width: `${((index + 1) / stories.length) * 100}%` }}
                  transition={{ duration: 0.6, ease }}
                />
              </div>
              <div className="ml-auto flex items-center gap-6 text-[13px]">
                <button onClick={() => go(-1)} className="text-ink/50 transition-colors hover:text-ink">
                  ← Previous
                </button>
                <button onClick={() => go(1)} className="text-ink transition-opacity hover:opacity-60">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting stories as selectors */}
        <div className="mt-20 lg:mt-28">
          {stories.map((s, i) =>
            i === index ? null : (
              <motion.button
                key={s.name}
                {...reveal(0.06 * i)}
                onClick={() => setIndex(i)}
                className="group flex w-full items-center gap-5 border-t border-ink/10 py-6 text-left transition-all duration-500 hover:bg-ink/[0.025] hover:pl-3 md:gap-8"
              >
                <img
                  src={s.portrait}
                  alt={s.name}
                  loading="lazy"
                  className="h-12 w-12 shrink-0 rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="w-full min-w-0 md:flex md:items-center md:gap-8">
                  <div className="md:w-56 md:shrink-0">
                    <div className="text-sm font-medium tracking-tight">{s.name}</div>
                    <div className="mt-0.5 text-xs text-ink/50">{s.role}</div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-ink/40">{s.location}</div>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60 md:mt-0">“{s.quote}”</p>
                </div>
                <span className="ml-auto shrink-0 text-ink/40 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-ink">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            ),
          )}
          <div className="border-t border-ink/10" />
        </div>
      </div>
    </section>
  );
}

/* -------------------- Neighborhoods -------------------- */

function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ y }}
        className="absolute inset-x-0 -top-[6%] h-[112%] w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}

function ExploreLink({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] ${className}`}>
      Explore area
      <svg className="h-3 w-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
    </span>
  );
}

function Neighborhoods() {
  const featuredStats = [
    { k: "Average home", v: "$3.2M" },
    { k: "Lifestyle", v: "4.8 / 5" },
    { k: "City access", v: "20 min" },
  ];
  const secondary = [
    { name: "Costa Serena", lifestyle: "Beachfront · slow · warm", meta: "From €1.8M · 12 min to airport", img: area3 },
    { name: "Old Town Ferrara", lifestyle: "Historic · walkable · romantic", meta: "From €920K · Historic district", img: area2 },
  ];

  return (
    <section id="neighborhoods" className="bg-white py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Eyebrow>Areas Collection</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight">
              The neighborhoods,<br /><span className="font-serif-display text-gold">not just the buildings.</span>
            </h2>
          </div>
          <p className="max-w-md self-end text-ink/60 md:justify-self-end md:text-right">
            Every home has a setting. Explore the places our buyers choose for the lifestyle as much as the address.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          {/* Featured */}
          <motion.a
            href="#neighborhoods"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-ink md:aspect-[16/11] lg:aspect-auto lg:min-h-[620px]"
          >
            <ParallaxImage src={area1} alt="Bel Air Heights" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground transition-transform duration-500 ease-out group-hover:-translate-y-1.5 lg:p-10">
              <h3 className="font-display text-3xl font-medium tracking-tight lg:text-[2.6rem]">Bel Air Heights</h3>
              <p className="mt-2 text-sm text-primary-foreground/60">Quiet · gated · leafy</p>

              <div className="mt-7 grid grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-5 opacity-70 transition-all duration-500 ease-out group-hover:opacity-100 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                {featuredStats.map((s) => (
                  <div key={s.k}>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/50">{s.k}</div>
                    <div className="mt-1.5 font-display text-lg tracking-tight">{s.v}</div>
                  </div>
                ))}
              </div>

              <ExploreLink className="mt-7 text-gold opacity-80 transition-opacity duration-500 ease-out group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100" />
            </div>
          </motion.a>

          {/* Secondary column */}
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {secondary.map((a, i) => (
              <motion.a
                key={a.name}
                href="#neighborhoods"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease, delay: 0.08 * (i + 1) }}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink lg:aspect-auto lg:min-h-[294px]"
              >
                <ParallaxImage src={a.img} alt={a.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground transition-transform duration-500 ease-out group-hover:-translate-y-1.5 lg:p-7">
                  <h3 className="font-display text-2xl font-medium tracking-tight">{a.name}</h3>
                  <p className="mt-1.5 text-sm text-primary-foreground/60">{a.lifestyle}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-primary-foreground/15 pt-4">
                    <span className="text-[11px] tracking-wide text-primary-foreground/60">{a.meta}</span>
                    <ExploreLink className="text-gold opacity-80 transition-opacity duration-500 ease-out group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Link
            to="/properties"
            search={{ location: undefined, type: undefined, beds: undefined, min: undefined, max: undefined }}
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
          >
            View all areas
            <svg className="h-3 w-3 transition-transform duration-500 ease-out group-hover:translate-x-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}


/* -------------------- Agents -------------------- */

function Agents() {
  const agents = [
    { name: "Amelia Hart", role: "Founding Partner", years: "14 yrs", sold: "$220M+", img: agent1 },
    { name: "Marcus Beaumont", role: "Principal Broker", years: "22 yrs", sold: "$480M+", img: agent2 },
    { name: "Sofia Villareal", role: "Head of Sales", years: "9 yrs", sold: "$140M+", img: agent3 },
  ];
  return (
    <section id="agents" className="bg-canvas py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <Eyebrow>The people</Eyebrow>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight">
            Real agents. Real numbers. <span className="font-serif-display text-gold">Real relationships.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {agents.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/5">
                <img src={a.img} alt={a.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between rounded-xl bg-canvas/95 p-4 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-ink/50">Experience</div>
                    <div className="text-sm">{a.years} · {a.sold}</div>
                  </div>
                  <button className="rounded-full bg-ink px-3 py-1.5 text-[11px] text-primary-foreground">Contact</button>
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight">{a.name}</h3>
                  <p className="text-sm text-ink/50">{a.role}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-ink/40 transition-all group-hover:translate-x-1 group-hover:text-gold" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Process -------------------- */

function Process() {
  const steps = [
    { n: "01", title: "Discovery call", body: "A 15-minute conversation. We learn who you are, what you love, and what actually matters." },
    { n: "02", title: "Curated shortlist", body: "You receive a handpicked collection of five to seven homes. No noise, no listings you'd never buy." },
    { n: "03", title: "Private viewings", body: "Book in one tap. We meet you on-site, walk you through, and answer everything." },
    { n: "04", title: "Offer & close", body: "Legal, financing, negotiation — handled end to end. You just move in." },
  ];
  return (
    <section id="process" className="bg-white py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Eyebrow>The Homeloop process</Eyebrow>
            <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight">
              Four steps.<br /> <span className="font-serif-display text-gold">Zero friction.</span>
            </h2>
          </div>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/10 md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease }}
              className="h-full origin-left bg-gold"
            />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-canvas font-serif-display text-lg text-ink transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                  {s.n}
                </div>
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 max-w-xs text-sm text-ink/60">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- CTA -------------------- */

function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const { openBooking } = useBooking();
  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-primary-foreground">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={ctaBg} alt="Desert villa at sunset" loading="lazy" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
      </motion.div>
      <div className="relative mx-auto max-w-[1400px] px-6 py-32 lg:px-10 lg:py-48">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="max-w-4xl"
        >
          <Eyebrow className="text-primary-foreground/60">Ready when you are</Eyebrow>
          <h2 className="mt-8 text-[clamp(2.4rem,6.5vw,5.5rem)] font-medium leading-[1] tracking-[-0.03em]">
            Book a viewing.<br /><span className="font-serif-display text-gold">Meet the home.</span>
          </h2>
          <p className="mt-8 max-w-lg text-primary-foreground/70">
            No forms. No spam. A single reply from a real agent within ten minutes — including nights and weekends.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button onClick={() => openBooking()} className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-500 hover:pl-7 hover:pr-8">
              <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">Book your viewing</span>
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight />
              </span>
            </button>
            <a className="text-sm text-primary-foreground/70 underline-offset-4 hover:text-primary-foreground hover:underline" href="tel:+1">Or call · +1 (310) 555 0187</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- Footer -------------------- */

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

      {/* Oversized wordmark */}
      <div className="overflow-hidden">
        <div className="pointer-events-none select-none whitespace-nowrap px-2 pb-6 text-center font-display font-medium leading-none tracking-tighter text-ink/[0.08]" style={{ fontSize: "clamp(4rem, 20vw, 20rem)" }}>
          Homeloop.
        </div>
      </div>
    </footer>
  );
}

/* -------------------- Page -------------------- */

function Index() {
  return (
    <main className="bg-canvas text-ink">
      <Hero />
      <LogoStrip />
      <FeaturedProperties />
      <WhyUs />
      <Testimonials />
      <Neighborhoods />
      <Agents />
      <Process />
      <CTA />
      <Footer />
    </main>
  );
}
