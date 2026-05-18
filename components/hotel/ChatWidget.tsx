"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

const BOT_NAME = "Aurore Assistant";
const AVATAR_BOT = "🏨";

const FAQ: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ["check-in", "checkin", "nhận phòng", "giờ vào"],
    answer: "🕐 Giờ check-in tiêu chuẩn là **14:00**. Nếu bạn cần nhận phòng sớm, vui lòng liên hệ trước để chúng tôi sắp xếp (phụ thuộc tình trạng phòng).",
  },
  {
    keys: ["check-out", "checkout", "trả phòng", "giờ ra"],
    answer: "🕐 Giờ check-out tiêu chuẩn là **12:00 trưa**. Late check-out có thể được hỗ trợ đến 15:00 với phụ phí 50% giá phòng.",
  },
  {
    keys: ["giá", "bao nhiêu tiền", "phí", "giá phòng", "bảng giá"],
    answer: "💰 Bảng giá tham khảo:\n• Standard Twin: 1.800.000đ/đêm\n• Deluxe City View: 2.500.000đ/đêm\n• Suite Ocean View: 3.900.000đ/đêm\n• Presidential Suite: 8.500.000đ/đêm\n\nGiá đã bao gồm bữa sáng cho 2 người.",
  },
  {
    keys: ["wifi", "internet", "mạng"],
    answer: "📶 WiFi miễn phí tốc độ cao phủ sóng toàn bộ khách sạn. Mật khẩu được cung cấp tại quầy lễ tân khi nhận phòng.",
  },
  {
    keys: ["bữa sáng", "ăn sáng", "breakfast"],
    answer: "🍳 Bữa sáng buffet được phục vụ tại Nhà hàng Panorama tầng 2:\n• Thứ 2 – Thứ 6: 06:30 – 10:00\n• Thứ 7 – Chủ nhật: 06:30 – 10:30",
  },
  {
    keys: ["spa", "massage", "wellness"],
    answer: "💆 Trung tâm Spa & Wellness hoạt động từ **09:00 – 22:00**. Chúng tôi cung cấp:\n• Massage thư giãn\n• Chăm sóc da mặt\n• Bể sục Jacuzzi\n• Phòng xông hơi\n\nVui lòng đặt lịch trước 2 tiếng qua lễ tân.",
  },
  {
    keys: ["hồ bơi", "bể bơi", "pool", "swimming"],
    answer: "🏊 Hồ bơi vô cực tầng mái mở cửa **06:00 – 22:00**. Khách lưu trú được sử dụng miễn phí. Khăn tắm được cung cấp tại hồ.",
  },
  {
    keys: ["đặt phòng", "book", "booking", "đặt"],
    answer: "📅 Bạn có thể đặt phòng qua:\n• Trang **Đặt phòng** trong ứng dụng này\n• Gọi hotline: **+84 123 456 789**\n• Email: **booking@grandroyal.vn**\n\nChúng tôi sẽ xác nhận trong vòng 30 phút!",
  },
  {
    keys: ["hủy", "cancel", "hoàn tiền", "refund"],
    answer: "❌ Chính sách hủy phòng:\n• Hủy trước 48h: **Hoàn tiền 100%**\n• Hủy trước 24h: **Hoàn tiền 50%**\n• Hủy trong 24h: **Không hoàn tiền**",
  },
  {
    keys: ["đưa đón", "xe", "sân bay", "transfer", "airport"],
    answer: "🚗 Dịch vụ đưa đón sân bay:\n• Xe 4 chỗ: 450.000đ/lượt\n• Xe 7 chỗ: 650.000đ/lượt\n\nVui lòng đặt trước ít nhất 3 tiếng qua lễ tân hoặc email.",
  },
  {
    keys: ["trẻ em", "em bé", "children", "baby", "con"],
    answer: "👶 Khách sạn thân thiện với trẻ em:\n• Trẻ dưới 6 tuổi: **Miễn phí**\n• Trẻ 6-12 tuổi: **50% giá người lớn**\n• Có thể cung cấp nôi/cũi và ghế ăn theo yêu cầu.",
  },
  {
    keys: ["thú cưng", "chó", "mèo", "pet"],
    answer: "🐾 Rất tiếc, khách sạn **không nhận thú cưng** để đảm bảo trải nghiệm tốt nhất cho tất cả quý khách.",
  },
  {
    keys: ["địa chỉ", "vị trí", "ở đâu", "location", "address"],
    answer: "📍 **Grand Royal Coastal Resort**\n123 Đường Lê Duẩn, TP. Hồ Chí Minh\n\nCách sân bay Tân Sơn Nhất 25 phút lái xe.",
  },
  {
    keys: ["liên hệ", "hotline", "điện thoại", "contact", "gọi"],
    answer: "📞 Liên hệ với chúng tôi:\n• Hotline: **+84 123 456 789** (24/7)\n• Email: **info@grandroyal.vn**\n• Lễ tân: Ext. **0**",
  },
];

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keys.some((k) => lower.includes(k))) {
      return faq.answer;
    }
  }
  return `Xin chào! Tôi chưa hiểu câu hỏi của bạn 😊\n\nBạn có thể hỏi tôi về:\n• Giờ check-in / check-out\n• Giá phòng & đặt phòng\n• WiFi, bữa sáng, spa, hồ bơi\n• Đưa đón sân bay\n• Chính sách hủy phòng\n\nHoặc gọi hotline **+84 123 456 789** để được hỗ trợ trực tiếp.`;
}

