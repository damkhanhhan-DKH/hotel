"use client";

import { useEffect, useMemo, useState } from "react";
import { useBookingDraft } from "@/context/BookingDraftContext";
import { navigateHotelPage, showToast } from "@/lib/clientUi";
import { enrichRooms, type EnrichedRoom } from "@/lib/roomMedia";
import { useRooms } from "@/hooks/useHotelData";
import type { RoomStatus } from "@/types/hotel";

function roomStatusText(status: RoomStatus) {
  if (status === "occupied") return "Đang ở";
  if (status === "available") return "Trống";
  if (status === "dirty") return "Cần dọn";
  return "Bảo trì";
}

export default function RoomsPanel() {
  const { rooms } = useRooms();
  const { setRoomDraft } = useBookingDraft();
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [capacity, setCapacity] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [modalRoom, setModalRoom] = useState<EnrichedRoom | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const enriched = useMemo(() => enrichRooms(rooms), [rooms]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return enriched.filter((room) => {
      const passFilter = filter === "all" || filter === room.status;
      const passSearch = !k || room.id.toLowerCase().includes(k) || room.type.toLowerCase().includes(k);
      
      // Giả lập số người từ loại phòng (nếu là Twin/Double -> 2, Suite -> 2-4, Family -> 4)
      let roomCap = 2;
      if (room.type.includes("Family")) roomCap = 4;
      if (room.type.includes("Suite")) roomCap = 3;
      const passCapacity = capacity === 0 || roomCap >= capacity;

      // Extract số từ chuỗi giá (ví dụ "4.290.000đ" -> 4290000)
      const priceNum = parseInt(room.price.replace(/\D/g, "")) || 0;
      const passPrice = priceNum <= maxPrice;

      return passFilter && passSearch && passCapacity && passPrice;
    });
  }, [enriched, keyword, filter, capacity, maxPrice]);

  useEffect(() => {
    const onGlobal = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string") setKeyword(detail);
    };
    window.addEventListener("hotel:global-search", onGlobal);
    return () => window.removeEventListener("hotel:global-search", onGlobal);
  }, []);

  useEffect(() => {
    if (modalRoom) {
      setActiveImage(modalRoom.images[0] ?? null);
    } else {
      setActiveImage(null);
    }
  }, [modalRoom]);

  return (
    <>
      <div className="advanced-search-panel panel-card">
        <div className="search-grid">
          <label>
            Tìm kiếm
            <input
              type="search"
              placeholder="Tên phòng, loại phòng..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </label>
          <label>
            Ngày nhận - trả
            <input type="text" placeholder="Chọn ngày (Mock)" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
          </label>
          <label>
            Số người
            <select value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}>
              <option value={0}>Mọi sức chứa</option>
              <option value={1}>1 Người</option>
              <option value={2}>2 Người</option>
              <option value={3}>3 Người</option>
              <option value={4}>4+ Người</option>
            </select>
          </label>
          <label>
            Mức giá tối đa: {maxPrice.toLocaleString('vi-VN')}đ
            <input 
              type="range" 
              min="1000000" 
              max="15000000" 
              step="500000"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </label>
        </div>
      </div>

      <div className="room-grid">
        {filtered.length === 0 ? (
          <p>Không tìm thấy phòng phù hợp.</p>
        ) : (
          filtered.map((room) => (
            <article
              key={room.id}
              className="room-card"
              role="button"
              tabIndex={0}
              onClick={() => setModalRoom(room)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModalRoom(room);
                }
              }}
            >
              <img src={room.images[0]} alt={`Phòng ${room.id}`} />
              <div className="room-info">
                <div className="room-head">
                  <strong>Phòng {room.id}</strong>
                  <span className={`badge ${room.status}`}>{roomStatusText(room.status)}</span>
                </div>
                <p>{room.type}</p>
                <p>{room.guest}</p>
                <strong>{room.price}</strong>
              </div>
            </article>
          ))
        )}
      </div>

      <div
        className={`modal${modalRoom ? "" : " hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!modalRoom}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalRoom(null);
        }}
      >
        <div className="modal-box">
          <button type="button" className="close-modal" onClick={() => setModalRoom(null)} aria-label="Đóng">
            <i className="fa-solid fa-xmark"></i>
          </button>
          {modalRoom ? (
            <>
              <img className="room-modal-hero" src={activeImage ?? modalRoom.images[0]} alt="Ảnh phòng" />
              <div className="modal-content">
                <h4>
                  Phòng {modalRoom.id} - {modalRoom.type}
                </h4>
                <p>
                  {roomStatusText(modalRoom.status)} | {modalRoom.price} | Tối đa: {modalRoom.type.includes("Family") ? 4 : modalRoom.type.includes("Suite") ? 3 : 2} người
                </p>
                <div className="room-amenities">
                  <span title="WiFi Miễn phí"><i className="fa-solid fa-wifi"></i></span>
                  <span title="Tivi thông minh"><i className="fa-solid fa-tv"></i></span>
                  <span title="Điều hòa"><i className="fa-regular fa-snowflake"></i></span>
                  <span title="Bồn tắm"><i className="fa-solid fa-bath"></i></span>
                  {modalRoom.type.includes("View") && <span title="View đẹp"><i className="fa-solid fa-mountain-sun"></i></span>}
                </div>
                <p>{modalRoom.desc}</p>
                <div className="thumbs">
                  {modalRoom.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className={src === activeImage ? "active" : ""}
                      role="presentation"
                      onClick={() => setActiveImage(src)}
                    />
                  ))}
                </div>
                <button
                  className="primary-btn mt-12"
                  type="button"
                  onClick={() => {
                    setRoomDraft(modalRoom);
                    setModalRoom(null);
                    navigateHotelPage("booking");
                    showToast(`Đã chọn Phòng ${modalRoom.id} để đặt.`);
                  }}
                >
                  Đặt ngay phòng này
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
