import type { Booking, HotelStore, Review, Room, User } from "@/types/hotel";
import { SEED_ROOMS } from "@/lib/seedRooms";

export const HOTEL_STORAGE_KEY = "hotelMockApiStoreV1";
export const HOTEL_STORE_CHANGED_EVENT = "hotel-store-changed";

const seedStore: HotelStore = {
  rooms: [...SEED_ROOMS],
  bookings: [],
  reviews: [],
  users: [
    { id: "u-admin", name: "Admin Hotel", email: "admin@hotel.vn", password: "123456", role: "staff" },
  ],
  _meta: { seedCatalogExpanded: true },
};

const hasWindow = () => typeof window !== "undefined";

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sắp xếp: phòng catalog theo thứ tự SEED_ROOMS, sau đó phòng do người dùng tạo — không khôi phục phòng đã xóa. */
function normalizeRoomList(rooms: Room[]): Room[] {
  const seedIdSet = new Set(SEED_ROOMS.map((s) => s.id));
  const extras = rooms.filter((r) => !seedIdSet.has(r.id));
  const orderedSeeds = SEED_ROOMS.map((s) => rooms.find((r) => r.id === s.id)).filter((r): r is Room => r !== undefined);
  return [...orderedSeeds, ...extras];
}

/** Một lần: bổ sung các phòng catalog còn thiếu (store cũ chỉ có vài phòng mẫu). */
function expandMissingSeedRoomsOnce(store: HotelStore): HotelStore {
  if (store._meta?.seedCatalogExpanded) return store;
  const ids = new Set(store.rooms.map((r) => r.id));
  const missing = SEED_ROOMS.filter((s) => !ids.has(s.id));
  return {
    ...store,
    rooms: missing.length > 0 ? [...store.rooms, ...missing] : store.rooms,
    _meta: { ...store._meta, seedCatalogExpanded: true },
  };
}

function migrateLegacy(store: HotelStore): HotelStore {
  if (!hasWindow()) return store;
  let next: HotelStore = { ...store, rooms: [...store.rooms], bookings: [...store.bookings], reviews: [...store.reviews], users: [...store.users] };

  const legacyBookings = window.localStorage.getItem("hotelBookings");
  if (legacyBookings) {
    try {
      const arr = JSON.parse(legacyBookings) as unknown;
      if (Array.isArray(arr)) {
        const normalized: Booking[] = arr.map((b: Record<string, unknown>) => {
          const st = b.status;
          const status: Booking["status"] =
            st === "Đã xác nhận" || st === "Đã check-in" || st === "Chờ xử lý" ? st : "Chờ xử lý";
          return {
            id: String(b.id ?? `bk-${Date.now()}-${Math.random().toString(16).slice(2)}`),
            guest: String(b.guest ?? ""),
            phone: String(b.phone ?? ""),
            roomType: String(b.roomType ?? ""),
            checkin: String(b.checkin ?? ""),
            checkout: String(b.checkout ?? ""),
            status,
            createdAt: String(b.createdAt ?? new Date().toISOString()),
          };
        });
        next.bookings = [...normalized, ...next.bookings];
      }
    } catch {
      /* ignore */
    }
    window.localStorage.removeItem("hotelBookings");
  }

  const legacyReviews = window.localStorage.getItem("hotelReviews");
  if (legacyReviews) {
    try {
      const arr = JSON.parse(legacyReviews) as unknown;
      if (Array.isArray(arr)) {
        const normalized: Review[] = arr.map((r: Record<string, unknown>) => ({
          id: String(r.id ?? `rv-${Date.now()}-${Math.random().toString(16).slice(2)}`),
          guestName: String(r.guestName ?? ""),
          rating: Number(r.rating ?? 5),
          comment: String(r.comment ?? ""),
          createdAt: String(r.createdAt ?? new Date().toISOString()),
        }));
        next.reviews = [...normalized, ...next.reviews];
      }
    } catch {
      /* ignore */
    }
    window.localStorage.removeItem("hotelReviews");
  }

  return next;
}

