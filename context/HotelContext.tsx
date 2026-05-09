"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HOTEL_STORE_CHANGED_EVENT, mockApi } from "@/lib/mockApi";
import type { Booking, BookingStatus, Review, Room, RoomStatus, User, UserRole } from "@/types/hotel";

type HotelContextValue = {
  loading: boolean;
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  users: User[];
  createRoom: (input: Omit<Room, "id">) => Promise<void>;
  updateRoom: (id: string, patch: Partial<Omit<Room, "id">>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  createBooking: (input: Omit<Booking, "id" | "createdAt">) => Promise<void>;
  updateBooking: (id: string, patch: Partial<Omit<Booking, "id" | "createdAt">>) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  createReview: (input: Omit<Review, "id" | "createdAt">) => Promise<void>;
  updateReview: (id: string, patch: Partial<Omit<Review, "id" | "createdAt">>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  createUser: (input: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, patch: Partial<Omit<User, "id">>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
};

const HotelContext = createContext<HotelContextValue | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    const store = await mockApi.getStore();
    setRooms(store.rooms);
    setBookings(store.bookings);
    setReviews(store.reviews);
    setUsers(store.users);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    mockApi.getStore().then((store) => {
      if (!active) return;
      setRooms(store.rooms);
      setBookings(store.bookings);
      setReviews(store.reviews);
      setUsers(store.users);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onStoreChanged = () => {
      void mockApi.getStore().then((store) => {
        setRooms(store.rooms);
        setBookings(store.bookings);
        setReviews(store.reviews);
        setUsers(store.users);
      });
    };
    window.addEventListener(HOTEL_STORE_CHANGED_EVENT, onStoreChanged);
    return () => window.removeEventListener(HOTEL_STORE_CHANGED_EVENT, onStoreChanged);
  }, []);

  const createRoom = useCallback(async (input: Omit<Room, "id">) => {
    await mockApi.createRoom(input);
    await reload();
  }, [reload]);
  const updateRoom = useCallback(async (id: string, patch: Partial<Omit<Room, "id">>) => {
    await mockApi.updateRoom(id, patch);
    await reload();
  }, [reload]);
  const deleteRoom = useCallback(async (id: string) => {
    await mockApi.deleteRoom(id);
    await reload();
  }, [reload]);

  const createBooking = useCallback(async (input: Omit<Booking, "id" | "createdAt">) => {
    await mockApi.createBooking(input);
    await reload();
  }, [reload]);
  const updateBooking = useCallback(async (id: string, patch: Partial<Omit<Booking, "id" | "createdAt">>) => {
    await mockApi.updateBooking(id, patch);
    await reload();
  }, [reload]);
  const deleteBooking = useCallback(async (id: string) => {
    await mockApi.deleteBooking(id);
    await reload();
  }, [reload]);

  const createReview = useCallback(async (input: Omit<Review, "id" | "createdAt">) => {
    await mockApi.createReview(input);
    await reload();
  }, [reload]);
  const updateReview = useCallback(async (id: string, patch: Partial<Omit<Review, "id" | "createdAt">>) => {
    await mockApi.updateReview(id, patch);
    await reload();
  }, [reload]);
  const deleteReview = useCallback(async (id: string) => {
    await mockApi.deleteReview(id);
    await reload();
  }, [reload]);

  const createUser = useCallback(async (input: Omit<User, "id">) => {
    await mockApi.createUser(input);
    await reload();
  }, [reload]);
  const updateUser = useCallback(async (id: string, patch: Partial<Omit<User, "id">>) => {
    await mockApi.updateUser(id, patch);
    await reload();
  }, [reload]);
  const deleteUser = useCallback(async (id: string) => {
    await mockApi.deleteUser(id);
    await reload();
  }, [reload]);

  const value = useMemo<HotelContextValue>(
    () => ({
      loading,
      rooms,
      bookings,
      reviews,
      users,
      createRoom,
      updateRoom,
      deleteRoom,
      createBooking,
      updateBooking,
      deleteBooking,
      createReview,
      updateReview,
      deleteReview,
      createUser,
      updateUser,
      deleteUser,
    }),
    [
      loading, rooms, bookings, reviews, users,
      createRoom, updateRoom, deleteRoom,
      createBooking, updateBooking, deleteBooking,
      createReview, updateReview, deleteReview,
      createUser, updateUser, deleteUser,
    ],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotelContext() {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error("useHotelContext must be used inside HotelProvider");
  return ctx;
}

export type { BookingStatus, RoomStatus, UserRole };
