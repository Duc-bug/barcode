"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import {
  Zap,
  QrCode,
  Calendar,
  Barcode,
  BarChart3,
  AlertTriangle,
  Users,
  ArrowRight,
  Sparkles,
  Lock,
  LogIn,
  ShieldCheck,
  GraduationCap,
  Monitor,
  Laptop,
} from "lucide-react";

export default function HomePage() {
  const { user, role, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative selection:bg-red-500 selection:text-white">
      {/* 1. NAVBAR DÙNG CHUNG CÓ PHÂN QUYỀN */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <header className="bg-white border-b border-gray-100 px-6 pt-10 pb-14 sm:pt-14 sm:pb-16 text-center relative overflow-hidden">
        {/* Vệt sáng gradient nhẹ phía sau */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-red-100/40 via-orange-100/30 to-amber-100/40 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-5">
          {/* Nhãn trường học */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold tracking-wide shadow-2xs">
            <span>🏫</span>
            <span>KHOA CÔNG NGHỆ THÔNG TIN • TRƯỜNG ĐẠI HỌC VĂN LANG</span>
          </div>

          {/* Tiêu đề chính */}
          <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold tracking-tight text-[#0F172A] leading-[1.18]">
            Hệ thống Quản lý &amp; Điểm danh phòng LAB bằng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-orange-500">
              Barcode &amp; Mã QR
            </span>
          </h1>

          {/* Mô tả phụ tùy theo trạng thái */}
          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto leading-relaxed font-normal">
            {!user
              ? "Hệ thống quản lý thiết bị và điểm danh ca trực phòng máy cho sinh viên Khoa CNTT. Vui lòng đăng nhập để truy cập đúng quyền hạn."
              : role === "ADMIN"
              ? "Bảng điều khiển Quản trị viên: Quản lý trạm điểm danh, lịch trực, thiết bị và xuất báo cáo toàn hệ thống."
              : role === "STUDENT"
              ? `Chào bạn, ${user.fullName} (${user.studentCode})! Bạn có thể quét mã QR điểm danh, đăng ký ca trực và báo cáo sự cố.`
              : "Chế độ Máy trạm Cửa Lab: Sẵn sàng vận hành trạm quét thẻ Barcode và màn hình chiếu mã QR."}
          </p>

          {/* HÀNG NÚT BẤM ĐIỀU HƯỚNG TÙY BIẾN THEO ROLE */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!user ? (
              /* Chưa đăng nhập */
              <Link
                href="/login"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogIn className="h-4 w-4" />
                <span>ĐĂNG NHẬP ĐỂ SỬ DỤNG HỆ THỐNG</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : role === "ADMIN" ? (
              /* ADMIN: Đầy đủ các nút */
              <>
                <Link
                  href="/scan-station"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Zap className="h-4 w-4" />
                  <span>⚡ Mở Trạm Quét Thẻ Barcode</span>
                </Link>
                <Link
                  href="/qr-station"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <QrCode className="h-4 w-4" />
                  <span>📱 Mở Trạm Chiếu Mã QR</span>
                </Link>
                <Link
                  href="/schedules"
                  className="px-5 py-3 rounded-xl bg-white hover:bg-gray-50 text-[#0F172A] border border-gray-200 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Lịch Trực Phòng Lab</span>
                </Link>
              </>
            ) : role === "STUDENT" ? (
              /* STUDENT: Nút quét QR và Lịch trực */
              <>
                <Link
                  href="/mobile-checkin"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <QrCode className="h-4 w-4" />
                  <span>📱 Điểm Danh Ca Trực (Quét QR)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/schedules"
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#0F172A] border border-gray-200 font-bold text-xs flex items-center gap-2 shadow-2xs transition-all"
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Đăng Ký &amp; Xem Lịch Trực Của Tôi</span>
                </Link>
              </>
            ) : (
              /* STATION: 2 nút mở Kiosk tại phòng máy */
              <>
                <Link
                  href="/scan-station"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-red-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Zap className="h-4 w-4" />
                  <span>⚡ Mở Trạm Quét Thẻ Barcode</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/qr-station"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  <QrCode className="h-4 w-4" />
                  <span>📱 Mở Màn Hình Chiếu Mã QR</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. KHU VỰC CÁC PHÂN HỆ CHỨC NĂNG (RBAC FILTERED) */}
      <section className="bg-[#F8F9FA] border-t border-gray-200/80 flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header phân khu */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
                <span>🎯</span>
                {role === "STUDENT"
                  ? "CÁC CHỨC NĂNG DÀNH CHO SINH VIÊN TRỰC LAB"
                  : role === "STATION"
                  ? "CHỨC NĂNG VẬN HÀNH MÁY TRẠM PHÒNG LAB"
                  : "CÁC PHÂN HỆ CHỨC NĂNG HỆ THỐNG"}
              </h2>
              <p className="text-xs text-[#475569] mt-0.5 font-medium">
                {!user
                  ? "Đăng nhập để mở khóa các phân hệ theo vai trò của bạn"
                  : `Đang truy cập với vai trò: ${
                      role === "ADMIN" ? "Quản trị viên (Toàn quyền)" : role === "STUDENT" ? "Sinh viên" : "Máy trạm Kiosk"
                    }`}
              </p>
            </div>

            {user && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-slate-700 shadow-2xs">
                Vai trò: {role}
              </span>
            )}
          </div>

          {/* LƯỚI THẺ CHỨC NĂNG TÙY BIẾN THEO QUYỀN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* ------------------------------------------------------------- */}
            {/* TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP -> HIỂN THỊ KHÓA TOÀN BỘ 7 THẺ */}
            {/* ------------------------------------------------------------- */}
            {!user && (
              <>
                <LockedCard
                  title="1. Trạm Điểm Danh Barcode"
                  desc="Tự động ghi nhận ca trực thông qua máy quét thẻ sinh viên Code 128 tại phòng Lab."
                  icon={<Zap className="h-6 w-6 text-red-500" />}
                />
                <LockedCard
                  title="2. Điểm Danh Bằng Mã QR"
                  desc="Màn hình hiển thị mã QR tại phòng máy và camera quét điểm danh trên điện thoại."
                  icon={<QrCode className="h-6 w-6 text-purple-500" />}
                />
                <LockedCard
                  title="3. Thiết Bị & In Nhãn Barcode"
                  desc="Quản lý mã vạch Code 128 máy tính phòng Lab và in tem decal A4 dán thiết bị."
                  icon={<Barcode className="h-6 w-6 text-amber-500" />}
                />
                <LockedCard
                  title="4. Lịch Trực & Phân Công"
                  desc="Sắp xếp lịch trực phòng máy theo tuần (Ca 1, Ca 2, Ca 3) và đăng ký ca trực."
                  icon={<Calendar className="h-6 w-6 text-blue-500" />}
                />
                <LockedCard
                  title="5. Quản Lý Sự Cố Thiết Bị"
                  desc="Theo dõi các máy tính báo hỏng bằng mã vạch và quản lý tiến độ sửa chữa."
                  icon={<AlertTriangle className="h-6 w-6 text-rose-500" />}
                />
                <LockedCard
                  title="6. Dashboard & Xuất Excel"
                  desc="Biểu đồ thống kê số giờ trực, tỷ lệ đi đúng giờ và xuất file bảng chấm công."
                  icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
                />
                <LockedCard
                  title="7. Hồ Sơ SV & Thẻ Barcode"
                  desc="Quản lý hồ sơ sinh viên, thông tin thẻ sinh viên và in tem thẻ phục vụ quét."
                  icon={<Users className="h-6 w-6 text-indigo-500" />}
                />
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TRƯỜNG HỢP 2: ADMIN -> HIỂN THỊ ĐẦY ĐỦ 7 PHÂN HỆ */}
            {/* ------------------------------------------------------------- */}
            {user && role === "ADMIN" && (
              <>
                {/* 1. Trạm Barcode */}
                <FeatureCard
                  href="/scan-station"
                  title="1. Trạm Điểm danh Barcode"
                  desc="Mở trạm quét mã vạch thẻ sinh viên Code 128. Tích hợp camera chụp ảnh tức thì."
                  badge="Toàn quyền"
                  btnText="Mở trạm quét thẻ →"
                  colorClass="text-red-600 border-red-100 bg-rose-50"
                  icon={<Zap className="h-6 w-6" />}
                />

                {/* 2. Trạm QR */}
                <FeatureCard
                  href="/qr-station"
                  title="2. Trạm Điểm danh Mã QR"
                  desc="Màn hình chiếu mã QR tự động làm mới mỗi 20 giây và bảng theo dõi sinh viên hôm nay."
                  badge="Kiosk / Máy chiếu"
                  btnText="Mở màn hình chiếu QR →"
                  colorClass="text-purple-600 border-purple-100 bg-purple-50"
                  icon={<QrCode className="h-6 w-6" />}
                />

                {/* 3. Thiết bị */}
                <FeatureCard
                  href="/equipments"
                  title="3. Thiết bị &amp; In nhãn Barcode"
                  desc="Cấp phát mã vạch Code 128 cho máy tính phòng Lab. Hỗ trợ in nhanh ra tem decal A4."
                  badge="Chỉ Admin"
                  btnText="Xem &amp; In tem →"
                  colorClass="text-amber-600 border-amber-100 bg-amber-50"
                  icon={<Barcode className="h-6 w-6" />}
                />

                {/* 4. Lịch trực */}
                <FeatureCard
                  href="/schedules"
                  title="4. Lịch trực &amp; Phân công"
                  desc="Quản lý, phân công và duyệt ca trực phòng máy theo tuần (Thứ 2 - Thứ 7, Ca 1, 2, 3)."
                  badge="Quản lý ca"
                  btnText="Quản lý lịch trực →"
                  colorClass="text-blue-600 border-blue-100 bg-blue-50"
                  icon={<Calendar className="h-6 w-6" />}
                />

                {/* 5. Sự cố */}
                <FeatureCard
                  href="/incidents"
                  title="5. Quản lý Sự cố Thiết bị"
                  desc="Xem toàn bộ danh sách máy tính báo hỏng từ phòng Lab, cập nhật tiến độ sửa chữa."
                  badge="Bảo trì"
                  btnText="Xem sự cố thiết bị →"
                  colorClass="text-rose-600 border-rose-100 bg-rose-50"
                  icon={<AlertTriangle className="h-6 w-6" />}
                />

                {/* 6. Dashboard */}
                <FeatureCard
                  href="/dashboard"
                  title="6. Dashboard &amp; Xuất Excel"
                  desc="Biểu đồ thống kê số giờ trực của sinh viên và xuất file bảng chấm công Excel (SheetJS)."
                  badge="Báo cáo"
                  btnText="Mở Dashboard &amp; Xuất Excel →"
                  colorClass="text-emerald-600 border-emerald-100 bg-emerald-50"
                  icon={<BarChart3 className="h-6 w-6" />}
                />

                {/* 7. Hồ sơ SV */}
                <FeatureCard
                  href="/users"
                  title="7. Hồ sơ SV &amp; Thẻ Barcode"
                  desc="Quản lý danh sách sinh viên thực tế, thêm mới sinh viên và in tem thẻ Barcode hàng loạt."
                  badge="Quản lý SV"
                  btnText="Quản lý danh sách SV →"
                  colorClass="text-indigo-600 border-indigo-100 bg-indigo-50"
                  icon={<Users className="h-6 w-6" />}
                />
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TRƯỜNG HỢP 3: STUDENT -> CHỈ HIỆN CÁC CHỨC NĂNG DÀNH CHO SV */}
            {/* ------------------------------------------------------------- */}
            {user && role === "STUDENT" && (
              <>
                {/* 1. Điểm danh qua điện thoại */}
                <FeatureCard
                  href="/mobile-checkin"
                  title="1. Điểm Danh Ca Trực (Mã QR)"
                  desc="Mở camera điện thoại quét mã QR chiếu trên màn hình phòng Lab để Check-in / Check-out ca trực."
                  badge="Quét QR"
                  btnText="Mở màn hình điểm danh →"
                  colorClass="text-purple-600 border-purple-100 bg-purple-50"
                  icon={<QrCode className="h-6 w-6" />}
                />

                {/* 2. Đăng ký & Xem lịch trực */}
                <FeatureCard
                  href="/schedules"
                  title="2. Đăng Ký &amp; Lịch Trực Của Tôi"
                  desc="Xem lịch trực chung của phòng máy, đăng ký ca trực còn trống và theo dõi lịch cá nhân."
                  badge="Lịch trực"
                  btnText="Xem &amp; Đăng ký ca trực →"
                  colorClass="text-blue-600 border-blue-100 bg-blue-50"
                  icon={<Calendar className="h-6 w-6" />}
                />

                {/* 3. Báo hỏng thiết bị */}
                <FeatureCard
                  href="/incidents"
                  title="3. Báo Cáo Hỏng Thiết Bị"
                  desc="Quét mã vạch thiết bị máy tính gặp sự cố trong ca trực để báo cáo gửi lên quản trị viên."
                  badge="Báo hỏng"
                  btnText="Tạo báo cáo sự cố →"
                  colorClass="text-rose-600 border-rose-100 bg-rose-50"
                  icon={<AlertTriangle className="h-6 w-6" />}
                />

                {/* 4. Thống kê cá nhân */}
                <FeatureCard
                  href="/dashboard"
                  title="4. Thống Kê Giờ Trực Của Tôi"
                  desc="Xem tổng số giờ trực tích lũy trong tháng, lịch sử chấm công và tỷ lệ đúng giờ của bạn."
                  badge="Cá nhân"
                  btnText="Xem số giờ trực cá nhân →"
                  colorClass="text-emerald-600 border-emerald-100 bg-emerald-50"
                  icon={<BarChart3 className="h-6 w-6" />}
                />

                {/* 5. Thẻ barcode cá nhân */}
                <FeatureCard
                  href="/users"
                  title="5. Thẻ Barcode Của Tôi"
                  desc="Xem thẻ sinh viên điện tử kèm mã vạch Barcode Code 128 dùng để quét tại trạm phòng Lab."
                  badge="Thẻ SV"
                  btnText="Xem thẻ Barcode cá nhân →"
                  colorClass="text-indigo-600 border-indigo-100 bg-indigo-50"
                  icon={<Users className="h-6 w-6" />}
                />
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* TRƯỜNG HỢP 4: STATION -> MÁY TRẠM PHÒNG LAB */}
            {/* ------------------------------------------------------------- */}
            {user && role === "STATION" && (
              <>
                {/* 1. Mở trạm Barcode */}
                <FeatureCard
                  href="/scan-station"
                  title="1. Trạm Điểm danh Barcode"
                  desc="Màn hình quét mã vạch thẻ sinh viên tự động nhận diện qua máy quét USB hoặc webcam trạm."
                  badge="Máy trạm Kiosk"
                  btnText="Mở trạm quét thẻ Barcode →"
                  colorClass="text-red-600 border-red-100 bg-rose-50"
                  icon={<Zap className="h-6 w-6" />}
                />

                {/* 2. Mở màn hình chiếu QR */}
                <FeatureCard
                  href="/qr-station"
                  title="2. Màn Hình Chiếu Mã QR"
                  desc="Màn hình chiếu mã QR tự động làm mới mỗi 20s cho sinh viên quét từ xa khi vào ca."
                  badge="Chiếu TV / Projector"
                  btnText="Mở trạm chiếu mã QR →"
                  colorClass="text-purple-600 border-purple-100 bg-purple-50"
                  icon={<QrCode className="h-6 w-6" />}
                />

                {/* 3. Xem lịch trực phòng máy */}
                <FeatureCard
                  href="/schedules"
                  title="3. Lịch Trực Phòng Lab Hôm Nay"
                  desc="Tra cứu danh sách sinh viên được phân công ca trực hôm nay tại phòng máy này."
                  badge="Phòng 5.18"
                  btnText="Xem lịch trực phòng máy →"
                  colorClass="text-blue-600 border-blue-100 bg-blue-50"
                  icon={<Calendar className="h-6 w-6" />}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-500">
        <p className="font-semibold text-slate-800">
          Phòng Lab 5.18, Lầu 5, Tòa A, Cơ sở chính • Trường Đại học Văn Lang
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          Hệ thống Quản lý &amp; Điểm danh Phòng Lab bằng Barcode &amp; Mã QR • Khoa Công nghệ Thông tin
        </p>
      </footer>
    </div>
  );
}

// Component Thẻ chức năng hoạt động
function FeatureCard({
  href,
  title,
  desc,
  badge,
  btnText,
  icon,
  colorClass,
}: {
  href: string;
  title: string;
  desc: string;
  badge: string;
  btnText: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <Link
      href={href}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col justify-between group"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-2xs ${colorClass}`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            {badge}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-[#0F172A] group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[#334155] leading-relaxed font-normal">{desc}</p>
      </div>
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
        <span>{btnText}</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Component Thẻ bị khóa khi chưa đăng nhập
function LockedCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href="/login"
      className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-2xs opacity-75 hover:opacity-100 hover:border-red-200 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shadow-2xs">
            {icon}
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Lock className="h-2.5 w-2.5 text-amber-600" />
            Cần đăng nhập
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-700">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-normal">{desc}</p>
      </div>
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-red-600">
        <span>Đăng nhập để truy cập →</span>
        <Lock className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
