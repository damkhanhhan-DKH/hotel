import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BookingDraftProvider } from "@/context/BookingDraftContext";
import { HotelProvider } from "@/context/HotelContext";
import "./globals.css";

/** Inter + tiếng Việt — hiển thị ổn định thay cho Geist (thiếu glyph đầy đủ cho VI). */
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luxury Hotel Manager",
  description: "Hotel management web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <HotelProvider>
          <BookingDraftProvider>{children}</BookingDraftProvider>
        </HotelProvider>
      </body>
    </html>
  );
}
