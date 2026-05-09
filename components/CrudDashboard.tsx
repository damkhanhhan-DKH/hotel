"use client";

/**
 * Tuần 6–7: CRUD đầy đủ qua Custom Hooks → HotelContext → mockApi (global state).
 */
import { useState } from "react";
import { showToast } from "@/lib/clientUi";
import { useBookings, useReviews, useRooms, useUsers } from "@/hooks/useHotelData";
import type { BookingStatus, RoomStatus, UserRole } from "@/types/hotel";

export default function CrudDashboard() {
  const { loading, rooms, createRoom, updateRoom, deleteRoom } = useRooms();
  const { bookings, createBooking, updateBooking, deleteBooking } = useBookings();
  const { reviews, createReview, updateReview, deleteReview } = useReviews();
  const { users, createUser, updateUser, deleteUser } = useUsers();

  const [roomForm, setRoomForm] = useState({ type: "", status: "available" as RoomStatus, guest: "", price: "" });
  const [bookingForm, setBookingForm] = useState({
    guest: "",
    phone: "",
    roomType: "",
    checkin: "",
    checkout: "",
    status: "Chờ xử lý" as BookingStatus,
  });
  const [reviewForm, setReviewForm] = useState({ guestName: "", rating: 5, comment: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "customer" as UserRole });

  return (
    <article className="panel-card">
      <div className="panel-head">
        <h4>Mock API + Context + CRUD</h4>
        <small>{loading ? "Đang tải dữ liệu..." : "Sẵn sàng thao tác CRUD"}</small>
      </div>

      <div className="crud-grid">
        <section className="crud-section">
          <h4>Rooms CRUD</h4>
          <div className="form-grid">
            <input placeholder="Loại phòng" value={roomForm.type} onChange={(e) => setRoomForm((s) => ({ ...s, type: e.target.value }))} />
            <select value={roomForm.status} onChange={(e) => setRoomForm((s) => ({ ...s, status: e.target.value as RoomStatus }))}>
              <option value="available">Trống</option>
              <option value="occupied">Đang ở</option>
              <option value="dirty">Cần dọn</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <input placeholder="Khách / ghi chú" value={roomForm.guest} onChange={(e) => setRoomForm((s) => ({ ...s, guest: e.target.value }))} />
            <input placeholder="Giá phòng" value={roomForm.price} onChange={(e) => setRoomForm((s) => ({ ...s, price: e.target.value }))} />
            <button
              className="primary-btn full-row"
              type="button"
              onClick={async () => {
                if (!roomForm.type.trim()) {
                  showToast("Nhập loại phòng trước khi tạo.");
                  return;
                }
                try {
                  await createRoom(roomForm);
                  setRoomForm({ type: "", status: "available", guest: "", price: "" });
                  showToast("Đã thêm phòng mới.");
                } catch {
                  showToast("Không thể tạo phòng. Thử lại.");
                }
              }}
            >
              Tạo phòng
            </button>
          </div>
          <ul className="task-list mt-12">
            {rooms.slice(0, 8).map((room) => (
              <li key={room.id}>
                <span>{room.id} — {room.type}</span>
                <span className="actions">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await updateRoom(room.id, { status: room.status === "available" ? "occupied" : "available" });
                        showToast("Đã cập nhật trạng thái phòng.");
                      } catch {
                        showToast("Không cập nhật được phòng.");
                      }
                    }}
                  >
                    Đổi trạng thái
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteRoom(room.id);
                        showToast("Đã xóa phòng.");
                      } catch {
                        showToast("Không xóa được phòng.");
                      }
                    }}
                  >
                    Xóa
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="crud-section">
          <h4>Bookings CRUD</h4>
          <div className="form-grid">
            <input placeholder="Tên khách" value={bookingForm.guest} onChange={(e) => setBookingForm((s) => ({ ...s, guest: e.target.value }))} />
            <input placeholder="Số điện thoại" value={bookingForm.phone} onChange={(e) => setBookingForm((s) => ({ ...s, phone: e.target.value }))} />
            <input placeholder="Loại phòng" value={bookingForm.roomType} onChange={(e) => setBookingForm((s) => ({ ...s, roomType: e.target.value }))} />
            <input type="date" value={bookingForm.checkin} onChange={(e) => setBookingForm((s) => ({ ...s, checkin: e.target.value }))} />
            <input type="date" value={bookingForm.checkout} onChange={(e) => setBookingForm((s) => ({ ...s, checkout: e.target.value }))} />
            <select value={bookingForm.status} onChange={(e) => setBookingForm((s) => ({ ...s, status: e.target.value as BookingStatus }))}>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã check-in">Đã check-in</option>
            </select>
            <button
              className="primary-btn full-row"
              type="button"
              onClick={async () => {
                if (!bookingForm.guest.trim()) return;
                await createBooking(bookingForm);
                setBookingForm({ guest: "", phone: "", roomType: "", checkin: "", checkout: "", status: "Chờ xử lý" });
              }}
            >
              Tạo booking
            </button>
          </div>
          <ul className="task-list mt-12">
            {bookings.slice(0, 8).map((booking) => (
              <li key={booking.id}>
                <span>{booking.guest} — {booking.roomType || "—"}</span>
                <span className="actions">
                  <button type="button" onClick={() => updateBooking(booking.id, { status: "Đã xác nhận" })}>Xác nhận</button>
                  <button type="button" onClick={() => deleteBooking(booking.id)}>Xóa</button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="crud-section">
          <h4>Reviews CRUD</h4>
          <div className="form-grid">
            <input placeholder="Tên khách" value={reviewForm.guestName} onChange={(e) => setReviewForm((s) => ({ ...s, guestName: e.target.value }))} />
            <input type="number" min={1} max={5} value={reviewForm.rating} onChange={(e) => setReviewForm((s) => ({ ...s, rating: Number(e.target.value) }))} />
            <textarea className="full-row" rows={3} placeholder="Nội dung đánh giá" value={reviewForm.comment} onChange={(e) => setReviewForm((s) => ({ ...s, comment: e.target.value }))} />
            <button
              className="primary-btn full-row"
              type="button"
              onClick={async () => {
                if (!reviewForm.guestName.trim() || !reviewForm.comment.trim()) return;
                await createReview(reviewForm);
                setReviewForm({ guestName: "", rating: 5, comment: "" });
              }}
            >
              Tạo review
            </button>
          </div>
          <ul className="task-list mt-12">
            {reviews.slice(0, 8).map((review) => (
              <li key={review.id}>
                <span>{review.guestName} — {review.rating} sao</span>
                <span className="actions">
                  <button type="button" onClick={() => updateReview(review.id, { rating: 5 })}>Đặt 5 sao</button>
                  <button type="button" onClick={() => deleteReview(review.id)}>Xóa</button>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="crud-section">
          <h4>Users CRUD</h4>
          <div className="form-grid">
            <input placeholder="Họ tên" value={userForm.name} onChange={(e) => setUserForm((s) => ({ ...s, name: e.target.value }))} />
            <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm((s) => ({ ...s, email: e.target.value }))} />
            <input type="password" placeholder="Mật khẩu" value={userForm.password} onChange={(e) => setUserForm((s) => ({ ...s, password: e.target.value }))} />
            <select value={userForm.role} onChange={(e) => setUserForm((s) => ({ ...s, role: e.target.value as UserRole }))}>
              <option value="customer">Khách hàng</option>
              <option value="staff">Nội bộ</option>
            </select>
            <button
              className="primary-btn full-row"
              type="button"
              onClick={async () => {
                if (!userForm.name.trim() || !userForm.email.trim() || !userForm.password.trim()) return;
                await createUser(userForm);
                setUserForm({ name: "", email: "", password: "", role: "customer" });
              }}
            >
              Tạo user
            </button>
          </div>
          <ul className="task-list mt-12">
            {users.slice(0, 8).map((user) => (
              <li key={user.id}>
                <span>{user.name} — {user.email} ({user.role})</span>
                <span className="actions">
                  <button type="button" onClick={() => updateUser(user.id, { role: user.role === "staff" ? "customer" : "staff" })}>Đổi vai trò</button>
                  <button type="button" onClick={() => deleteUser(user.id)}>Xóa</button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
