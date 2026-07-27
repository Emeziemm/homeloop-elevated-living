import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { formatPrice, type Property } from "@/lib/properties";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  p: Property;
  index?: number;
  onQuickView?: (p: Property) => void;
  className?: string;
};

export function PropertyCard({ p, index = 0, onQuickView, className = "" }: Props) {
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

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay: (index % 3) * 0.08 }}
      className={className}
    >
      <div
        onClick={() => onQuickView?.(p)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative flex aspect-[4/5] cursor-pointer flex-col overflow-hidden rounded-3xl bg-ink text-primary-foreground transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]"
        role="button"
        tabIndex={0}
        aria-label={`Preview ${p.title}`}
      >
        <div className="absolute inset-0">
          {p.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={p.title}
              loading="lazy"
              decoding="async"
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
            onClick={(e) => { stop(e); setSaved((s) => !s); }}
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
              <h3 className="mt-1 font-display text-xl font-medium tracking-tight">{p.title}</h3>
            </div>
            <div className="shrink-0 font-display text-xl font-medium tracking-tight transition-transform duration-500 group-hover:scale-[1.06]">
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
              {onQuickView && (
                <button
                  onClick={(e) => { stop(e); onQuickView(p); }}
                  className="rounded-full border border-primary-foreground/30 px-3 py-1.5 text-[11px] font-medium text-primary-foreground/90 transition-all hover:border-gold hover:text-gold"
                >
                  Quick view
                </button>
              )}
              <span className="rounded-full bg-gold px-3 py-1.5 text-[11px] font-medium text-ink transition-all group-hover:scale-105">
                Schedule viewing
              </span>
            </div>
          </div>
        </div>

        {/* Arrow cue */}
        <div className="pointer-events-none absolute right-6 top-20 z-10 grid h-10 w-10 place-items-center rounded-full bg-gold text-ink opacity-0 translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </div>
      </div>
    </motion.div>
  );
}
