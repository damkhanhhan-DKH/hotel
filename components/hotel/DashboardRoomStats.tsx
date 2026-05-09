"use client";

import { useMemo } from "react";
import { useRooms } from "@/hooks/useHotelData";

export default function DashboardRoomStats() {
  const { rooms } = useRooms();
  const stats = useMemo(() => {
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const available = rooms.filter((r) => r.status === "available").length;
    const dirty = rooms.filter((r) => r.status === "dirty").length;
    const maintenance = rooms.filter((r) => r.status === "maintenance").length;
    return { occupied, available, dirty, maintenance };
  }, [rooms]);

  return (
    <ul className="simple-list">
      <li>
        <span>Đang ở</span>
        <strong>{stats.occupied}</strong>
      </li>
      <li>
        <span>Trống sạch</span>
        <strong>{stats.available}</strong>
      </li>
      <li>
        <span>Cần dọn</span>
        <strong>{stats.dirty}</strong>
      </li>
      <li>
        <span>Bảo trì</span>
        <strong>{stats.maintenance}</strong>
      </li>
    </ul>
  );
}
