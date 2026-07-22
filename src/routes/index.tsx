import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import heroVilla from "@/assets/hero-villa.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import area1 from "@/assets/area-1.jpg";
import area2 from "@/assets/area-2.jpg";
import area3 from "@/assets/area-3.jpg";
import agent1 from "@/assets/agent-1.jpg";
import agent2 from "@/assets/agent-2.jpg";
import agent3 from "@/assets/agent-3.jpg";
import ctaBg from "@/assets/cta-bg.jpg";

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

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-eyebrow flex items-center gap-2 ${className}`}>
      <span className="inline-block h-px w-6 bg-current opacity-40" />
      {children}
    </div>
  );
}

function GoldButton({ children, variant = "solid" }: { children: React.ReactNode; variant?: "solid" | "ghost" }) {
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
          <button className={`rounded-full border transition-all duration-500 text-[13px] font-medium ${
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

  const onMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 20);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  };

  return (
    <section ref={ref} onMouseMove={onMove} className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-primary-foreground">
      {/* Backdrop image */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={heroVilla}
          alt="Luxury cliffside villa at golden hour"
          className="h-full w-full object-cover animate-hl-zoom"
          width={1920}
          height={1200}
        />
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
          <div className="lg:col-span-8">
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
              <GoldButton>Book a viewing</GoldButton>
              <button className="group inline-flex items-center gap-3 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/25 transition-all group-hover:border-gold group-hover:bg-gold/10">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z" /></svg>
                </span>
                Watch the film
              </button>
            </motion.div>
          </div>

          {/* Floating card */}
          <motion.div style={{ x: sx, y: sy }} className="relative hidden lg:col-span-4 lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 1.1, ease, delay: 1.1 }}
              className="absolute right-0 top-6 w-[290px] animate-hl-float"
            >
              <FloatingPropertyCard
                image={property1}
                location="Beverly Hills"
                price="$3.8M"
                beds="4 Bed"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 1.1, ease, delay: 1.3 }}
              className="absolute right-20 top-72 w-[240px] animate-hl-float-slow"
            >
              <FloatingPropertyCard
                image={property3}
                location="Downtown LA"
                price="$2.1M"
                beds="2 Bed"
                compact
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Search module + stats */}
        <div className="mt-16 space-y-8">
          <SearchModule />
          <div className="grid grid-cols-2 gap-8 border-t border-primary-foreground/10 pt-8 md:grid-cols-4">
            <Stat value="98%" label="Properties sold" delay={1.4} />
            <Stat value="<10 min" label="Avg response" delay={1.5} />
            <Stat value="5,200+" label="Satisfied buyers" delay={1.6} />
            <Stat value="A+" label="Client rating" delay={1.7} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingPropertyCard({
  image,
  location,
  price,
  beds,
  compact = false,
}: {
  image: string;
  location: string;
  price: string;
  beds: string;
  compact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary-foreground/10 bg-canvas/95 p-2 shadow-2xl backdrop-blur-xl">
      <div className={`overflow-hidden rounded-xl ${compact ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
        <img src={image} alt={location} className="h-full w-full object-cover" loading="lazy" width={400} height={compact ? 300 : 500} />
      </div>
      <div className="p-3 text-ink">
        <div className="flex items-center gap-1.5 text-[11px] text-ink/60">
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="6" cy="5" r="2" /><path d="M6 1c2.2 0 4 1.8 4 4 0 3-4 6-4 6S2 8 2 5c0-2.2 1.8-4 4-4z" /></svg>
          {location}
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="font-display text-lg font-medium">{price}</div>
            <div className="text-[11px] text-ink/50">{beds}</div>
          </div>
          <button className="rounded-full bg-ink px-3 py-1.5 text-[10px] font-medium text-primary-foreground">Book viewing</button>
        </div>
      </div>
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

function SearchModule() {
  const fields = [
    { label: "Location", value: "Los Angeles, CA" },
    { label: "Property type", value: "Villa" },
    { label: "Budget", value: "$2M – $5M" },
    { label: "Bedrooms", value: "4+" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 1.1 }}
      className="relative rounded-2xl border border-primary-foreground/10 bg-canvas/95 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
    >
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink/5 md:grid-cols-5">
        {fields.map((f) => (
          <div key={f.label} className="group cursor-pointer bg-canvas p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white md:p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink/50">{f.label}</div>
            <div className="mt-1.5 text-sm font-medium text-ink">{f.value}</div>
          </div>
        ))}
        <button className="group flex items-center justify-center gap-2 bg-ink px-4 py-4 text-sm font-medium text-primary-foreground transition-all duration-500 hover:bg-gold hover:text-ink md:px-6">
          <span>Search</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
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
  const items = [
    { image: property2, title: "The Ridge Residence", price: "$6.4M", loc: "Malibu, CA", beds: "5 bed · 6 bath · 8,200 sqft", size: "large" as const },
    { image: property1, title: "Palm House", price: "$3.8M", loc: "Beverly Hills, CA", beds: "4 bed · 4 bath", size: "portrait" as const },
    { image: property3, title: "The Skyline Loft", price: "$2.1M", loc: "Downtown LA", beds: "2 bed · 2 bath", size: "portrait" as const },
  ];
  return (
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
          <PropertyCard {...items[0]} className="col-span-12 md:col-span-8" />
          <PropertyCard {...items[1]} className="col-span-12 md:col-span-4" />
          <PropertyCard {...items[2]} className="col-span-12 md:col-span-5" />
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
}: {
  image: string;
  title: string;
  price: string;
  loc: string;
  beds: string;
  size: "large" | "portrait";
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease }}
      className={`group relative overflow-hidden rounded-2xl bg-ink ${className}`}
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
              <button className="rounded-full bg-gold px-4 py-2 text-xs font-medium text-ink">Book viewing</button>
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
  const quotes = [
    { q: "Homeloop rewired how buyers interact with our listings. Enquiries tripled in eight weeks.", who: "Amelia Hart", role: "Director, Hart & Co.", img: agent1 },
    { q: "The template feels handcrafted for our brand. It hasn't looked like a template a single day.", who: "Marcus Beaumont", role: "Principal Broker, Beaumont", img: agent2 },
    { q: "Response times went from hours to minutes. That's the entire game in luxury real estate.", who: "Sofia Villareal", role: "Head of Sales, Casa Nova", img: agent3 },
    { q: "Our buyers now book viewings from the phone at 11pm. That never used to happen.", who: "Julian Reyes", role: "Founder, Reyes Estates", img: agent2 },
  ];
  return (
    <section className="bg-canvas py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>What agencies are saying</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.02] tracking-tight">
              Signed by studios who <span className="font-serif-display text-gold">sell for a living.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-6 px-6 lg:px-10">
          {quotes.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.05 }}
              className="w-[86vw] shrink-0 snap-start rounded-2xl border border-ink/10 bg-white p-8 md:w-[520px] lg:p-12"
            >
              <svg viewBox="0 0 32 32" className="h-8 w-8 text-gold" fill="currentColor"><path d="M4 20c0-6 4-10 10-10v4c-4 0-6 3-6 6h4v8H4v-8zm14 0c0-6 4-10 10-10v4c-4 0-6 3-6 6h4v8H18v-8z" /></svg>
              <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight text-ink lg:text-[26px]">
                "{t.q}"
              </p>
              <div className="mt-10 flex items-center gap-4">
                <img src={t.img} alt={t.who} className="h-11 w-11 rounded-full object-cover grayscale" loading="lazy" />
                <div>
                  <div className="text-sm font-medium">{t.who}</div>
                  <div className="text-xs text-ink/50">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Neighborhoods -------------------- */

function Neighborhoods() {
  const areas = [
    { name: "Bel Air Heights", price: "$4.2M avg", schools: "9/10", lifestyle: "Quiet · gated · leafy", count: 34, img: area1 },
    { name: "Costa Serena", price: "$3.6M avg", schools: "8/10", lifestyle: "Beachfront · slow · warm", count: 21, img: area3 },
    { name: "Old Town Ferrara", price: "$1.9M avg", schools: "8/10", lifestyle: "Historic · walkable · romantic", count: 12, img: area2 },
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
            A home is only as good as the street it sits on. Every collection includes schools, lifestyle notes and average pricing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {areas.map((a) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink"
            >
              <img src={a.img} alt={a.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground lg:p-8">
                <h3 className="font-display text-2xl font-medium tracking-tight lg:text-3xl">{a.name}</h3>
                <p className="mt-1 text-sm text-white/60">{a.lifestyle}</p>
                <div className="mt-6 max-h-0 overflow-hidden opacity-0 transition-all duration-700 group-hover:max-h-40 group-hover:opacity-100">
                  <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4 text-[11px]">
                    <div><div className="text-white/50 uppercase tracking-widest">Avg price</div><div className="mt-1 text-white">{a.price}</div></div>
                    <div><div className="text-white/50 uppercase tracking-widest">Schools</div><div className="mt-1 text-white">{a.schools}</div></div>
                    <div><div className="text-white/50 uppercase tracking-widest">Homes</div><div className="mt-1 text-white">{a.count}</div></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
            <GoldButton>Book your viewing</GoldButton>
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

// unused import guard
void AnimatePresence;
