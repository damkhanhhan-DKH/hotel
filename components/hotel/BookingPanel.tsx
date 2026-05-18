"use client";

import type { FormEvent } from "react";
import { useEffect, useRef } from "react";
import { useBookingDraft } from "@/context/BookingDraftContext";
import { navigateHotelPage, showToast } from "@/lib/clientUi";
import { useBookings } from "@/hooks/useHotelData";
import { BookingStatusTag } from "./BookingStatusTag";

export default function BookingPanel() {
  const { bookings, createBooking } = useBookings();
  const { consumeRoomDraft } = useBookingDraft();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onPage = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id !== "booking") return;
      const room = consumeRoomDraft();
      const f = formRef.current;
      if (!room || !f) return;
      const rt = f.elements.namedItem("roomType") as HTMLSelectElement | null;
      const pr = f.elements.namedItem("preferredRoom") as HTMLInputElement | null;
      const note = f.elements.namedItem("note") as HTMLTextAreaElement | null;
      if (rt) rt.value = room.type;
      if (pr) pr.value = room.id;
      if (note && !note.value) note.value = `Đặt nhanh từ danh sách phòng: Phòng ${room.id}.`;
      (f.elements.namedItem("guest") as HTMLInputElement | null)?.focus();
    };
    window.addEventListener("hotel:active-page", onPage);
    return () => window.removeEventListener("hotel:active-page", onPage);
  }, [consumeRoomDraft]);

  const recent = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lưu reference trước khi await — sau await, e.currentTarget sẽ là null
    const form = e.currentTarget;
    const fd = new FormData(form);
    const preferred = String(fd.get("preferredRoom") ?? "").trim();
    let roomType = String(fd.get("roomType") ?? "");
    if (preferred) roomType = `${roomType} (ưu tiên #${preferred})`;
    await createBooking({
      guest: String(fd.get("guest") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      roomType,
      checkin: String(fd.get("checkin") ?? ""),
      checkout: String(fd.get("checkout") ?? ""),
      status: "Đã xác nhận",
    });
    form.reset();
    showToast("Đặt phòng thành công. Đơn đã chuyển đến quầy lễ tân.");
    const role = (window as unknown as { __hotelUserRole?: string }).__hotelUserRole;
    if (role === "staff") navigateHotelPage("reception");
  };

  return (
    <>
      <article className="panel-card">
        <div className="panel-head">
          <h4>Tạo đặt phòng mới</h4>
          <small>Điền thông tin và xác nhận (lưu qua Mock API + Context)</small>
        </div>
        <form ref={formRef} className="form-grid" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Khách hàng
            <input required name="guest" placeholder="Nguyễn Văn A" />
          </label>
          <label>
            Số điện thoại
            <input required name="phone" placeholder="09xx xxx xxx" />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="guest@email.com" />
          </label>
          <label>
            CMND/CCCD
            <input name="idCard" placeholder="079xxxxxxx" />
          </label>
          <label>
            Ngày nhận phòng
            <input required name="checkin" type="date" />
          </label>
          <label>
            Ngày trả phòng
            <input required name="checkout" type="date" />
          </label>
          <label>
            Loại phòng
            <select name="roomType" defaultValue="Standard Twin">
              <option>Standard Twin</option>
              <option>Deluxe City View</option>
              <option>Suite Ocean View</option>
              <option>Presidential Suite</option>
              <option>Executive Twin</option>
              <option>Sky Suite</option>
              <option>Garden Villa</option>
              <option>Family Suite</option>
            </select>
          </label>
          <label>
            Phòng mong muốn
            <input name="preferredRoom" placeholder="Ví dụ: 305" />
          </label>
          <label>
            Số khách
            <input name="guestCount" type="number" min={1} defaultValue={2} />
          </label>
          <label className="full-row">
            Ghi chú
            <textarea name="note" rows={4} placeholder="Yêu cầu thêm giường phụ, tầng cao..." />
          </label>
          <div className="full-row checkout-row">
            <div>
              <p>Tạm tính</p>
              <strong>4.290.000đ</strong>
            </div>
            <button className="primary-btn" type="submit">
              Xác nhận đặt phòng
            </button>
          </div>
        </form>
      </article>

      <article className="panel-card mt-12">
        <div className="panel-head">
          <h4>Đơn đặt phòng gần đây</h4>
          <small>Đồng bộ từ Context / localStorage</small>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách</th>
                <th>Loại phòng</th>
                <th>Nhận</th>
                <th>Trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={6}>Chưa có đơn đặt phòng nào.</td>
                </tr>
              ) : (
                recent.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.guest}</td>
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
      </article>
    </>
  );
}
