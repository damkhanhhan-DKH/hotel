"use client";

import type { FormEvent } from "react";
import { navigateHotelPage, showToast } from "@/lib/clientUi";
import { useReviews } from "@/hooks/useHotelData";

function starsText(rating: number) {
  const value = Number(rating) || 0;
  return "★★★★★".slice(0, value) + "☆☆☆☆☆".slice(0, 5 - value);
}

export default function ReviewsPanel() {
  const { reviews, createReview } = useReviews();
  const sorted = [...reviews].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lưu reference trước khi await — sau await, e.currentTarget sẽ là null
    const form = e.currentTarget;
    const fd = new FormData(form);
    await createReview({
      guestName: String(fd.get("guestName") ?? ""),
      rating: Number(fd.get("rating") ?? 5),
      comment: String(fd.get("comment") ?? ""),
    });
    form.reset();
    showToast("Cảm ơn bạn đã gửi đánh giá.");
    const role = (window as unknown as { __hotelUserRole?: string }).__hotelUserRole;
    if (role === "staff") navigateHotelPage("reviews");
  };

  return (
    <>
      <article className="panel-card">
        <div className="panel-head">
          <h4>Đánh giá từ khách hàng</h4>
          <small>Lưu qua Mock API + Context</small>
        </div>
        <form className="form-grid" onSubmit={(e) => void onSubmit(e)}>
          <label>
            Tên khách hàng
            <input name="guestName" required placeholder="Nguyễn Văn A" />
          </label>
          <label>
            Đánh giá sao
            <select name="rating" required defaultValue={5}>
              <option value={5}>5 sao - Tuyệt vời</option>
              <option value={4}>4 sao - Rất tốt</option>
              <option value={3}>3 sao - Tốt</option>
              <option value={2}>2 sao - Cần cải thiện</option>
              <option value={1}>1 sao - Không hài lòng</option>
            </select>
          </label>
          <label className="full-row">
            Nội dung đánh giá
            <textarea name="comment" rows={4} required placeholder="Nhập cảm nhận của bạn về phòng, dịch vụ, lễ tân..." />
          </label>
          <div className="full-row checkout-row">
            <button className="primary-btn" type="submit">
              Gửi đánh giá
            </button>
          </div>
        </form>
      </article>

      <article className="panel-card mt-12">
        <div className="panel-head">
          <h4>Danh sách đánh giá gần đây</h4>
          <small>Cập nhật theo Context</small>
        </div>
        <div className="review-list">
          {sorted.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            sorted.map((review) => (
              <article key={review.id} className="review-item">
                <div className="review-head">
                  <strong>{review.guestName}</strong>
                  <span className="review-stars">{starsText(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
                <p className="review-time">{new Date(review.createdAt).toLocaleString("vi-VN")}</p>
              </article>
            ))
          )}
        </div>
      </article>
    </>
  );
}
