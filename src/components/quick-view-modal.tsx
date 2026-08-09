import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { formatPrice, type Property } from "@lib/properties";
import { useBooking } from "@/components/booking-context";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  property: Property | null;
  onClose: () => void;
};

export function QuickViewModal({ property, onClose }: Props) {
  return (
    <AnimatePresence>
      {property && <QuickView p={property} onClose={onClose} />}
    </AnimatePresence>
  );
}

function QuickView({ p, onClose }: { p: Property; onClose: () => void }) {
  const [i, setI] = useState(0);
  const { openBooking } = useBooking();
  const bookRef = useRef<HTMLButtonElement>(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/70 backdrop-blur-md"
      />
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
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-0 h-full w-full object-cover"
              alt={p.title}
            />
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
            <div className="flex gap-1.5">
              {p.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-1 rounded-full transition-all ${
                    idx === i
                      ? "w-8 bg-primary-foreground"
                      : "w-4 bg-primary-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col p-8 md:p-10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-canvas/80 backdrop-blur hover:bg-ink hover:text-primary-foreground"
            aria-label="Close"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
          <div className="text-eyebrow">{p.status}</div>
          <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
            {p.title}
          </h3>
          <div className="mt-1 text-sm text-ink/60">{p.location}</div>
          <div className="mt-4 font-display text-2xl font-medium">
            {formatPrice(p.price)}
          </div>
          <p className="mt-5 line-clamp-4 text-sm leading-relaxed text-ink/70">
            {p.description}
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
            {[
              ["Beds", p.beds],
              ["Baths", p.baths],
              ["Area", `${p.area} sqm`],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="rounded-2xl border border-ink/10 p-3"
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-ink/50">
                  {k}
                </div>
                <div className="mt-1 font-medium">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.amenities.slice(0, 6).map((a) => (
              <span
                key={a}
                className="rounded-full border border-ink/10 px-3 py-1 text-xs text-ink/70"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <button
              ref={bookRef}
              onClick={() => { onClose(); openBooking(p, bookRef.current); }}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-gold hover:text-ink"
            >
              Book viewing
            </button>
            <Link
              to="/properties/$id"
              params={{ id: p.id }}
              onClick={onClose}
              className="rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-primary-foreground"
            >
              View details
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
