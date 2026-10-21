"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LogOut,
  LogIn,
  User,
  School,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-2xs font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO & TIÊU ĐỀ */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-orange-500 text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:scale-105 transition-transform">
            VLU
          </div>
          <div>
            <div className="text-xs font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors uppercase">
              Lab Duty &amp; Barcode
            </div>
            <div className="text-[10px] text-gray-500 font-medium hidden sm:block">
              Khoa CNTT • Trường ĐH Văn Lang
            </div>
          </div>
        </Link>

        {/* THÔNG TIN NGƯỜI DÙNG & VAI TRÒ HOẶC NÚT ĐĂNG NHẬP */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Badge Vai trò */}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {user.studentCode}
                  </div>
                </div>
              </div>

              {/* Nút Đăng xuất */}
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-red-600/20 transition-all"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