function now() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const QUICK_REPLIES = ["Giờ check-in?", "Giá phòng?", "Có WiFi không?", "Đặt phòng", "Đưa đón sân bay"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Xin chào! Tôi là **Aurore Assistant** 🏨\nTôi có thể giúp bạn về thông tin phòng, dịch vụ và đặt phòng tại **Grand Royal Coastal Resort**.\n\nBạn cần hỗ trợ gì?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId.current++, role: "user", text: trimmed, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(trimmed);
      const botMsg: Message = { id: nextId.current++, role: "bot", text: reply, time: now() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
      if (!open) setUnread((n) => n + 1);
    }, 800 + Math.random() * 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Format markdown-like bold
  const formatText = (text: string) =>
    text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j}>{p}</strong> : p
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });

  return (
    <>
      {/* Floating button */}
      <button
        id="chatWidgetToggle"
        className={`chat-fab${open ? " chat-fab--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Mở chat hỗ trợ"
      >
        {open ? (
          <i className="fa-solid fa-xmark" />
        ) : (
          <>
            <i className="fa-solid fa-comment-dots" />
            {unread > 0 && <span className="chat-fab-badge">{unread}</span>}
          </>
        )}
      </button>

      {/* Chat panel */}
      <div className={`chat-panel${open ? " chat-panel--open" : ""}`} role="dialog" aria-label="Chat hỗ trợ">
        {/* Header */}
        <div className="chat-panel-head">
          <div className="chat-bot-avatar">{AVATAR_BOT}</div>
          <div>
            <strong>{BOT_NAME}</strong>
            <p className="chat-bot-status">
              <span className="chat-online-dot" />
              Trực tuyến • Phản hồi ngay
            </p>
          </div>
          <button className="chat-close-btn" onClick={() => setOpen(false)}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrap chat-bubble-wrap--${msg.role}`}>
              {msg.role === "bot" && <div className="chat-bubble-avatar">{AVATAR_BOT}</div>}
              <div className={`chat-bubble chat-bubble--${msg.role}`}>
                <div className="chat-bubble-text">{formatText(msg.text)}</div>
                <span className="chat-bubble-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat-bubble-wrap chat-bubble-wrap--bot">
              <div className="chat-bubble-avatar">{AVATAR_BOT}</div>
              <div className="chat-bubble chat-bubble--bot chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="chat-quick-replies">
          {QUICK_REPLIES.map((q) => (
            <button key={q} className="chat-quick-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            autoComplete="off"
          />
          <button type="submit" className="chat-send-btn" disabled={!input.trim()}>
            <i className="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>
    </>
  );
}
