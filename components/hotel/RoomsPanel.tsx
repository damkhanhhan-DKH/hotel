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
  const [modalRoom, setModalRoom] = useState<EnrichedRoom | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const enriched = useMemo(() => enrichRooms(rooms), [rooms]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return enriched.filter((room) => {
      const passFilter = filter === "all" || filter === room.status;
      const passSearch = !k || room.id.toLowerCase().includes(k) || room.type.toLowerCase().includes(k);
      return passFilter && passSearch;
    });
  }, [enriched, keyword, filter]);

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
      <div className="page-tools">
        <input
          type="search"
          placeholder="Tìm theo số phòng, loại phòng..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="occupied">Đang ở</option>
          <option value="available">Trống</option>
          <option value="dirty">Cần dọn</option>
          <option value="maintenance">Bảo trì</option>
        </select>
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
                  {roomStatusText(modalRoom.status)} | {modalRoom.price} | {modalRoom.guest}
                </p>
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
