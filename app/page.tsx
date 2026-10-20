import Link from "next/link";
import {
  Zap,
  Calendar,
  Barcode,
  BarChart3,
  AlertTriangle,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* 1. HERO SECTION (NỀN TRẮNG TINH KHIẾT) */}
      <header className="bg-white border-b border-gray-100 px-6 py-14 sm:py-20 text-center relative overflow-hidden">
        {/* Hiệu ứng ánh sáng đỏ cực nhẹ phía sau */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-red-100/50 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Website Quản lý & Điểm danh phòng LAB bằng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
              Barcode
            </span>
          </h1>

          {/* HÀNG NÚT BẤM (BUTTONS) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/scan-station"
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-red-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="h-4 w-4" />
              Mở Trạm Quét Kiosk Điểm Danh
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/equipments"
              className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-semibold text-sm flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Barcode className="h-4 w-4 text-red-600" />
              Quản lý Thiết bị & In Tem A4
            </Link>
          </div>
        </div>
      </header>

      {/* 2. KHU VỰC CÁC PHÂN HỆ CHỨC NĂNG (NỀN XÁM NHẠT #F8F9FA) */}
      <section className="bg-gray-50 border-t border-gray-100 flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              CÁC PHÂN HỆ CHỨC NĂNG HỆ THỐNG
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống quản lý điểm danh và thiết bị phòng máy thực hành
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Module 1: Scan Station Kiosk */}
            <Link
              href="/scan-station"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  1. Trạm Điểm danh Kiosk
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tích hợp súng quét mã USB HID, camera quét trực tiếp, thuật toán chống gian lận và chụp ảnh khuôn mặt tức thì.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-red-600">
                <span>Mở trạm quét</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 2: Quản lý thiết bị & In nhãn */}
            <Link
              href="/equipments"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Barcode className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  2. Thiết bị & In nhãn Barcode
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tạo nhãn mã vạch Code 128 (EQ-LAB801-PCxx) hàng loạt cho phòng máy, hỗ trợ in ra giấy A4 decal dán lên máy tính.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                <span>Xem & In tem</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 3: Lịch phân công trực */}
            <Link
              href="/schedules"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  3. Lịch trực & Phân công
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Lịch biểu dạng thời khóa biểu tuần (Thứ 2 - Thứ 7), chia theo Ca 1, Ca 2, Ca 3. Sinh viên đăng ký và Admin phê duyệt.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Xem thời khóa biểu</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 4: Báo cáo sự cố phòng Lab */}
            <Link
              href="/incidents"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                  4. Quản lý Sự cố Thiết bị
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Theo dõi các máy tính báo hỏng từ ca trực bằng Smart Barcode Router, quản lý tiến độ sửa chữa thiết bị.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-rose-600">
                <span>Danh sách sự cố</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 5: Thống kê & Xuất Excel */}
            <Link
              href="/dashboard"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  5. Dashboard & Xuất Excel
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Biểu đồ thống kê số giờ trực, tỷ lệ đi đúng giờ / trễ và tính năng xuất file bảng chấm công Excel (SheetJS).
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span>Xem báo cáo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 6: Quản lý Hồ sơ Sinh viên & In thẻ Barcode */}
            <Link
              href="/users"
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  6. Hồ sơ SV & Thẻ Barcode
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Quản lý danh sách sinh viên thực tế, thêm sinh viên mới và in tem Barcode thẻ SV phục vụ quét điểm danh.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                <span>Quản lý hồ sơ</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
