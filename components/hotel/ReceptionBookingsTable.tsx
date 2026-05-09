"use client";

import { useBookings } from "@/hooks/useHotelData";
import { BookingStatusTag } from "./BookingStatusTag";

export default function ReceptionBookingsTable() {
  const { bookings } = useBookings();
  const sorted = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Liên hệ</th>
            <th>Loại phòng</th>
            <th>Nhận phòng</th>
            <th>Trả phòng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={7}>Chưa có đơn đặt phòng nào.</td>
            </tr>
          ) : (
            sorted.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.guest}</td>
                <td>{b.phone}</td>
                <td>{b.roomType}</td>
                <td>{b.checkin}</td>
                <td>{b.checkout}</td>
                <td>
                  <BookingStatusTag status={b.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
