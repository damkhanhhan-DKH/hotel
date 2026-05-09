import type { CSSProperties } from "react";
import Script from "next/script";
import CrudDashboard from "@/components/CrudDashboard";
import BookingPanel from "@/components/hotel/BookingPanel";
import DashboardLive from "@/components/hotel/DashboardLive";
import DashboardRoomStats from "@/components/hotel/DashboardRoomStats";
import ReceptionBookingsTable from "@/components/hotel/ReceptionBookingsTable";
import ReviewsPanel from "@/components/hotel/ReviewsPanel";
import RoomsPanel from "@/components/hotel/RoomsPanel";

const chartStyle = (value: string): CSSProperties =>
  ({ "--h": value }) as CSSProperties;

export default function Home() {
  return (
    <>
      <div id="authGate" className="auth-gate">
        <div className="auth-hero">
          <div className="auth-overlay">
            <p className="auth-kicker">Luxury Destination</p>
            <h1>Grand Royal Coastal Resort</h1>
            <p>Trải nghiệm nghỉ dưỡng 5 sao với không gian sang trọng, dịch vụ chuẩn quốc tế và tầm nhìn hướng biển đẳng cấp.</p>
          </div>
        </div>
        <div className="auth-card">
          <h2>Luxury PMS</h2>
          <p className="auth-sub">Đăng nhập hoặc đăng ký để tiếp tục</p>
          <div className="auth-tabs">
            <button id="showLogin" className="auth-tab active" type="button">Đăng nhập</button>
            <button id="showRegister" className="auth-tab" type="button">Đăng ký</button>
          </div>
          <form id="loginForm" className="auth-form">
            <label>Email<input name="email" type="email" required placeholder="admin@hotel.vn" /></label>
            <label>Mật khẩu<input name="password" type="password" required placeholder="********" /></label>
            <button className="primary-btn auth-btn" type="submit">Đăng nhập</button>
            <small>Tài khoản mẫu quản lý: admin@hotel.vn / 123456</small>
          </form>
          <form id="registerForm" className="auth-form hidden">
            <label>Họ và tên<input name="name" type="text" required placeholder="Nguyễn Văn A" /></label>
            <label>Email<input name="email" type="email" required placeholder="guest@email.com" /></label>
            <label>Mật khẩu<input name="password" type="password" required placeholder="Tối thiểu 6 ký tự" /></label>
            <label>Loại tài khoản
              <select name="role">
                <option value="customer">Khách hàng</option>
                <option value="staff">Nội bộ quản lý khách sạn</option>
              </select>
            </label>
            <button className="primary-btn auth-btn" type="submit">Đăng ký</button>
          </form>
        </div>
      </div>

      <div id="appShell" className="app-shell hidden">
        <aside className="side-nav">
          <h1>Luxury PMS</h1>
          <button className="side-btn active" data-page="dashboard"><i className="fa-solid fa-chart-pie"></i>Bảng điều khiển</button>
          <button className="side-btn" data-page="rooms"><i className="fa-solid fa-bed"></i>Phòng</button>
          <button className="side-btn" data-page="booking"><i className="fa-solid fa-calendar-check"></i>Đặt phòng</button>
          <button className="side-btn" data-page="reviews"><i className="fa-solid fa-star"></i>Đánh giá</button>
          <button className="side-btn internal-only" data-page="reception"><i className="fa-solid fa-desktop"></i>Lễ tân</button>
          <button className="side-btn internal-only" data-page="guests"><i className="fa-solid fa-users"></i>Khách hàng</button>
          <button className="side-btn internal-only" data-page="services"><i className="fa-solid fa-bell-concierge"></i>Dịch vụ</button>
          <button className="side-btn internal-only" data-page="housekeeping"><i className="fa-solid fa-broom"></i>Dọn phòng</button>
          <button className="side-btn internal-only" data-page="finance"><i className="fa-solid fa-money-bill-trend-up"></i>Tài chính</button>
          <button className="side-btn internal-only" data-page="settings"><i className="fa-solid fa-gear"></i>Cài đặt</button>
          <button className="side-btn internal-only" data-page="crud"><i className="fa-solid fa-database"></i>Mock API CRUD</button>
        </aside>

        <main className="main-panel">
          <header className="top-header">
            <div>
              <p className="kicker">Hệ thống quản lý khách sạn 5 sao</p>
              <h2 id="page-title">Bảng điều khiển tổng quan</h2>
            </div>
            <div className="header-tools">
              <input id="globalSearch" type="search" placeholder="Tìm phòng, khách, booking..." />
              <span id="userRoleBadge" className="role-badge">Khách hàng</span>
              <button className="icon-btn"><i className="fa-regular fa-bell"></i></button>
              <img id="userAvatar" className="avatar" src="https://ui-avatars.com/api/?name=Hotel+Admin&background=2563eb&color=fff" alt="Admin" />
              <button id="logoutBtn" className="icon-btn" title="Đăng xuất"><i className="fa-solid fa-right-from-bracket"></i></button>
            </div>
          </header>

          <section id="dashboard" className="page active">
            <div className="hero">
              <div>
                <span className="chip">Online 24/7</span>
                <h3>Grand Royal Coastal Resort</h3>
                <p>Công suất hôm nay đạt 85%, có 9 lượt check-in và 7 lượt check-out.</p>
              </div>
              <button className="primary-btn" data-page="booking">Tạo booking mới</button>
            </div>

            <DashboardLive />

            <div className="two-col">
              <article className="panel-card">
                <div className="panel-head">
                  <h4>Biểu đồ doanh thu tuần</h4>
                  <small>Tháng 3 / 2026</small>
                </div>
                <div className="line-chart">
                  <div style={chartStyle("32%")}></div>
                  <div style={chartStyle("47%")}></div>
                  <div style={chartStyle("61%")}></div>
                  <div style={chartStyle("40%")}></div>
                  <div style={chartStyle("80%")}></div>
                  <div style={chartStyle("65%")}></div>
                  <div style={chartStyle("92%")}></div>
                </div>
              </article>
              <article className="panel-card">
                <div className="panel-head">
                  <h4>Tình trạng phòng</h4>
                  <small>Toàn khách sạn</small>
                </div>
                <DashboardRoomStats />
              </article>
            </div>
          </section>

          <section id="rooms" className="page">
            <RoomsPanel />
          </section>

          <section id="booking" className="page">
            <BookingPanel />
          </section>

          <section id="reception" className="page internal-only">
            <article className="panel-card">
              <div className="panel-head">
                <h4>Quầy lễ tân - Danh sách đặt phòng</h4>
                <small>Nơi lễ tân theo dõi toàn bộ booking</small>
              </div>
              <ReceptionBookingsTable />
            </article>
          </section>

          <section id="reviews" className="page">
            <ReviewsPanel />
          </section>

          <section id="guests" className="page internal-only">
            <div className="metric-grid">
              <article className="metric-card">
                <p>Khách đang lưu trú</p>
                <strong id="guestStayingCount">0</strong>
                <span className="up">+6.2%</span>
              </article>
              <article className="metric-card">
                <p>Khách sắp trả phòng</p>
                <strong id="guestCheckoutCount">0</strong>
                <span className="down">-1.1%</span>
              </article>
              <article className="metric-card">
                <p>Khách VIP</p>
                <strong id="guestVipCount">0</strong>
                <span className="up">+2.8%</span>
              </article>
            </div>
            <article className="panel-card">
              <div className="panel-head">
                <h4>Danh sách khách lưu trú</h4>
                <small>Nội bộ quản lý khách và trạng thái lưu trú</small>
              </div>
              <table className="data-table">
                <thead>
                  <tr><th>Khách hàng</th><th>Phòng</th><th>Liên hệ</th><th>Ngày đến</th><th>Ngày đi</th><th>Hạng</th><th>Trạng thái</th></tr>
                </thead>
                <tbody id="guestTableBody"></tbody>
              </table>
            </article>
          </section>

          <section id="services" className="page internal-only">
            <div className="service-grid">
              <article className="panel-card"><h4>Nhà hàng</h4><p>12 đơn hôm nay</p><strong>18.700.000đ</strong></article>
              <article className="panel-card"><h4>Spa & Wellness</h4><p>7 lịch hẹn</p><strong>9.250.000đ</strong></article>
              <article className="panel-card"><h4>Giặt ủi</h4><p>24 phiếu dịch vụ</p><strong>4.120.000đ</strong></article>
              <article className="panel-card"><h4>Xe đưa đón</h4><p>5 chuyến</p><strong>3.980.000đ</strong></article>
            </div>
          </section>

          <section id="housekeeping" className="page internal-only">
            <article className="panel-card">
              <div className="panel-head">
                <h4>Lịch dọn phòng</h4>
                <small>Ca sáng - cập nhật realtime</small>
              </div>
              <ul className="task-list">
                <li><span>Phòng 103 - Deep Clean</span><strong>Ưu tiên cao</strong></li>
                <li><span>Phòng 207 - Refill minibar</span><strong>10:30</strong></li>
                <li><span>Phòng 511 - Đổi ga giường</span><strong>11:10</strong></li>
                <li><span>Phòng 615 - Vệ sinh balcony</span><strong>12:00</strong></li>
              </ul>
            </article>
          </section>

          <section id="finance" className="page internal-only">
            <div className="metric-grid">
              <article className="metric-card"><p>Doanh thu tháng</p><strong>2.890.000.000đ</strong><span className="up">+8.5%</span></article>
              <article className="metric-card"><p>ADR</p><strong>2.150.000đ</strong><span className="up">+2.1%</span></article>
              <article className="metric-card"><p>RevPAR</p><strong>1.827.000đ</strong><span className="up">+3.0%</span></article>
              <article className="metric-card"><p>Chi phí vận hành</p><strong>620.000.000đ</strong><span className="down">+1.2%</span></article>
            </div>
          </section>

          <section id="settings" className="page internal-only">
            <article className="panel-card">
              <div className="panel-head">
                <h4>Thiết lập khách sạn</h4>
                <small>Cấu hình hệ thống và nhân sự</small>
              </div>
              <form id="settingsForm" className="form-grid">
                <label>Tên khách sạn
                  <input id="hotelNameInput" name="hotelName" defaultValue="Grand Royal Coastal Resort" />
                </label>
                <label>Số điện thoại
                  <input id="hotelPhoneInput" name="hotelPhone" defaultValue="+84 123 456 789" />
                </label>
                <label>Email hệ thống
                  <input id="hotelEmailInput" name="hotelEmail" type="email" defaultValue="ops@grandroyal.vn" />
                </label>
                <label>Địa chỉ
                  <input id="hotelAddressInput" name="hotelAddress" defaultValue="123 Đường Lê Duẩn, TP. Hồ Chí Minh" />
                </label>
                <label>Ngôn ngữ mặc định
                  <select id="languageInput" name="language">
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </select>
                </label>
                <label>Múi giờ
                  <select id="timezoneInput" name="timezone">
                    <option value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</option>
                    <option value="Asia/Bangkok">GMT+7 (Bangkok)</option>
                  </select>
                </label>
                <label>Thuế VAT (%)
                  <input id="vatInput" name="vatRate" type="number" min="0" max="20" defaultValue="8" />
                </label>
                <label className="checkbox-row">
                  <input id="notifyInput" name="enableNotify" type="checkbox" defaultChecked />
                  Bật thông báo check-in/check-out
                </label>
                <div className="full-row checkout-row">
                  <button className="primary-btn" type="submit">Lưu cài đặt</button>
                  <button id="settingsLogoutBtn" className="danger-btn" type="button">Đăng xuất</button>
                </div>
              </form>
            </article>
            <article className="panel-card mt-12">
              <div className="panel-head">
                <h4>Nhân sự nội bộ quản lý</h4>
                <small>Tài khoản staff có quyền truy cập hệ thống</small>
              </div>
              <table className="data-table">
                <thead>
                  <tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Ca làm việc</th><th>Trạng thái</th></tr>
                </thead>
                <tbody id="staffTableBody"></tbody>
              </table>
            </article>
          </section>

          <section id="crud" className="page internal-only">
            <CrudDashboard />
          </section>
        </main>
      </div>

      <div id="toast" className="toast">Thông báo</div>
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  );
}
