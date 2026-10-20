"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Plus,
  Clock,
  User,
  Laptop,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newUserId, setNewUserId] = useState("");
  const [newLabId, setNewLabId] = useState("");
  const [newShiftId, setNewShiftId] = useState("");
  const [newDutyDate, setNewDutyDate] = useState(new Date().toISOString().slice(0, 10));
  const [newNote, setNewNote] = useState("");

  const loadSchedules = async () => {
    try {
      const res = await fetch("/api/schedules");
      const json = await res.json();
      if (json.success) {
        setSchedules(json.schedules || []);
        setLabs(json.labs || []);
        setShifts(json.shifts || []);
        setStudents(json.students || []);

        if (json.students?.length > 0 && !newUserId) setNewUserId(json.students[0].id);
        if (json.labs?.length > 0 && !newLabId) setNewLabId(json.labs[0].id);
        if (json.shifts?.length > 0 && !newShiftId) setNewShiftId(json.shifts[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUserId,
          labId: newLabId,
          shiftId: newShiftId,
          dutyDate: newDutyDate,
          note: newNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewNote("");
        loadSchedules();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: any) {
      alert("Lỗi kết nối: " + err.message);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch phân công này?")) return;
    try {
      const res = await fetch(`/api/schedules?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadSchedules();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: any) {
      alert("Lỗi kết nối: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 shadow-sm transition"
              title="Về Trang Chủ"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
                THỜI KHÓA BIỂU & PHÂN CÔNG TRỰC PHÒNG LAB
              </h1>
              <p className="text-xs text-gray-500">
                Khoa Công nghệ Thông tin • Lịch phân công trực phòng máy theo Tuần (Ca 1, Ca 2, Ca 3)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Đăng ký / Phân công Ca trực
          </button>
        </header>

        {/* DANH SÁCH LỊCH TRỰC THEO THỜI GIAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedules.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3.5 shadow-sm hover:border-blue-400 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {sch.shift.shiftName} ({sch.shift.startTime} - {sch.shift.endTime})
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      sch.scheduleStatus === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : sch.scheduleStatus === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {sch.scheduleStatus === "COMPLETED"
                      ? "Đã hoàn thành"
                      : sch.scheduleStatus === "APPROVED"
                      ? "Đã duyệt"
                      : sch.scheduleStatus}
                  </span>
                  <button
                    onClick={() => handleDeleteSchedule(sch.id)}
                    className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded transition"
                    title="Xóa lịch phân công"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  {sch.user.fullName}
                </div>
                <div className="text-xs text-gray-500 font-mono pl-6">
                  MSSV: <span className="font-semibold text-gray-700">{sch.user.studentCode}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phòng Lab:</span>
                  <span className="text-gray-900 font-semibold">{sch.labRoom.labCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày trực:</span>
                  <span className="text-blue-700 font-mono font-bold">
                    {new Date(sch.dutyDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {sch.note && (
                  <div className="text-[11px] text-gray-500 pt-1.5 border-t border-gray-200">
                    Ghi chú: {sch.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PHÂN CÔNG CA TRỰC MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">ĐĂNG KÝ / PHÂN CÔNG CA TRỰC MỚI</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Sinh viên trực:</label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {students.map((sv) => (
                    <option key={sv.id} value={sv.id}>
                      {sv.fullName} ({sv.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Phòng Lab phân công:</label>
                <select
                  value={newLabId}
                  onChange={(e) => setNewLabId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                >
                  {labs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.labCode} - {l.labName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700 font-medium block mb-1">Khung ca trực:</label>
                  <select
                    value={newShiftId}
                    onChange={(e) => setNewShiftId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shiftName} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-700 font-medium block mb-1">Ngày trực:</label>
                  <input
                    type="date"
                    value={newDutyDate}
                    onChange={(e) => setNewDutyDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Ghi chú phân công:</label>
                <input
                  type="text"
                  placeholder="VD: Kiểm tra mạng đầu giờ..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-sm"
                >
                  Lưu phân công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
