"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { soundFX } from "@/lib/audio";
import {
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Laptop,
  Clock,
  ArrowRight,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCw,
  Home,
} from "lucide-react";

function MobileCheckInContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const labCode = searchParams.get("lab") || "LAB-A518";

  const [studentCode, setStudentCode] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Nạp MSSV đã lưu từ LocalStorage nếu có
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem("vlu_saved_student_code");
      if (savedCode) {
        setStudentCode(savedCode);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) {
      setErrorMsg("Vui lòng nhập Mã số sinh viên (MSSV) của bạn!");
      return;
    }

    if (!token) {
      setErrorMsg("Không tìm thấy mã phiên QR hợp lệ! Vui lòng quét lại mã QR trên màn hình phòng Lab.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setResult(null);

    // Lưu MSSV nếu sinh viên tick nhớ
    if (rememberMe) {
      try {
        localStorage.setItem("vlu_saved_student_code", studentCode.trim());
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/qr/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          studentCode: studentCode.trim(),
          clientNote: "Mobile Browser Check-in",
        }),
      });

      const data = await res.json();

      if (!data.success) {
        soundFX.playWarning();
        setErrorMsg(data.message || "Xác thực thất bại!");
        return;
      }

      // Phát âm thanh tương ứng
      if (data.action === "CHECK_IN") {
        soundFX.playCheckIn();
      } else {
        soundFX.playCheckOut();
      }

      setResult(data);
    } catch (err: any) {
      soundFX.playWarning();
      setErrorMsg("Không thể kết nối đến máy chủ: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col items-center justify-between p-4 sm:p-6 font-sans">
      {/* HEADER DI ĐỘNG */}
      <div className="w-full max-w-md pt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-100 shadow-2xs">
            <span>🏫</span>
            <span>ĐẠI HỌC VĂN LANG</span>
          </div>

          <Link
            href="/"
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-gray-900 text-xs flex items-center gap-1 shadow-2xs"
            title="Trang chủ"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-red-600" />
            Điểm Danh Ca Trực Phòng LAB
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Xác thực thông qua Dynamic QR Code • Phòng 5.18 Tòa A
          </p>
        </div>
      </div>

      {/* THẺ FORM CHÍNH */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
          {/* VỊ TRÍ PHÒNG LAB */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 flex items-center gap-3 text-xs">
            <div className="p-2 rounded-xl bg-white text-emerald-600 border border-gray-200 shadow-2xs">
              <Laptop className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Vị trí điểm danh:</div>
              <div className="font-extrabold text-slate-900 text-sm">
                Phòng 5.18 - Lầu 5, Tòa A
              </div>
              <div className="text-[11px] text-slate-500">Cơ sở chính (CS3) Trường ĐH Văn Lang</div>
            </div>
          </div>

          {/* HIỂN THỊ KẾT QUẢ THÀNH CÔNG */}
          {result ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  result.action === "CHECK_IN"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-blue-50 border-blue-200 text-blue-900"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    result.action === "CHECK_IN" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-base flex items-center gap-1.5">
                    {result.action === "CHECK_IN" ? (
                      <>
                        <LogIn className="h-4 w-4" /> CHECK-IN THÀNH CÔNG
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4" /> CHECK-OUT THÀNH CÔNG
                      </>
                    )}
                  </div>
                  <div className="text-xs font-semibold">{result.message}</div>
                </div>
              </div>

              {/* Chi tiết sinh viên */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2.5">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Sinh viên:</span>
                  <span className="font-bold text-slate-900 text-sm">{result.data.studentName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 font-mono">
                  <span className="text-gray-500 font-sans">MSSV:</span>
                  <span className="font-bold text-slate-800">{result.data.studentCode}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 font-mono">
                  <span className="text-gray-500 font-sans">Giờ Check-in:</span>
                  <span className="font-bold text-emerald-700">
                    {new Date(result.data.checkInTime).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
                {result.data.checkOutTime && (
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 font-mono">
                    <span className="text-gray-500 font-sans">Giờ Check-out:</span>
                    <span className="font-bold text-blue-700">
                      {new Date(result.data.checkOutTime).toLocaleTimeString("vi-VN")}
                    </span>
                  </div>
                )}
                {result.data.durationText && (
                  <div className="flex justify-between items-center pt-1 font-mono">
                    <span className="text-gray-500 font-sans">Tổng thời gian:</span>
                    <span className="font-bold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded text-xs">
                      {result.data.durationText}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setResult(null)}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs transition"
              >
                Thực hiện lượt quét khác
              </button>
            </div>
          ) : (
            /* FORM NHẬP THÔNG TIN VÀ NÚT BẤM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Không thể điểm danh!</div>
                    <div className="mt-0.5 text-[11px] leading-relaxed">{errorMsg}</div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                  Mã Số Sinh Viên (MSSV) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Nhập MSSV (VD: 2373401010100)"
                  className="w-full bg-white border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 placeholder:text-gray-400 placeholder:font-sans placeholder:font-normal transition shadow-2xs"
                />
              </div>

              {/* Lựa chọn ghi nhớ MSSV */}
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                />
                <label htmlFor="remember" className="select-none font-medium cursor-pointer">
                  Ghi nhớ MSSV cho các ca trực sau
                </label>
              </div>

              {/* Tag mẫu nhanh nếu là SV test */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] text-gray-400">Chọn nhanh:</span>
                <button
                  type="button"
                  onClick={() => setStudentCode("2373401010100")}
                  className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-full text-[11px] font-semibold"
                >
                  Nguyễn Thiện Đức
                </button>
                <button
                  type="button"
                  onClick={() => setStudentCode("2174802010788")}
                  className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-[11px] font-semibold"
                >
                  Nguyễn Bảo Thiên
                </button>
              </div>

              {/* NÚT XÁC NHẬN ĐIỂM DANH */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all transform active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang xử lý điểm danh...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    XÁC NHẬN ĐIỂM DANH NGAY
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER DI ĐỘNG */}
      <footer className="w-full max-w-md pb-2 text-center text-[11px] text-slate-400">
        Khoa Công nghệ Thông tin • Trường Đại học Văn Lang (CS3)
      </footer>
    </div>
  );
}

export default function MobileCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <RefreshCw className="h-5 w-5 animate-spin text-red-600" />
            Đang tải dữ liệu điểm danh...
          </div>
        </div>
      }
    >
      <MobileCheckInContent />
    </Suspense>
  );
}
