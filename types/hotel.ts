export type RoomStatus = "occupied" | "available" | "dirty" | "maintenance";

export type Room = {
  id: string;
  type: string;
  status: RoomStatus;
  guest: string;
  price: string;
};

export type BookingStatus = "Đã xác nhận" | "Đã check-in" | "Chờ xử lý";

export type Booking = {
  id: string;
  guest: string;
  phone: string;
  roomType: string;
  checkin: string;
  checkout: string;
  status: BookingStatus;
  createdAt: string;
};

export type Review = {
  id: string;
  guestName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type UserRole = "staff" | "customer";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type HotelStore = {
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  users: User[];
  /** Đánh dấu đã gộp đủ catalog phòng mẫu (migrate một lần). */
  _meta?: {
    seedCatalogExpanded?: boolean;
  };
};
