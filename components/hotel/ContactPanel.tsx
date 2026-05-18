"use client";

import { showToast } from "@/lib/clientUi";

export default function ContactPanel() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Đã gửi tin nhắn liên hệ. Chúng tôi sẽ phản hồi sớm nhất.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h2>Liên hệ với chúng tôi</h2>
        <p>Grand Royal Coastal Resort luôn sẵn sàng hỗ trợ quý khách 24/7</p>
      </div>

      <div className="contact-grid">
        {/* Thông tin liên hệ */}
        <div className="contact-info-col">
          <article className="panel-card contact-info-card">
            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-location-dot"></i></div>
              <div>
                <h4>Địa chỉ</h4>
                <p>123 Đường Lê Duẩn, Quận 1<br />TP. Hồ Chí Minh, Việt Nam</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-phone"></i></div>
              <div>
                <h4>Điện thoại</h4>
                <p>Hotline đặt phòng: <strong>+84 123 456 789</strong></p>
                <p>Lễ tân (24/7): <strong>+84 987 654 321</strong></p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
              <div>
                <h4>Email</h4>
                <p>Đặt phòng: booking@grandroyal.vn</p>
                <p>Hỗ trợ: info@grandroyal.vn</p>
              </div>
            </div>
          </article>

          {/* Map Mock */}
          <article className="panel-card map-card">
            <div className="map-placeholder">
              <i className="fa-solid fa-map-location-dot"></i>
              <p>Bản đồ Google Maps</p>
              <button className="landing-btn-outline mt-12">Mở trong Google Maps</button>
            </div>
          </article>
        </div>

        {/* Form liên hệ */}
        <article className="panel-card contact-form-card">
          <div className="panel-head">
            <h4>Gửi tin nhắn cho chúng tôi</h4>
            <small>Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong vòng 24h.</small>
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="full-row">Họ và tên
              <input required name="name" placeholder="Ví dụ: Nguyễn Văn A" />
            </label>
            <label>Email
              <input required type="email" name="email" placeholder="email@example.com" />
            </label>
            <label>Số điện thoại
              <input required name="phone" placeholder="09xxxxxxx" />
            </label>
            <label className="full-row">Chủ đề
              <select name="subject">
                <option value="booking">Hỗ trợ đặt phòng</option>
                <option value="service">Hỏi về dịch vụ (Spa, Nhà hàng...)</option>
                <option value="feedback">Góp ý / Than phiền</option>
                <option value="other">Khác</option>
              </select>
            </label>
            <label className="full-row">Nội dung tin nhắn
              <textarea required name="message" rows={5} placeholder="Nhập nội dung cần hỗ trợ..." />
            </label>
            <div className="full-row mt-12">
              <button className="primary-btn w-full" type="submit">Gửi tin nhắn</button>
            </div>
          </form>
        </article>
      </div>
    </div>
  );
}
