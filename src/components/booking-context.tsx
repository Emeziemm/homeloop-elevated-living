import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { BookViewingModal } from "@/components/book-viewing-modal";
import type { Property } from "@/lib/properties";

type BookingContextValue = {
  openBooking: (property?: Property | null, trigger?: HTMLElement | null) => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openBooking = useCallback((prop?: Property | null, trigger?: HTMLElement | null) => {
    if (trigger) triggerRef.current = trigger;
    setProperty(prop ?? null);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setOpen(false);
    setProperty(null);
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      <BookViewingModal
        open={open}
        property={property}
        onClose={closeBooking}
        triggerRef={triggerRef}
      />
    </BookingContext.Provider>
  );
}
