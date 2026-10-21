import Link from "next/link";
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
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans relative selection:bg-red-500 selection:text-white">
      {/* 1. HERO SECTION (NỀN TRẮNG TINH KHIẾT VỚI HIỆU ỨNG CHIỀU SÂU HIỆN ĐẠI) */}
      <header className="bg-white border-b border-gray-100 px-6 pt-12 pb-16 sm:pt-16 sm:pb-20 text-center relative overflow-hidden">
        {/* Vệt sáng gradient nhẹ phía sau tạo chiều sâu */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-red-100/40 via-orange-100/30 to-amber-100/40 blur-[110px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Nhãn trường học ở trên cùng */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold tracking-wide shadow-2xs">
            <span>🏫</span>
            <span>KHOA CÔNG NGHỆ THÔNG TIN • TRƯỜNG ĐẠI HỌC VĂN LANG</span>
          </div>

          {/* Tiêu đề chính */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] leading-[1.18]">
            Hệ thống Quản lý &amp; Điểm danh phòng LAB bằng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-orange-500">
              Barcode &amp; Mã QR
            </span>
          </h1>

          {/* Dòng mô tả phụ */}
          <p className="text-base sm:text-lg text-[#475569] max-w-3xl mx-auto leading-relaxed font-normal">
            Hệ thống quản lý thiết bị và điểm danh ca trực phòng máy cho sinh viên Khoa Công nghệ Thông tin, hỗ trợ quét mã vạch thẻ sinh viên và quét mã QR.
          </p>

          {/* HÀNG NÚT BẤM (BUTTONS HÀNH ĐỘNG RIÊNG BIỆT) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            {/* Phân hệ 1: Điểm danh Barcode thẻ */}
            <Link
              href="/scan-station"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-red-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="h-4 w-4" />
              <span>⚡ Điểm Danh Thẻ Barcode</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Phân hệ 2: Điểm danh bằng Mã QR */}
            <Link
              href="/qr-station"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <QrCode className="h-4 w-4" />
              <span>📱 Điểm Danh Bằng Mã QR</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Phân hệ 3: Quản lý thiết bị */}
            <Link
              href="/equipments"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#0F172A] border border-gray-200 font-bold text-sm flex items-center gap-2 shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              <span>Quản lý Thiết bị &amp; In Tem</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. KHU VỰC CÁC PHÂN HỆ CHỨC NĂNG (NỀN XÁM NHẠT #F8F9FA) */}
      <section className="bg-[#F8F9FA] border-t border-gray-200/80 flex-1 py-14 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header phân khu */}
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span>🎯</span>
              CÁC PHÂN HỆ CHỨC NĂNG HỆ THỐNG
            </h2>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              Toàn bộ các phân hệ được thiết kế chặt chẽ phục vụ quản lý và vận hành phòng LAB
            </p>
          </div>

          {/* LƯỚI THẺ CHỨC NĂNG (CARDS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Thẻ 1: Trạm Điểm danh Barcode (Thẻ vật lý) */}
            <Link
              href="/scan-station"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-2xs">
                  <Zap className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-red-600 transition-colors">
                  1. Trạm Điểm danh Barcode (Thẻ SV)
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Ghi nhận ca trực nhanh chóng qua đầu đọc mã vạch hoặc camera quét thẻ sinh viên tại phòng Lab.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-600">
                <span>Mở trạm quét thẻ →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 2: Điểm Danh Bằng Mã QR */}
            <Link
              href="/qr-station"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-2xs">
                  <QrCode className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-purple-600 transition-colors">
                  2. Điểm Danh Bằng Mã QR
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Màn hình hiển thị mã QR tại phòng Lab. Sinh viên sử dụng điện thoại quét mã để ghi nhận giờ vào và giờ ra ca trực.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Mở trạm quét QR →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 3: Thiết bị & In nhãn Barcode */}
            <Link
              href="/equipments"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-2xs">
                  <Barcode className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-amber-600 transition-colors">
                  3. Thiết bị &amp; In nhãn Barcode
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Cấp phát và quản lý mã vạch Code 128 (EQ-LAB801-PCxx) hàng loạt cho máy tính, thiết bị phòng Lab. Hỗ trợ in nhanh ra giấy decal A4 để dán trực tiếp.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Xem &amp; In tem →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 4: Lịch trực & Phân công */}
            <Link
              href="/schedules"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shadow-2xs">
                  <Calendar className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                  4. Lịch trực &amp; Phân công
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Sắp xếp lịch trực phòng máy theo tuần (Thứ 2 - Thứ 7), chia theo các Ca 1, Ca 2, Ca 3. Sinh viên chủ động đăng ký trực tuyến và được duyệt tự động.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Xem thời khóa biểu →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 5: Báo cáo sự cố phòng Lab (Hàng thẻ lấp ló phía dưới) */}
            <Link
              href="/incidents"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between group opacity-90 hover:opacity-100"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-2xs">
                  <AlertTriangle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-rose-600 transition-colors">
                  5. Quản lý Sự cố Thiết bị
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Theo dõi các máy tính báo hỏng từ ca trực bằng Smart Barcode Router, quản lý tiến độ sửa chữa thiết bị.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>Danh sách sự cố →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 6: Dashboard & Xuất Excel */}
            <Link
              href="/dashboard"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group opacity-90 hover:opacity-100"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-2xs">
                  <BarChart3 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-emerald-600 transition-colors">
                  6. Dashboard &amp; Xuất Excel
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Biểu đồ thống kê số giờ trực, tỷ lệ đi đúng giờ / trễ và tính năng xuất file bảng chấm công Excel (SheetJS).
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Xem báo cáo →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Thẻ 7: Quản lý Hồ sơ Sinh viên & In thẻ Barcode */}
            <Link
              href="/users"
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col justify-between group opacity-90 hover:opacity-100"
            >
              <div className="space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-2xs">
                  <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-purple-600 transition-colors">
                  7. Hồ sơ SV &amp; Thẻ Barcode
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Quản lý danh sách sinh viên thực tế, thêm sinh viên mới và in tem Barcode thẻ SV phục vụ quét điểm danh.
                </p>
              </div>
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Quản lý hồ sơ →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Nhãn mờ "localhost:3000/scan-station" ở góc dưới cùng bên trái */}
      <div className="fixed bottom-3 left-4 text-[11px] font-mono text-slate-400 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-gray-200/80 shadow-2xs pointer-events-none select-none z-20">
        localhost:3000/scan-station
      </div>
    </div>
  );
}
