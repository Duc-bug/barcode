import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "VLU Lab Barcode System | Quản lý & Điểm danh trực phòng LAB Khoa CNTT",
  description:
    "Đề cương Đồ án tốt nghiệp: Xây dựng website quản lý và điểm danh trực phòng LAB Khoa CNTT bằng Barcode - Trường Đại học Văn Lang",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
