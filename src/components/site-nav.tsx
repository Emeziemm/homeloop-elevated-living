import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/booking-context";

const links = [
  { label: "Properties", to: "/properties" as const },
  { label: "About", to: "/about" as const },
  { label: "Neighborhoods", to: "/" as const, hash: "neighborhoods" },
  { label: "Agents", to: "/" as const, hash: "agents" },
  { label: "Journal", to: "/" as const, hash: "process" },
];

export function SiteNav({ overDark = false }: { overDark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { openBooking } = useBooking();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = overDark && !scrolled;
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-canvas/70 border-b border-ink/5" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10 transition-all duration-500 ${scrolled ? "h-14" : "h-20"}`}>
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-display font-semibold tracking-tight transition-all duration-500 ${scrolled ? "text-lg" : "text-xl"} ${dark ? "text-primary-foreground" : "text-ink"}`}>
            Homeloop<span className="text-gold">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => {
            const isActive = pathname.startsWith(l.to) && l.to !== "/";
            return (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                className={`group relative text-[13px] font-medium transition-colors ${
                  dark ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-ink/70 hover:text-ink"
                } ${isActive ? (dark ? "!text-primary-foreground" : "!text-ink") : ""}`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <button className={`hidden text-[13px] font-medium md:inline ${dark ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-ink/70 hover:text-ink"}`}>Sign in</button>
          <button className={`rounded-full border text-[13px] font-medium transition-all duration-500 px-4 py-2 ${
            scrolled
              ? "bg-ink text-primary-foreground border-ink"
              : dark
                ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-ink"
                : "border-ink/20 text-ink hover:bg-ink hover:text-primary-foreground hover:border-ink"
          }`}>
            Book a viewing
          </button>
        </div>
      </div>
    </motion.header>
  );
}