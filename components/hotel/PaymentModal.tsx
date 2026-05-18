"use client";

import { useState } from "react";
import { showToast, navigateHotelPage } from "@/lib/clientUi";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, bookingData, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<"card" | "momo" | "vnpay" | "cash">("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Auto close and complete after showing success
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
        showToast("Thanh toán thành công! Đã gửi xác nhận về email.");
        navigateHotelPage("profile"); // Navigate to history/profile
      }, 2500);
    }, 1500);
  };

  const getAmount = () => {
    return bookingData?.totalAmount || "4.290.000đ"; // Mock amount if not provided
  };

  return (
    <div className="modal">
      <div className="modal-box payment-modal">
        <button className="close-modal" onClick={onClose} disabled={processing || success}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {success ? (
          <div className="payment-success">
            <div className="success-icon">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3>Thanh toán thành công</h3>
            <p>Mã đơn hàng: <strong>#{Math.floor(Math.random() * 1000000)}</strong></p>
            <p className="payment-amount">{getAmount()}</p>
            <p className="payment-note">Vui lòng kiểm tra email để xem chi tiết đặt phòng.</p>
          </div>
        ) : (
          <div className="payment-content">
            <h3>Thanh toán Đặt phòng</h3>
            <div className="payment-summary">
              <div className="summary-row">
                <span>Khách hàng</span>
                <strong>{bookingData?.guest || "Nguyễn Văn A"}</strong>
              </div>
              <div className="summary-row">
                <span>Loại phòng</span>
                <strong>{bookingData?.roomType || "Standard Twin"}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Tổng tiền</span>
                <strong>{getAmount()}</strong>
              </div>
            </div>

            <h4>Phương thức thanh toán</h4>
            <div className="payment-methods">
              <button 
                className={`method-btn ${method === "card" ? "active" : ""}`}
                onClick={() => setMethod("card")}
              >
                <i className="fa-regular fa-credit-card"></i> Thẻ tín dụng/Ghi nợ
              </button>
              <button 
                className={`method-btn ${method === "momo" ? "active" : ""}`}
                onClick={() => setMethod("momo")}
              >
                <i className="fa-solid fa-wallet"></i> Ví MoMo
              </button>
              <button 
                className={`method-btn ${method === "vnpay" ? "active" : ""}`}
                onClick={() => setMethod("vnpay")}
              >
                <i className="fa-solid fa-qrcode"></i> VNPay
              </button>
              <button 
                className={`method-btn ${method === "cash" ? "active" : ""}`}
                onClick={() => setMethod("cash")}
              >
                <i className="fa-solid fa-money-bill-wave"></i> Thanh toán tại quầy
              </button>
            </div>

            {method === "card" && (
              <div className="payment-form">
                <input placeholder="Số thẻ" defaultValue="4123 4567 8901 2345" />
                <div className="two-col-form">
                  <input placeholder="MM/YY" defaultValue="12/26" />
                  <input placeholder="CVC" defaultValue="123" type="password" />
                </div>
                <input placeholder="Tên chủ thẻ" defaultValue="NGUYEN VAN A" />
              </div>
            )}

            {(method === "momo" || method === "vnpay") && (
              <div className="payment-qr">
                <div className="qr-placeholder">
                  <i className="fa-solid fa-qrcode"></i>
                  <p>Quét mã bằng ứng dụng {method === "momo" ? "MoMo" : "Ngân hàng"}</p>
                </div>
              </div>
            )}

            {method === "cash" && (
              <div className="payment-cash-note">
                <p>Bạn sẽ thanh toán trực tiếp tại quầy lễ tân khi nhận phòng.</p>
                <p>Booking sẽ được giữ trong 24h.</p>
              </div>
            )}

            <button 
              className="primary-btn payment-submit-btn" 
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Đang xử lý...</>
              ) : (
                `Thanh toán ${getAmount()}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
