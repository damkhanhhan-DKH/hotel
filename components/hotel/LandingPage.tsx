"use client";

import { navigateHotelPage } from "@/lib/clientUi";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-overlay">
          <div className="landing-hero-content">
            <span className="landing-kicker">Welcome to</span>
            <h1 className="landing-title">Grand Royal Coastal Resort</h1>
            <p className="landing-subtitle">
              Trải nghiệm nghỉ dưỡng 5 sao với không gian sang trọng, dịch vụ chuẩn quốc tế và tầm nhìn hướng biển đẳng cấp.
            </p>
            <div className="landing-actions">
              <button 
                className="primary-btn landing-btn"
                onClick={() => navigateHotelPage("rooms")}
              >
                Khám phá phòng
              </button>
              <button 
                className="landing-btn-outline"
                onClick={() => navigateHotelPage("booking")}
              >
                Đặt phòng ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section className="landing-section">
        <div className="landing-section-head">
          <h2>Ưu đãi đặc biệt</h2>
          <p>Tận hưởng những gói nghỉ dưỡng đẳng cấp với mức giá tốt nhất</p>
        </div>
        <div className="promo-grid">
          <article className="promo-card">
            <div className="promo-img promo-img-1" />
            <div className="promo-content">
              <span className="promo-tag">Giảm 20%</span>
              <h3>Summer Escape</h3>
              <p>Tận hưởng mùa hè rực rỡ với ưu đãi 20% cho tất cả các hạng phòng từ 3 đêm trở lên.</p>
            </div>
          </article>
          <article className="promo-card">
            <div className="promo-img promo-img-2" />
            <div className="promo-content">
              <span className="promo-tag">Miễn phí Spa</span>
              <h3>Wellness Journey</h3>
              <p>Tặng 1 suất massage body 60 phút dành cho 2 người khi đặt phòng Suite.</p>
            </div>
          </article>
          <article className="promo-card">
            <div className="promo-img promo-img-3" />
            <div className="promo-content">
              <span className="promo-tag">F&B Credit</span>
              <h3>Gourmet Experience</h3>
              <p>Nhận ngay F&B Credit trị giá 1.000.000đ để sử dụng tại nhà hàng Panorama.</p>
            </div>
          </article>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="landing-section landing-amenities-bg">
        <div className="landing-section-head">
          <h2>Tiện ích 5 Sao</h2>
          <p>Dịch vụ hoàn hảo cho mọi nhu cầu của bạn</p>
        </div>
        <div className="amenity-grid">
          <div className="amenity-item">
            <i className="fa-solid fa-water" />
            <h4>Hồ bơi vô cực</h4>
          </div>
          <div className="amenity-item">
            <i className="fa-solid fa-spa" />
            <h4>Spa & Wellness</h4>
          </div>
          <div className="amenity-item">
            <i className="fa-solid fa-utensils" />
            <h4>Nhà hàng cao cấp</h4>
          </div>
          <div className="amenity-item">
            <i className="fa-solid fa-dumbbell" />
            <h4>Phòng Gym 24/7</h4>
          </div>
          <div className="amenity-item">
            <i className="fa-solid fa-martini-glass-citrus" />
            <h4>Sky Bar</h4>
          </div>
          <div className="amenity-item">
            <i className="fa-solid fa-car" />
            <h4>Đưa đón sân bay</h4>
          </div>
        </div>
      </section>
    </div>
  );
}
