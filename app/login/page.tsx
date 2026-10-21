"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, DEMO_ACCOUNTS, UserRole } from "@/lib/auth-context";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  School,
  Monitor,
  GraduationCap,
  KeyRound,
  AlertTriangle,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const { login, quickLogin, isLoading, user } = useAuth();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("123456");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Xử lý đăng nhập thủ công
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg("Vui lòng nhập Email hoặc MSSV!");
      return;
    }

    setIsSubmitting(true);
    const result = await login(identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setErrorMsg(result.message || "Đăng nhập thất bại!");
    }
  };

  // Đăng nhập nhanh bằng 1 click
  const handleQuickDemo = async (role: UserRole) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    await quickLogin(role);
    setIsSubmitting(false);
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-red-500 selection:text-white">
      {/* HEADER NHỎ */}
      <div className="w-full max-w-md mx-auto pt-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-bold tracking-wide shadow-2xs">
          <School className="h-4 w-4 text-red-600" />
          <span>KHOA CÔNG NGHỆ THÔNG TIN • ĐH VĂN LANG</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Hệ Thống Quản Lý &amp; Điểm Danh
        </h1>
        <p className="text-xs text-[#475569] font-medium">
          Đăng nhập để truy cập phân hệ quản trị hoặc điểm danh ca trực phòng Lab
        </p>
      </div>

      {/* KHỐI FORM ĐĂNG NHẬP CHÍNH */}
      <div className="w-full max-w-md mx-auto my-6">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* NÚT ĐĂNG NHẬP NHANH DEMO (ĐẶC BIỆT DÀNH CHO TEST) */}
          <div className="space-y-3 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Đăng nhập nhanh (Demo Role)
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Bấm 1 chạm</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Nút Demo 1: Admin */}
              <button
                type="button"
                onClick={() => handleQuickDemo("ADMIN")}
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-950 flex items-center gap-2">
                      Quản Trị Viên (Admin)
                      <span className="text-[10px] bg-red-200/80 text-red-900 px-1.5 py-0.2 rounded font-semibold">
                        Toàn quyền
                      </span>
                    </div>
                    <div className="text-[11px] text-red-700">ThS. Lý Thị Huyền Châu (GV001)</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-red-500 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Nút Demo 2: Student */}
              <button
                type="button"
                onClick={() => handleQuickDemo("STUDENT")}
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-950 flex items-center gap-2">
                      Sinh Viên Trực Lab
                      <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded font-semibold">
                        MSSV
                      </span>
                    </div>
                    <div className="text-[11px] text-blue-700">Nguyễn Thiện Đức (2373401010100)</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Nút Demo 3: Station */}
              <button
                type="button"
                onClick={() => handleQuickDemo("STATION")}
                disabled={isSubmitting}
                className="w-full p-3 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-purple-950 flex items-center gap-2">
                      Máy Trạm Cửa Lab
                      <span className="text-[10px] bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded font-semibold">
                        Kiosk
                      </span>
                    </div>
                    <div className="text-[11px] text-purple-700">Máy Trạm Phòng 5.18 (Tòa A)</div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* DÒNG PHÂN CÁCH HOẶC ĐĂNG NHẬP THỦ CÔNG */}
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase">
              Hoặc nhập tài khoản thủ công
            </span>
          </div>

          {/* FORM NHẬP TAY */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="font-semibold">{errorMsg}</div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                Email hoặc MSSV / Mã GV / Mã Trạm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="VD: 2373401010100 hoặc GV001"
                  className="w-full bg-white border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu mặc định: 123456"
                  className="w-full bg-white border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 transition shadow-2xs"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Mật khẩu thử nghiệm cho tất cả tài khoản: 123456</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all transform active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  ĐĂNG NHẬP HỆ THỐNG
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full max-w-md mx-auto text-center text-[11px] text-slate-400 pb-2">
        Phòng Lab 5.18, Tòa A, Cơ sở chính • Trường Đại học Văn Lang (CS3)
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
          <RefreshCw className="h-6 w-6 animate-spin text-red-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
