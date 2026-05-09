import type { Room } from "@/types/hotel";

/** Danh sách phòng mẫu đồng bộ giữa mock API và UI. */
export const SEED_ROOMS: Room[] = [
  { id: "101", type: "Suite Ocean View", status: "occupied", guest: "Nguyễn Văn Nam", price: "5.900.000đ / đêm" },
  { id: "102", type: "Deluxe City View", status: "available", guest: "Sẵn sàng check-in", price: "2.800.000đ / đêm" },
  { id: "103", type: "Standard Twin", status: "dirty", guest: "Cần dọn phòng", price: "1.850.000đ / đêm" },
  { id: "104", type: "Deluxe City View", status: "occupied", guest: "Lê Thị Thu", price: "2.900.000đ / đêm" },
  { id: "105", type: "Suite Ocean View", status: "available", guest: "Sẵn sàng check-in", price: "6.200.000đ / đêm" },
  { id: "106", type: "Standard Twin", status: "available", guest: "Sẵn sàng check-in", price: "1.750.000đ / đêm" },
  { id: "107", type: "Family Suite", status: "occupied", guest: "Trần Gia Bảo", price: "4.900.000đ / đêm" },
  { id: "108", type: "Presidential Suite", status: "maintenance", guest: "Bảo trì hệ thống đèn", price: "12.500.000đ / đêm" },
  { id: "201", type: "Suite Ocean View", status: "occupied", guest: "Khánh Linh", price: "6.350.000đ / đêm" },
  { id: "202", type: "Deluxe City View", status: "available", guest: "Sẵn sàng check-in", price: "3.100.000đ / đêm" },
  { id: "203", type: "Standard Twin", status: "dirty", guest: "Cần dọn phòng", price: "1.900.000đ / đêm" },
  { id: "204", type: "Deluxe City View", status: "occupied", guest: "Phạm Đức Tiến", price: "3.250.000đ / đêm" },
  { id: "205", type: "Family Suite", status: "available", guest: "Sẵn sàng check-in", price: "5.400.000đ / đêm" },
  { id: "301", type: "Suite Ocean View", status: "occupied", guest: "Minh Châu", price: "6.500.000đ / đêm" },
  { id: "302", type: "Deluxe City View", status: "available", guest: "Sẵn sàng check-in", price: "3.000.000đ / đêm" },
  { id: "303", type: "Standard Twin", status: "occupied", guest: "Võ Anh Tuấn", price: "2.050.000đ / đêm" },
  { id: "304", type: "Family Suite", status: "dirty", guest: "Cần dọn phòng", price: "4.800.000đ / đêm" },
  { id: "305", type: "Suite Ocean View", status: "available", guest: "Sẵn sàng check-in", price: "6.000.000đ / đêm" },
  { id: "401", type: "Executive Twin", status: "occupied", guest: "Đỗ Thanh Vân", price: "2.350.000đ / đêm" },
  { id: "402", type: "Sky Suite", status: "available", guest: "Sẵn sàng check-in", price: "7.200.000đ / đêm" },
  { id: "403", type: "Garden Villa", status: "occupied", guest: "Lâm Minh Đức", price: "8.900.000đ / đêm" },
  { id: "404", type: "Family Suite", status: "dirty", guest: "Cần dọn phòng", price: "5.200.000đ / đêm" },
];