function readStore(): HotelStore {
  if (!hasWindow()) return seedStore;
  const raw = window.localStorage.getItem(HOTEL_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(seedStore));
    return seedStore;
  }
  try {
    let store = JSON.parse(raw) as HotelStore;
    store = migrateLegacy(store);
    store = expandMissingSeedRoomsOnce(store);
    store.rooms = normalizeRoomList(store.rooms);
    const serialized = JSON.stringify(store);
    if (serialized !== raw) {
      window.localStorage.setItem(HOTEL_STORAGE_KEY, serialized);
    }
    return store;
  } catch {
    window.localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(seedStore));
    return seedStore;
  }
}

function writeStore(next: HotelStore) {
  if (!hasWindow()) return;
  window.localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(HOTEL_STORE_CHANGED_EVENT));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const mockApi = {
  async getStore() {
    await wait();
    return readStore();
  },

  async getRooms() {
    await wait();
    return readStore().rooms;
  },
  async createRoom(input: Omit<Room, "id">) {
    await wait();
    const store = readStore();
    const room: Room = { ...input, id: makeId("room") };
    store.rooms.unshift(room);
    writeStore(store);
    return room;
  },
  async updateRoom(id: string, patch: Partial<Omit<Room, "id">>) {
    await wait();
    const store = readStore();
    store.rooms = store.rooms.map((item) => (item.id === id ? { ...item, ...patch } : item));
    writeStore(store);
    return store.rooms.find((item) => item.id === id) ?? null;
  },
  async deleteRoom(id: string) {
    await wait();
    const store = readStore();
    store.rooms = store.rooms.filter((item) => item.id !== id);
    writeStore(store);
    return true;
  },

  async getBookings() {
    await wait();
    return readStore().bookings;
  },
  async createBooking(input: Omit<Booking, "id" | "createdAt">) {
    await wait();
    const store = readStore();
    const booking: Booking = {
      ...input,
      id: makeId("booking"),
      createdAt: new Date().toISOString(),
    };
    store.bookings.unshift(booking);
    writeStore(store);
    return booking;
  },
  async updateBooking(id: string, patch: Partial<Omit<Booking, "id" | "createdAt">>) {
    await wait();
    const store = readStore();
    store.bookings = store.bookings.map((item) => (item.id === id ? { ...item, ...patch } : item));
    writeStore(store);
    return store.bookings.find((item) => item.id === id) ?? null;
  },
  async deleteBooking(id: string) {
    await wait();
    const store = readStore();
    store.bookings = store.bookings.filter((item) => item.id !== id);
    writeStore(store);
    return true;
  },

  async getReviews() {
    await wait();
    return readStore().reviews;
  },
  async createReview(input: Omit<Review, "id" | "createdAt">) {
    await wait();
    const store = readStore();
    const review: Review = { ...input, id: makeId("review"), createdAt: new Date().toISOString() };
    store.reviews.unshift(review);
    writeStore(store);
    return review;
  },
  async updateReview(id: string, patch: Partial<Omit<Review, "id" | "createdAt">>) {
    await wait();
    const store = readStore();
    store.reviews = store.reviews.map((item) => (item.id === id ? { ...item, ...patch } : item));
    writeStore(store);
    return store.reviews.find((item) => item.id === id) ?? null;
  },
  async deleteReview(id: string) {
    await wait();
    const store = readStore();
    store.reviews = store.reviews.filter((item) => item.id !== id);
    writeStore(store);
    return true;
  },

  async getUsers() {
    await wait();
    return readStore().users;
  },
  async createUser(input: Omit<User, "id">) {
    await wait();
    const store = readStore();
    const user: User = { ...input, id: makeId("user") };
    store.users.push(user);
    writeStore(store);
    return user;
  },
  async updateUser(id: string, patch: Partial<Omit<User, "id">>) {
    await wait();
    const store = readStore();
    store.users = store.users.map((item) => (item.id === id ? { ...item, ...patch } : item));
    writeStore(store);
    return store.users.find((item) => item.id === id) ?? null;
  },
  async deleteUser(id: string) {
    await wait();
    const store = readStore();
    store.users = store.users.filter((item) => item.id !== id);
    writeStore(store);
    return true;
  },
};
