import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { formatPrice, properties, type Property } from "@/lib/properties";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = {
  open: boolean;
  property: Property | null;
  onClose: () => void;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
};

type Status = "idle" | "loading" | "success";
type Errors = Partial<Record<"name" | "email" | "date", string>>;

const TIMES = ["Morning", "Afternoon", "Evening"] as const;
const GUESTS = ["1 guest", "2 guests", "3 guests", "4+ guests"] as const;

export function BookViewingModal({ open, property, onClose, triggerRef }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(property);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) setSelectedProperty(property); }, [open, property]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 120);
    return () => { document.body.style.overflow = prev; clearTimeout(t); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, status]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => triggerRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    if (status === "loading") return;
    setStatus("idle");
    setErrors({});
    onClose();
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.trim()) e.email = "Please enter a valid email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (!date) e.date = "Please select a preferred date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (status === "loading") return;
    if (!validate()) return;
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1200);
  }

  function handleDone() {
    setStatus("idle"); setErrors({});
    setName(""); setEmail(""); setPhone(""); setDate(""); setTime(""); setGuests(""); setMessage("");
    onClose();
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog" aria-modal="true" aria-label="Book a viewing"
        >
          <div onClick={handleClose} className="absolute inset-0 bg-ink/60 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="relative z-10 flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[24px] border border-ink/10 bg-canvas shadow-2xl sm:max-h-[88svh] sm:w-[760px] sm:rounded-[24px]"
          >
            <button
              ref={closeBtnRef}
              onClick={handleClose} aria-label="Close"
              className="absolute right-5 top-5 z-20 grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-canvas/80 text-ink backdrop-blur transition-all duration-300 hover:rotate-90 hover:bg-ink hover:text-primary-foreground"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>

            <div className="overflow-y-auto px-6 pb-8 pt-8 sm:px-10 sm:pt-10">
              {status === "success" ? (
                <SuccessState property={selectedProperty} date={date} time={time || "—"} onDone={handleDone} />
              ) : (
                <>
                  <div className="text-eyebrow">Private Viewing</div>
                  <h2 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">Book a viewing</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">
                    Tell us a little about yourself and when you'd like to experience this property in person.
                  </p>

                  {selectedProperty ? (
                    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/60 p-3">
                      <img src={selectedProperty.images[0]} alt={selectedProperty.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <div className="truncate font-display text-base font-medium">{selectedProperty.title}</div>
                        <div className="truncate text-xs text-ink/50">{selectedProperty.location}</div>
                        <div className="mt-0.5 font-display text-sm text-gold">{formatPrice(selectedProperty.price)}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <div className="font-display text-lg font-medium text-ink/80">Looking for your next home?</div>
                      <div className="relative mt-3">
                        <select
                          value=""
                          onChange={(e) => setSelectedProperty(properties.find((x) => x.id === e.target.value) ?? null)}
                          className="w-full appearance-none rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                          aria-label="Select a property"
                        >
                          <option value="">Select a property</option>
                          {properties.map((p) => (<option key={p.id} value={p.id}>{p.title} — {p.location}</option>))}
                        </select>
                        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M4 6l4 4 4-4" /></svg>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="Full Name" error={errors.name}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputCls(!!errors.name)} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls(!!errors.email)} />
                      </Field>
                      <Field label="Phone">
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 000 000 0000" className={inputCls(false)} />
                      </Field>
                      <Field label="Preferred Date" error={errors.date}>
                        <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)} className={inputCls(!!errors.date)} />
                      </Field>
                      <Field label="Preferred Time">
                        <Select value={time} onChange={setTime} options={[...TIMES]} placeholder="Select time" />
                      </Field>
                      <Field label="Number of Guests">
                        <Select value={guests} onChange={setGuests} options={[...GUESTS]} placeholder="Select guests" />
                      </Field>
                    </div>

                    <Field label="Message (optional)">
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything you'd like us to know?" rows={3} className={`${inputCls(false)} resize-none`} />
                    </Field>

                    <button
                      type="submit" disabled={status === "loading"}
                      className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-500 hover:pl-7 hover:pr-8 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                    >
                      <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                      <span className="relative">{status === "loading" ? "Sending..." : "Request a Viewing"}</span>
                      {status !== "loading" && (
                        <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform duration-500 group-hover:translate-x-1">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                        </span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder-ink/40 ${
    hasError ? "border-red-400 focus:border-red-500" : "border-ink/15 focus:border-gold"
  }`;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-ink/50">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls(false)} appearance-none pr-10 ${value ? "" : "text-ink/40"}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => (<option key={o} value={o}>{o}</option>))}
      </select>
      <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" fill="none"><path d="M4 6l4 4 4-4" /></svg>
    </div>
  );
}

function SuccessState({ property, date, time, onDone }: { property: Property | null; date: string; time: string; onDone: () => void }) {
  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "—";
  return (
    <div className="flex flex-col items-center py-8 text-center sm:py-12">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease, delay: 0.1 }} className="grid h-16 w-16 place-items-center rounded-full bg-gold/15">
        <motion.svg initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease, delay: 0.3 }} className="h-8 w-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>
      <h2 className="mt-6 font-display text-2xl font-medium tracking-tight sm:text-3xl">Viewing request received.</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/60">
        Thank you. One of our property specialists will be in touch shortly to confirm your viewing.
      </p>
      <div className="mt-8 w-full max-w-sm space-y-3 rounded-2xl border border-ink/10 bg-white/60 p-5 text-left">
        <SummaryRow label="Property" value={property ? property.title : "—"} />
        <SummaryRow label="Preferred date" value={formattedDate} />
        <SummaryRow label="Preferred time" value={time} />
      </div>
      <button onClick={onDone} className="mt-8 rounded-full bg-ink px-8 py-3 text-sm font-medium text-primary-foreground transition-all duration-500 hover:bg-gold hover:text-ink">Done</button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink/50">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
