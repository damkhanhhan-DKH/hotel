"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import type { EnrichedRoom } from "@/lib/roomMedia";

type BookingDraftContextValue = {
  setRoomDraft: (room: EnrichedRoom | null) => void;
  consumeRoomDraft: () => EnrichedRoom | null;
};

const BookingDraftContext = createContext<BookingDraftContextValue | null>(null);

export function BookingDraftProvider({ children }: { children: React.ReactNode }) {
  const draftRef = useRef<EnrichedRoom | null>(null);

  const setRoomDraft = useCallback((room: EnrichedRoom | null) => {
    draftRef.current = room;
  }, []);

  const consumeRoomDraft = useCallback(() => {
    const r = draftRef.current;
    draftRef.current = null;
    return r;
  }, []);

  const value = useMemo(() => ({ setRoomDraft, consumeRoomDraft }), [setRoomDraft, consumeRoomDraft]);

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft() {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error("useBookingDraft must be used inside BookingDraftProvider");
  return ctx;
}
