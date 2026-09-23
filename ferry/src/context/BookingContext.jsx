import { createContext, useContext, useState, useCallback } from "react";

// Holds the in-progress booking as the user moves through
// trip -> seat selection -> checkout -> payment -> success.
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(null);

  const startBooking = useCallback((trip) => {
    setDraft({ trip, seat: null, passenger: null, payment: null });
  }, []);

  const setSeat = useCallback((seat) => {
    setDraft((prev) => (prev ? { ...prev, seat } : prev));
  }, []);

  const setPassenger = useCallback((passenger) => {
    setDraft((prev) => (prev ? { ...prev, passenger } : prev));
  }, []);

  const setPayment = useCallback((payment) => {
    setDraft((prev) => (prev ? { ...prev, payment } : prev));
  }, []);

  const clearBooking = useCallback(() => setDraft(null), []);

  return (
    <BookingContext.Provider value={{ draft, startBooking, setSeat, setPassenger, setPayment, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
