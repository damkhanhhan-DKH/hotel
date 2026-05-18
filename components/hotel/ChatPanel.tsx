"use client";

import { useState, useRef, useEffect } from "react";

interface ChatSession {
  id: string;
  guestName: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Array<{ role: "bot" | "user" | "staff"; text: string; time: string }>;
}

const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "s1",
    guestName: "Nguyễn Văn Minh",
    avatar: "N",
    lastMessage: "Cho hỏi giờ check-in là mấy giờ ạ?",
    lastTime: "09:15",
    unread: 2,
    online: true,
    messages: [
      { role: "user", text: "Xin chào, cho mình hỏi giờ check-in là mấy giờ ạ?", time: "09:12" },
      { role: "bot", text: "Giờ check-in tiêu chuẩn là 14:00. Nếu cần sớm hơn vui lòng liên hệ lễ tân.", time: "09:13" },
      { role: "user", text: "Mình có thể check-in lúc 12h không ạ?", time: "09:15" },
    ],
  },
  {
    id: "s2",
    guestName: "Trần Thị Lan",
    avatar: "T",
    lastMessage: "Phòng Suite giá bao nhiêu?",
    lastTime: "09:02",
    unread: 0,
    online: true,
    messages: [
      { role: "user", text: "Phòng Suite Ocean View giá bao nhiêu ạ?", time: "09:00" },
      { role: "bot", text: "Suite Ocean View: 3.900.000đ/đêm, đã bao gồm bữa sáng cho 2 người.", time: "09:01" },
      { role: "user", text: "Cảm ơn bạn!", time: "09:02" },
      { role: "staff", text: "Dạ vâng! Bạn có muốn đặt phòng ngay không ạ? Chúng tôi hỗ trợ 24/7.", time: "09:03" },
    ],
  },
  {
    id: "s3",
    guestName: "Phạm Quốc Hùng",
    avatar: "P",
    lastMessage: "Có dịch vụ spa không?",
    lastTime: "08:45",
    unread: 1,
    online: false,
    messages: [
      { role: "user", text: "Khách sạn có dịch vụ spa không ạ?", time: "08:43" },
      { role: "bot", text: "Có ạ! Spa & Wellness mở cửa 09:00–22:00 hằng ngày.", time: "08:44" },
      { role: "user", text: "Giá một buổi massage là bao nhiêu?", time: "08:45" },
    ],
  },
];

function now() {
  return new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPanel() {
  const [sessions, setSessions] = useState<ChatSession[]>(MOCK_SESSIONS);
  const [activeId, setActiveId] = useState<string>(MOCK_SESSIONS[0].id);
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, sessions]);

  const selectSession = (id: string) => {
    setActiveId(id);
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, unread: 0 } : s))
    );
  };

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return;
    const msg = { role: "staff" as const, text, time: now() };
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? { ...s, messages: [...s.messages, msg], lastMessage: text, lastTime: now() }
          : s
      )
    );
    setReply("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const totalUnread = sessions.reduce((sum, s) => sum + s.unread, 0);

  return (
    <article className="panel-card chat-mgmt">
      <div className="panel-head">
        <h4>
          Chat hỗ trợ khách hàng
          {totalUnread > 0 && (
            <span className="chat-mgmt-badge">{totalUnread} chưa đọc</span>
          )}
        </h4>
        <small>Quản lý tất cả cuộc hội thoại từ khách</small>
      </div>

      <div className="chat-mgmt-layout">
        {/* Sidebar sessions */}
        <div className="chat-session-list">
          {sessions.map((s) => (
            <button
              key={s.id}
              className={`chat-session-item${activeId === s.id ? " chat-session-item--active" : ""}`}
              onClick={() => selectSession(s.id)}
            >
              <div className="chat-session-avatar">
                {s.avatar}
                {s.online && <span className="chat-session-online" />}
              </div>
              <div className="chat-session-info">
                <div className="chat-session-name">{s.guestName}</div>
                <div className="chat-session-last">{s.lastMessage}</div>
              </div>
              <div className="chat-session-meta">
                <span className="chat-session-time">{s.lastTime}</span>
                {s.unread > 0 && <span className="chat-session-unread">{s.unread}</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Conversation */}
        <div className="chat-convo">
          <div className="chat-convo-head">
            <div className="chat-session-avatar chat-session-avatar--lg">
              {activeSession.avatar}
              {activeSession.online && <span className="chat-session-online" />}
            </div>
            <div>
              <strong>{activeSession.guestName}</strong>
              <p className="chat-bot-status">
                <span className={activeSession.online ? "chat-online-dot" : "chat-offline-dot"} />
                {activeSession.online ? "Đang trực tuyến" : "Ngoại tuyến"}
              </p>
            </div>
          </div>

          <div className="chat-convo-messages">
            {activeSession.messages.map((m, i) => (
              <div key={i} className={`chat-bubble-wrap chat-bubble-wrap--${m.role === "user" ? "bot" : "user"}`}>
                {m.role === "user" && (
                  <div className="chat-bubble-avatar chat-bubble-avatar--guest">
                    {activeSession.avatar}
                  </div>
                )}
                <div className={`chat-bubble chat-bubble--${m.role === "user" ? "bot" : "user"}`}>
                  {m.role === "staff" && <span className="chat-staff-label">Bạn (Staff)</span>}
                  {m.role === "bot" && <span className="chat-bot-label">🤖 Bot</span>}
                  <div className="chat-bubble-text">{m.text}</div>
                  <span className="chat-bubble-time">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input-row" onSubmit={sendReply}>
            <input
              className="chat-input"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Trả lời ${activeSession.guestName}...`}
            />
            <button type="submit" className="chat-send-btn" disabled={!reply.trim()}>
              <i className="fa-solid fa-paper-plane" />
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
