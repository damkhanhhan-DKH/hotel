import type { BookingStatus } from "@/types/hotel";

export function BookingStatusTag({ status }: { status: BookingStatus }) {
  if (status === "Đã xác nhận") return <span className="tag green">Đã xác nhận</span>;
  if (status === "Đã check-in") return <span className="tag blue">Đã check-in</span>;
  return <span className="tag yellow">Chờ xử lý</span>;
}
