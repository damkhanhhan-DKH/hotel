"use client";

import { useHotelContext } from "@/context/HotelContext";

export function useHotelData() {
  return useHotelContext();
}

export function useBookings() {
  const {
    bookings,
    createBooking,
    updateBooking,
    deleteBooking,
    loading,
  } = useHotelContext();
  return { bookings, createBooking, updateBooking, deleteBooking, loading };
}

export function useRooms() {
  const {
    rooms,
    createRoom,
    updateRoom,
    deleteRoom,
    loading,
  } = useHotelContext();
  return { rooms, createRoom, updateRoom, deleteRoom, loading };
}

export function useReviews() {
  const {
    reviews,
    createReview,
    updateReview,
    deleteReview,
    loading,
  } = useHotelContext();
  return { reviews, createReview, updateReview, deleteReview, loading };
}

export function useUsers() {
  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    loading,
  } = useHotelContext();
  return { users, createUser, updateUser, deleteUser, loading };
}
