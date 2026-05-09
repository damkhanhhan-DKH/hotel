"use client";

import { useMemo } from "react";
import { useRooms } from "@/hooks/useHotelData";

export default function DashboardLive() {
  const { rooms } = useRooms();

  const stats = useMemo(() => {
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const available = rooms.filter((r) => r.status === "available").length;
    const dirty = rooms.filter((r) => r.status === "dirty").length;
    const maintenance = rooms.filter((r) => r.status === "maintenance").length;
    return { total: rooms.length, occupied, available, dirty, maintenance };
  }, [rooms]);

  return (
    <div className="metric-grid">
      <article className="metric-card">
        <p>Tổng số phòng (dữ liệu mock)</p>
        <strong>{stats.total}</strong>
        <span className="up"><i className="fa-solid fa-database"></i> Context</span>
      </article>
      <article className="metric-card">
        <p>Đang ở</p>
        <strong>{stats.occupied}</strong>
        <span className="up"><i className="fa-solid fa-bed"></i> realtime</span>
      </article>
      <article className="metric-card">
        <p>Phòng trống</p>
        <strong>{stats.available}</strong>
        <span className="down"><i className="fa-solid fa-door-open"></i> sẵn sàng</span>
      </article>
      <article className="metric-card">
        <p>Cần dọn / Bảo trì</p>
        <strong>{stats.dirty + stats.maintenance}</strong>
        <span className="up"><i className="fa-solid fa-broom"></i> vận hành</span>
      </article>
    </div>
  );
}
