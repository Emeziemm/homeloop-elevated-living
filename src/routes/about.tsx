import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import aboutHero from "@/assets/about-hero.jpg";
import aboutStory from "@/assets/about-story.jpg";
import aboutDetail from "@/assets/about-detail.jpg";
import aboutMap from "@/assets/about-map.jpg";
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

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Homeloop — Luxury real estate, curated with intention" },
      { name: "description", content: "Homeloop curates exceptional homes with craftsmanship, discretion and beautiful storytelling — meet the studio behind the properties." },
      { property: "og:title", content: "About Homeloop — Luxury real estate, curated with intention" },
      { property: "og:description", content: "Homeloop curates exceptional homes with craftsmanship, discretion and beautiful storytelling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------- Primitives -------------------- */

function Reveal({ children, delay = 0, y = 24, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children,
  variant = "solid",
  to,
}: {
  children: ReactNode;
  variant?: "solid" | "ghost" | "outline";
  to?: "/properties" | "/details";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls =
    variant === "solid"
      ? "bg-ink text-primary-foreground border-ink hover:bg-ink/90"
      : variant === "outline"
        ? "border-ink/20 text-ink hover:bg-ink hover:text-primary-foreground hover:border-ink"
        : "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink";

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-flex items-center gap-3 rounded-full border px-6 py-3 text-[13px] font-medium transition-colors duration-500 ${cls}`}
    >
      {children}
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </motion.div>
  );

  return to ? <Link to={to}>{inner}</Link> : <button type="button">{inner}</button>;
}

/* -------------------- Hero -------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-ink">
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        <img
          src={aboutHero}
          alt="Luxury architectural home glowing in warm evening light"
          width={1920}
          height={1200}
          className="h-[112%] w-full object-cover animate-hl-zoom"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/25" />

      <motion.div style={{ opacity: fade }} className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10 lg:pb-28">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}>
            <div className="text-eyebrow !text-primary-foreground/60">About Homeloop</div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-4xl font-display text-primary-foreground"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.25rem)", lineHeight: 1.02 }}
          >
            Luxury real estate, <span className="font-serif-display text-gold">curated with intention</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE }}
            className="mt-8 max-w-xl text-primary-foreground/70"
          >
            We believe exceptional homes deserve exceptional presentation. Every property we represent is carefully
            selected, beautifully showcased and thoughtfully matched with the right buyer.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton to="/properties">Explore properties</MagneticButton>
            <MagneticButton variant="ghost" to="/details">Book a viewing</MagneticButton>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* -------------------- Our Story -------------------- */

function Story() {
  return (
    <section className="bg-canvas py-32 lg:py-44">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-24 lg:px-10">
        <div className="lg:col-span-5">
          <Reveal>
            <div className="text-eyebrow">Our story</div>
            <h2 className="mt-6 font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.5rem)" }}>
              Designed around <span className="font-serif-display">extraordinary living</span>
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-ink/70">
              Homeloop began with a simple conviction: a remarkable home is never sold by a list of features. It is
              understood slowly — in the way morning light crosses a stone floor, in the proportion of a doorway, in the
              quiet a garden keeps. So we spend our time where others rush. We walk each residence before we represent
              it, photograph it in the hour it looks most itself, and write about it the way an architect would speak of
              their own work.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-ink/70">
              What follows is deliberately personal. Every enquiry is answered by someone who has stood in the rooms you
              are asking about. Viewings are private, unhurried and shaped around how you actually live. And long after
              the keys change hands, the relationship remains — because the people we work with rarely buy only once,
              and the homes we care for deserve to be passed on as carefully as they were found.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Principles -------------------- */

const principles = [
  {
    n: "01",
    title: "Curated Properties",
    copy: "Every home is selected for its design, quality and long-term value. We decline far more than we accept, and we say why.",
    img: aboutStory,
  },
  {
    n: "02",
    title: "Personal Service",
    copy: "Every client receives a tailored experience from first enquiry to final handover — one advisor, one conversation, start to finish.",
    img: aboutDetail,
  },
  {
    n: "03",
    title: "Timeless Design",
    copy: "Presentation matters. We believe beautiful homes deserve beautiful storytelling, photographed and written with restraint.",
    img: area2,
  },
];

function Principles() {
  return (
    <section className="bg-canvas pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="text-eyebrow">Our principles</div>
          <div className="mt-8 hairline" />
        </Reveal>

        <div className="mt-20 space-y-28 lg:space-y-40">
          {principles.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={p.title} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
                <Reveal className={`lg:col-span-6 ${flip ? "lg:order-2 lg:col-start-7" : ""}`}>
                  <div className="group overflow-hidden rounded-xl">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[5/4] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.12} className={`lg:col-span-5 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
                  <div className="font-display text-sm text-gold">{p.n}</div>
                  <h3 className="mt-5 font-display leading-[1.05]" style={{ fontSize: "clamp(1.9rem, 3.2vw, 3.1rem)" }}>
                    {p.title}
                  </h3>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">{p.copy}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Statistics -------------------- */

function Counter({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Properties sold", value: 350, suffix: "+" },
  { label: "Private viewings", value: 2800, suffix: "+" },
  { label: "Countries served", value: 18, suffix: "" },
  { label: "Client satisfaction", value: 99, suffix: "%" },
];

function Stats() {
  return (
    <section className="bg-ink py-28 text-primary-foreground lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-primary-foreground/15 pt-8">
                <div className="font-display leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)" }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-6 text-eyebrow !text-primary-foreground/50">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Team -------------------- */

const team = [
  { name: "Julien Moreau", role: "Founding Advisor", img: agent1, copy: "Guides waterfront and estate acquisitions along the Riviera with unusual patience." },
  { name: "Elena Rossi", role: "Head of Curation", img: agent2, copy: "Decides which homes we represent, and personally writes the story of each one." },
  { name: "Marcus Vale", role: "Private Client Director", img: agent3, copy: "Looks after international buyers from first conversation through to handover." },
];

function Team() {
  return (
    <section className="bg-canvas py-32 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="text-eyebrow">The people</div>
              <h2 className="mt-6 max-w-xl font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.5rem)" }}>
                A small studio of <span className="font-serif-display">specialists</span>
              </h2>
            </div>
            <MagneticButton variant="outline">Meet our team</MagneticButton>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.6, ease: EASE }} className="group">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={m.img}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                </div>
                <div className="mt-6">
                  <div className="font-display text-xl">{m.name}</div>
                  <div className="mt-1 text-eyebrow">{m.role}</div>
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">{m.copy}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Experience timeline -------------------- */

const steps = [
  { n: "01", title: "Discover", copy: "Browse carefully curated homes." },
  { n: "02", title: "Connect", copy: "Speak directly with an experienced advisor." },
  { n: "03", title: "Experience", copy: "Schedule a private viewing." },
  { n: "04", title: "Move in", copy: "Complete your purchase with confidence." },
];

function Experience() {
  return (
    <section className="bg-canvas pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="text-eyebrow">The experience</div>
          <h2 className="mt-6 max-w-2xl font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.5rem)" }}>
            What it's like <span className="font-serif-display">working with us</span>
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute left-0 top-[7px] hidden h-px w-full origin-left bg-ink/12 lg:block"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute left-[7px] top-0 h-full w-px origin-top bg-ink/12 lg:hidden"
          />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12} className="relative pl-10 lg:pl-0 lg:pt-0">
                <span className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border border-ink/20 bg-canvas lg:relative lg:left-auto lg:top-auto lg:block" />
                <span className="absolute left-[4px] top-[5px] h-[7px] w-[7px] rounded-full bg-gold lg:left-[4px] lg:top-[4px]" />
                <div className="lg:mt-8">
                  <div className="font-display text-sm text-gold">{s.n}</div>
                  <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Global presence -------------------- */

const places = ["French Riviera", "Monaco", "London", "Dubai", "New York", "Los Angeles"];

function Presence() {
  return (
    <section className="bg-canvas pb-32 lg:pb-44">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-24 lg:px-10">
        <Reveal className="lg:col-span-6">
          <div className="overflow-hidden rounded-xl bg-ink">
            <img
              src={aboutMap}
              alt="Engraved world map marking Homeloop destinations"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover opacity-95"
            />
          </div>
        </Reveal>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <div className="text-eyebrow">Global presence</div>
            <h2 className="mt-6 font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
              Serving <span className="font-serif-display">exceptional locations</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
              Homeloop represents premium properties across a small number of carefully selected destinations — places
              where architecture, light and privacy meet. We stay deliberately close to each market rather than covering
              everywhere at once.
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {places.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                className="rounded-full border border-ink/15 px-5 py-2 text-[13px] text-ink/70 transition-colors duration-500 hover:border-ink hover:text-ink"
              >
                {p}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- Editorial gallery -------------------- */

const gallery = [
  { src: property1, alt: "Architectural facade at dusk", span: "lg:col-span-5", ratio: "aspect-[4/5]" },
  { src: area1, alt: "Coastal neighbourhood", span: "lg:col-span-7 lg:mt-20", ratio: "aspect-[16/10]" },
  { src: aboutDetail, alt: "Brass hardware detail", span: "lg:col-span-7", ratio: "aspect-[16/10]" },
  { src: property2, alt: "Interior living space", span: "lg:col-span-5 lg:-mt-16", ratio: "aspect-[4/5]" },
  { src: area3, alt: "Hillside terrace", span: "lg:col-span-6", ratio: "aspect-[3/2]" },
  { src: property3, alt: "Poolside evening", span: "lg:col-span-6 lg:mt-14", ratio: "aspect-[3/2]" },
];

function Gallery() {
  return (
    <section className="bg-canvas pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="text-eyebrow">Selected frames</div>
          <h2 className="mt-6 max-w-2xl font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
            Architecture, interiors <span className="font-serif-display">and life between them</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {gallery.map((g, i) => (
            <Reveal key={g.alt} delay={(i % 2) * 0.1} className={`${g.span}`}>
              <div className="group relative overflow-hidden rounded-xl">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  decoding="async"
                  className={`${g.ratio} w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/30" />
                <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-eyebrow !text-primary-foreground/80">{g.alt}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Testimonials -------------------- */

const testimonials = [
  {
    name: "Amélie Fontaine",
    place: "Cap Ferrat",
    img: agent2,
    quote:
      "They understood the house before I did. Nothing was rushed, nothing was oversold — and the home we found is the one I would have chosen a hundred times over.",
  },
  {
    name: "David Whitmore",
    place: "London",
    img: agent1,
    quote:
      "Three viewings, all of them worth the flight. That kind of editing is rare, and it is the whole reason we bought through Homeloop.",
  },
  {
    name: "Sofia Marchetti",
    place: "Monaco",
    img: agent3,
    quote:
      "Every detail — the photography, the paperwork, the handover — felt considered. It was the calmest purchase I have ever made.",
  },
];

function Testimonials() {
  return (
    <section className="bg-canvas pb-32 lg:pb-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <div className="text-eyebrow">In their words</div>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12} y={40}>
              <figure className="flex h-full flex-col justify-between rounded-xl border border-ink/10 bg-card p-8 lg:p-10">
                <blockquote className="font-serif-display text-2xl leading-snug text-ink/85">“{t.quote}”</blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="mt-0.5 text-xs text-ink/50">{t.place}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Final CTA -------------------- */

function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={ctaBg} alt="" loading="lazy" decoding="async" className="h-[116%] w-full object-cover opacity-60" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
      <div className="relative mx-auto max-w-[1400px] px-6 py-40 text-primary-foreground lg:px-10 lg:py-56">
        <Reveal>
          <h2 className="max-w-3xl font-display leading-[1.03]" style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}>
            Let's find a home worth <span className="font-serif-display text-gold">falling in love with</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-lg text-primary-foreground/70">
            Start with a conversation or simply browse what we are representing today. Either way, you'll be looking at
            a very short list of very good homes.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <MagneticButton to="/properties">Explore properties</MagneticButton>
            <MagneticButton variant="ghost" to="/details">Book a viewing</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------- Page -------------------- */

function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <SiteNav overDark />
      <main>
        <Hero />
        <Story />
        <Principles />
        <Stats />
        <Team />
        <Experience />
        <Presence />
        <Gallery />
        <Testimonials />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}