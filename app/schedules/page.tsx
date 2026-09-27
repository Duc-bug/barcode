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
                <CalendarIcon className="h-6 w-6 text-blue-400" />
                THỜI KHÓA BIỂU & PHÂN CÔNG TRỰC PHÒNG LAB
              </h1>
              <p className="text-xs text-slate-400">
                Khoa Công nghệ Thông tin • Lịch phân công trực phòng máy theo Tuần (Ca 1, Ca 2, Ca 3)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <Plus className="h-4 w-4" />
            Đăng ký / Phân công Ca trực
          </button>
        </header>

        {/* DANH SÁCH LỊCH TRỰC THEO THỜI GIAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((sch) => (
            <div
              key={sch.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-md hover:border-blue-500/40 transition"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {sch.shift.shiftName} ({sch.shift.startTime} - {sch.shift.endTime})
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sch.scheduleStatus === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : sch.scheduleStatus === "APPROVED"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-amber-500/20 text-amber-400"
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
                    className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Xóa lịch phân công"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  {sch.user.fullName}
                </div>
                <div className="text-xs text-slate-400 font-mono pl-6">
                  MSSV: {sch.user.studentCode}
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phòng Lab:</span>
                  <span className="text-white font-medium">{sch.labRoom.labCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngày trực:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {new Date(sch.dutyDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {sch.note && (
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-850">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">ĐĂNG KÝ / PHÂN CÔNG CA TRỰC MỚI</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Sinh viên trực:</label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {students.map((sv) => (
                    <option key={sv.id} value={sv.id}>
                      {sv.fullName} ({sv.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Phòng Lab phân công:</label>
                <select
                  value={newLabId}
                  onChange={(e) => setNewLabId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
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
                  <label className="text-slate-400 block mb-1">Khung ca trực:</label>
                  <select
                    value={newShiftId}
                    onChange={(e) => setNewShiftId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {shifts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shiftName} ({s.startTime} - {s.endTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Ngày trực:</label>
                  <input
                    type="date"
                    value={newDutyDate}
                    onChange={(e) => setNewDutyDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ghi chú phân công:</label>
                <input
                  type="text"
                  placeholder="VD: Kiểm tra mạng đầu giờ..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
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
