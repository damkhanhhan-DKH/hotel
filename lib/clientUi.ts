"use client";

export function showToast(message: string) {
  if (typeof document === "undefined") return;
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2100);
}

export function navigateHotelPage(pageId: string) {
  const fn = (window as unknown as { __hotelSetPage?: (id: string) => void }).__hotelSetPage;
  if (fn) fn(pageId);
}
