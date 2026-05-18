"use client";

import { useState } from "react";
import { showToast } from "@/lib/clientUi";
import { BookingStatusTag } from "./BookingStatusTag";

// Mock history data for the current user
const MOCK_HISTORY = [
  { id: "B-84729", roomType: "Deluxe City View", checkin: "2026-05-10", checkout: "2026-05-12", amount: "5.000.000đ", status: "Đã hoàn thành" },
  { id: "B-91234", roomType: "Standard Twin", checkin: "2026-06-15", checkout: "2026-06-18", amount: "5.400.000đ", status: "Đã xác nhận" },
  { id: "B-73621", roomType: "Suite Ocean View", checkin: "2026-03-01", checkout: "2026-03-03", amount: "7.800.000đ", status: "Đã hủy" },
];

export default function ProfilePanel() {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [history, setHistory] = useState(MOCK_HISTORY);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Cập nhật thông tin cá nhân thành công.");
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy đặt phòng này không?")) {
      setHistory(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
      showToast(`Đã hủy thành công mã đặt phòng ${id}`);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar panel-card">
        <div className="profile-avatar-sec">
          <img src="https://ui-avatars.com/api/?name=Guest+User&background=c9a84c&color=fff&size=120" alt="Avatar" className="profile-avatar-lg" />
          <h3>Nguyễn Văn A</h3>
          <span className="chip">Thành viên Hạng Vàng</span>
        </div>
        <div className="profile-nav">
          <button 
            className={`side-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <i className="fa-regular fa-user"></i> Thông tin cá nhân
          </button>
          <button 
            className={`side-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử đặt phòng
          </button>
        </div>
      </div>

      <div className="profile-content">
        {activeTab === "info" && (
          <article className="panel-card">
            <div className="panel-head">
              <h4>Thông tin cá nhân</h4>
              <small>Quản lý thông tin liên hệ và mật khẩu</small>
            </div>
            <form className="form-grid" onSubmit={handleUpdateInfo}>
              <label>Họ và tên
                <input name="name" defaultValue="Nguyễn Văn A" required />
              </label>
              <label>Số điện thoại
                <input name="phone" defaultValue="0987654321" required />
              </label>
              <label>Email
                <input name="email" type="email" defaultValue="guest@email.com" readOnly className="read-only-input" />
              </label>
              <label>Số CMND/CCCD
                <input name="idcard" defaultValue="079123456789" />
              </label>
              <label className="full-row">Địa chỉ
                <input name="address" defaultValue="123 Nguyễn Huệ, Quận 1, TP. HCM" />
              </label>
              <div className="full-row mt-12">
                <hr className="divider" />
                <h4 style={{ marginBottom: "12px", marginTop: "12px" }}>Đổi mật khẩu</h4>
              </div>
              <label>Mật khẩu hiện tại
                <input name="currentPassword" type="password" placeholder="********" />
              </label>
              <label>Mật khẩu mới
                <input name="newPassword" type="password" placeholder="********" />
              </label>
              <div className="full-row checkout-row mt-12">
                <button className="primary-btn" type="submit">Lưu thay đổi</button>
              </div>
            </form>
          </article>
        )}

        {activeTab === "history" && (
          <article className="panel-card">
            <div className="panel-head">
              <h4>Lịch sử đặt phòng</h4>
              <small>Danh sách các phòng bạn đã đặt</small>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã ĐP</th>
                    <th>Loại phòng</th>
                    <th>Nhận phòng</th>
                    <th>Trả phòng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.id}</strong></td>
                      <td>{b.roomType}</td>
                      <td>{b.checkin}</td>
                      <td>{b.checkout}</td>
                      <td>{b.amount}</td>
                      <td>
                        <BookingStatusTag status={b.status} />
                      </td>
                      <td>
                        {b.status === "Đã xác nhận" ? (
                          <button 
                            className="cancel-btn-small"
                            onClick={() => handleCancelBooking(b.id)}
                          >
                            Hủy
                          </button>
                        ) : (
                          <span className="action-disabled">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
