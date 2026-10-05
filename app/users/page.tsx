"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BarcodeLabel from "@/components/BarcodeLabel";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Search,
  Printer,
  Shield,
  GraduationCap,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Barcode as BarcodeIcon,
} from "lucide-react";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBarcodeUser, setSelectedBarcodeUser] = useState<any>(null);

  // Form states
  const [studentCode, setStudentCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentCode, fullName, email, phone, role }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setStudentCode("");
        setFullName("");
        setEmail("");
        setPhone("");
        loadUsers();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: any) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.studentCode.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-red-500" />
                DANH SÁCH GIẢNG VIÊN & SINH VIÊN TRỰC PHÒNG LAB
              </h1>
              <p className="text-xs text-slate-400">
                Khoa Công nghệ Thông tin - Trường Đại học Văn Lang • Quản lý hồ sơ thật và in thẻ Barcode tạm
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
          >
            <UserPlus className="h-4 w-4" />
            Thêm Sinh viên / Giảng viên Mới
          </button>
        </header>

        {/* SEARCH */}
        <div className="flex items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo MSSV, Họ và tên hoặc Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* USERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3.5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      u.role === "ADMIN"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {u.role === "ADMIN" ? (
                      <>
                        <Shield className="h-3 w-3" /> Giảng viên / Quản lý
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-3 w-3" /> Sinh viên trực Lab
                      </>
                    )}
                  </span>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Hoạt động
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{u.fullName}</h3>
                  <div className="text-xs text-red-400 font-mono font-bold mt-0.5">
                    Mã thẻ / MSSV: {u.studentCode}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION: IN TEM BARCODE THẺ SV */}
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedBarcodeUser(u)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <BarcodeIcon className="h-4 w-4 text-red-400" />
                  Xem / In Tem Barcode Thẻ ({u.studentCode})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL THÊM NGƯỜI DÙNG THẬT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">THÊM HỒ SƠ SINH VIÊN / GIẢNG VIÊN</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Mã số sinh viên (MSSV) hoặc Mã GV:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 2373401010100 (In trên thẻ SV)"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Họ và tên đầy đủ:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Thiện Đức"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email trường Văn Lang:</label>
                <input
                  type="email"
                  required
                  placeholder="VD: duc.2373401010100@vanlanguni.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    placeholder="VD: 0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Vai trò:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="STUDENT">Sinh viên trực Lab</option>
                    <option value="ADMIN">Giảng viên / Quản lý</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu vào hệ thống"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IN TEM BARCODE THẺ SV */}
      {selectedBarcodeUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col items-center">
            <h3 className="text-sm font-bold text-white mb-1">TEM BARCODE THẺ SINH VIÊN VLU</h3>
            <p className="text-xs text-slate-400 mb-4">Chuẩn mã vạch Code 128 dùng quét điểm danh</p>

            <div className="bg-white p-3 rounded-xl shadow-lg my-2">
              <BarcodeLabel
                value={selectedBarcodeUser.studentCode}
                title={selectedBarcodeUser.fullName}
                subtitle="TRƯỜNG ĐẠI HỌC VĂN LANG"
                footerText="THẺ SINH VIÊN TRỰC PHÒNG LAB"
              />
            </div>

            <div className="flex gap-3 mt-5 w-full">
              <button
                onClick={() => setSelectedBarcodeUser(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                In tem thẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
