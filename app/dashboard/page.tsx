"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileSpreadsheet,
  ArrowLeft,
  Clock,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Download,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  LogIn,
  LogOut,
  Laptop,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // XUẤT EXCEL BẢNG CHẤM CÔNG VLU LAB BẰNG SHEETJS (XLSX)
  const handleExportExcel = () => {
    if (!data || !data.allLogs) return;

    // Chuẩn bị dữ liệu định dạng bảng tính
    const worksheetData = data.allLogs.map((log: any, idx: number) => ({
      STT: idx + 1,
      "Họ và Tên SV": log.studentName,
      MSSV: log.studentCode,
      "Ngày trực": new Date(log.dutyDate).toLocaleDateString("vi-VN"),
      "Ca trực": log.shiftName,
      "Phòng Lab": log.labName,
      "Giờ Check-in": log.checkInTime
        ? new Date(log.checkInTime).toLocaleTimeString("vi-VN")
        : "--:--",
      "Giờ Check-out": log.checkOutTime
        ? new Date(log.checkOutTime).toLocaleTimeString("vi-VN")
        : "--:--",
      "Thời gian có mặt": log.durationText || "--",
      "Số giờ quy đổi": log.totalHours || 0,
      "Trạng thái":
        log.attendanceStatus === "ON_TIME"
          ? "Đúng giờ"
          : log.attendanceStatus === "LATE"
          ? "Đi trễ"
          : log.attendanceStatus,
      "Phương thức quét": log.scanMethod,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ChamCongLabVLU");

    // Tự động điều chỉnh độ rộng cột
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 28 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 16 },
    ];

    XLSX.writeFile(
      workbook,
      `VLU_BangChamCong_Lab_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const pieColors = ["#10b981", "#f59e0b", "#ef4444"];
  const pieData = [
    { name: "Đúng giờ", value: data?.stats?.onTimeCount || 0 },
    { name: "Đi trễ", value: data?.stats?.lateCount || 0 },
  ];

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
                <FileSpreadsheet className="h-6 w-6 text-emerald-400" />
                THỐNG KÊ GIỜ TRỰC & XUẤT BẢNG CHẤM CÔNG
              </h1>
              <p className="text-xs text-slate-400">
                Khoa Công nghệ Thông tin - Trường Đại học Văn Lang • Thống kê hiệu suất trực phòng Lab
              </p>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <Download className="h-4 w-4" />
            Xuất Excel Bảng Chấm Công (.xlsx)
          </button>
        </header>

        {/* 4 THẺ THỐNG KÊ (KPI METRICS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng giờ trực đã tích lũy</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {data?.stats?.totalHours || 0} hrs
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Tổng số lượt quét điểm danh</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {data?.stats?.totalLogs || 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
              <UserCheck className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Lượt check-in đúng giờ</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                {data?.stats?.onTimeCount || 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Sự cố máy tính đang mở</div>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
                {data?.stats?.openIncidents || 0}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* BIỂU ĐỒ RECHARTS (2 CỘT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái (8 cột): Biểu đồ cột tổng số giờ trực theo sinh viên */}
          <div className="lg:col-span-8 bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col">
            <h3 className="text-sm font-bold text-white mb-4">
              Biểu đồ: Tổng số giờ trực của từng sinh viên (Hours)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.studentStats || []}>
                  <XAxis dataKey="fullName" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Bar dataKey="totalHours" fill="#ef4444" radius={[6, 6, 0, 0]} name="Số giờ trực" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cột phải (4 cột): Tỷ lệ Đúng giờ vs Đi trễ */}
          <div className="lg:col-span-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col items-center">
            <h3 className="text-sm font-bold text-white mb-2 self-start">Tỷ lệ Kỷ luật Điểm danh</h3>
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BẢNG TỔNG HỢP THEO SINH VIÊN */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">
            Bảng thống kê ca trực theo Sinh viên
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Họ và Tên SV</th>
                  <th className="py-2.5 px-3">MSSV</th>
                  <th className="py-2.5 px-3">Số ca phân công</th>
                  <th className="py-2.5 px-3">Đã hoàn thành</th>
                  <th className="py-2.5 px-3">Đúng giờ</th>
                  <th className="py-2.5 px-3">Đi trễ</th>
                  <th className="py-2.5 px-3 text-right">Tổng giờ trực</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {data?.studentStats?.map((sv: any) => (
                  <tr key={sv.id} className="hover:bg-slate-850">
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">
                      {sv.fullName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{sv.studentCode}</td>
                    <td className="py-2.5 px-3 text-slate-300">{sv.totalShifts}</td>
                    <td className="py-2.5 px-3 text-slate-300">{sv.completedShifts}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{sv.onTime}</td>
                    <td className="py-2.5 px-3 text-amber-400">{sv.late}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-400">
                      {sv.totalHours} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BẢNG CHI TIẾT TỪNG LƯỢT ĐIỂM DANH CHECK-IN / CHECK-OUT */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Nhật ký Chi tiết Các lượt Điểm danh Vào - Ra Phòng Lab
              </h3>
              <p className="text-xs text-slate-400">
                Hiển thị thời gian check-in, check-out và tổng thời lượng có mặt chính xác
              </p>
            </div>

            {/* Tìm kiếm & Lọc trạng thái */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-56">
                <Search className="h-3.5 w-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm SV, MSSV, phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-slate-900">
                    Tất cả trạng thái
                  </option>
                  <option value="IN_LAB" className="bg-slate-900">
                    Đang có mặt trong Lab
                  </option>
                  <option value="CHECKED_OUT" className="bg-slate-900">
                    Đã Check-out
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Sinh viên</th>
                  <th className="py-2.5 px-3">Ngày</th>
                  <th className="py-2.5 px-3">Giờ Check-in</th>
                  <th className="py-2.5 px-3">Giờ Check-out</th>
                  <th className="py-2.5 px-3">Thời gian có mặt</th>
                  <th className="py-2.5 px-3">Phòng Lab</th>
                  <th className="py-2.5 px-3">Phương thức</th>
                  <th className="py-2.5 px-3 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {data?.allLogs
                  ?.filter((log: any) => {
                    const matchesSearch =
                      log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      log.studentCode.includes(searchTerm) ||
                      log.labName.toLowerCase().includes(searchTerm.toLowerCase());

                    const matchesStatus =
                      statusFilter === "ALL" ||
                      (statusFilter === "IN_LAB" && !log.checkOutTime) ||
                      (statusFilter === "CHECKED_OUT" && !!log.checkOutTime);

                    return matchesSearch && matchesStatus;
                  })
                  .map((log: any, idx: number) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <div className="font-semibold text-white">{log.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.studentCode}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {new Date(log.dutyDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                        {log.checkInTime
                          ? new Date(log.checkInTime).toLocaleTimeString("vi-VN")
                          : "--:--"}
                      </td>
                      <td className="py-2.5 px-3 text-cyan-400 font-semibold">
                        {log.checkOutTime
                          ? new Date(log.checkOutTime).toLocaleTimeString("vi-VN")
                          : "Đang trong Lab"}
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">
                        {log.durationText || "--"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">
                        {log.labName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans">
                        {log.scanMethod === "WEBCAM" ? "Webcam AI" : "Súng quét USB"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            log.checkOutTime
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                          }`}
                        >
                          {log.checkOutTime ? "Đã Check-out" : "Đang có mặt"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
