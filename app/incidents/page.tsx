"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Laptop,
  Search,
  Filter,
  Wrench,
  User,
  Trash2,
} from "lucide-react";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/incidents");
      const json = await res.json();
      if (json.success) {
        setIncidents(json.incidents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, incidentStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        loadIncidents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa phiếu báo hỏng này?")) return;
    try {
      const res = await fetch(`/api/incidents?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadIncidents();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.equipment.equipmentBarcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "ALL" || inc.incidentStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

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
                <AlertTriangle className="h-6 w-6 text-rose-500" />
                QUẢN LÝ SỰ CỐ & BẢO TRÌ THIẾT BỊ PHÒNG LAB
              </h1>
              <p className="text-xs text-slate-400">
                Phiếu sự cố được ghi nhận tự động bằng Smart Barcode Router tại Trạm Quét Kiosk
              </p>
            </div>
          </div>
        </header>

        {/* 4 THẺ THỐNG KÊ SỰ CỐ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter("ALL")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "ALL"
                ? "bg-slate-800 border-slate-600 shadow-md"
                : "bg-slate-900 border-slate-800 hover:bg-slate-850"
            }`}
          >
            <div className="text-xs text-slate-400">Tổng phiếu sự cố</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">{incidents.length}</div>
          </div>

          <div
            onClick={() => setStatusFilter("OPEN")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "OPEN"
                ? "bg-rose-950/60 border-rose-500 shadow-md shadow-rose-900/30"
                : "bg-slate-900 border-slate-800 hover:bg-slate-850"
            }`}
          >
            <div className="text-xs text-rose-300">Chờ xử lý (OPEN)</div>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
              {incidents.filter((i) => i.incidentStatus === "OPEN").length}
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("IN_PROGRESS")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "IN_PROGRESS"
                ? "bg-amber-950/60 border-amber-500 shadow-md shadow-amber-900/30"
                : "bg-slate-900 border-slate-800 hover:bg-slate-850"
            }`}
          >
            <div className="text-xs text-amber-300">Đang sửa chữa</div>
            <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
              {incidents.filter((i) => i.incidentStatus === "IN_PROGRESS").length}
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("RESOLVED")}
            className={`p-4 rounded-xl border transition cursor-pointer ${
              statusFilter === "RESOLVED"
                ? "bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-900/30"
                : "bg-slate-900 border-slate-800 hover:bg-slate-850"
            }`}
          >
            <div className="text-xs text-emerald-300">Đã khắc phục</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {incidents.filter((i) => i.incidentStatus === "RESOLVED").length}
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề lỗi hoặc mã vạch máy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">
                  Tất cả trạng thái
                </option>
                <option value="OPEN" className="bg-slate-900">
                  Chờ xử lý (OPEN)
                </option>
                <option value="IN_PROGRESS" className="bg-slate-900">
                  Đang sửa chữa
                </option>
                <option value="RESOLVED" className="bg-slate-900">
                  Đã khắc phục
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* DANH SÁCH SỰ CỐ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3.5 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      inc.severity === "CRITICAL"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : inc.severity === "HIGH"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    Mức độ: {inc.severity}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      inc.incidentStatus === "RESOLVED"
                        ? "text-emerald-400"
                        : inc.incidentStatus === "IN_PROGRESS"
                        ? "text-cyan-400"
                        : "text-rose-400"
                    }`}
                  >
                    ● {inc.incidentStatus}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{inc.title}</h3>
                {inc.description && (
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    {inc.description}
                  </p>
                )}
              </div>

              {/* Thông tin máy & người báo */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Laptop className="h-3.5 w-3.5" />
                    Thiết bị:
                  </span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {inc.equipment.equipmentBarcode}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Người báo:
                  </span>
                  <span>{inc.reportedBy.fullName}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Thời gian:</span>
                  <span>{new Date(inc.createdAt).toLocaleString("vi-VN")}</span>
                </div>
              </div>

              {/* Nút cập nhật trạng thái sửa chữa */}
              <div className="pt-2 flex items-center gap-2">
                {inc.incidentStatus !== "RESOLVED" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(inc.id, "IN_PROGRESS")}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold transition"
                    >
                      Đang sửa
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(inc.id, "RESOLVED")}
                      className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã sửa xong
                    </button>
                  </>
                ) : (
                  <div className="flex-1 text-center py-1 bg-emerald-950/40 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-800/40">
                    ✓ Sự cố đã khắc phục
                  </div>
                )}
                <button
                  onClick={() => handleDeleteIncident(inc.id)}
                  className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 rounded-lg transition"
                  title="Xóa phiếu sự cố"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredIncidents.length === 0 && !loading && (
          <div className="text-center py-16 text-slate-500">
            Không có sự cố thiết bị nào được ghi nhận.
          </div>
        )}
      </div>
    </div>
  );
}
