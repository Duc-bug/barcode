"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { soundFX } from "@/lib/audio";
import {
  Camera,
  ShieldAlert,
  Zap,
  Clock,
  UserCheck,
  AlertTriangle,
  Laptop,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  History,
  Send,
  Sparkles,
  LogIn,
  LogOut,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ScanResult {
  logId?: string;
  studentName: string;
  studentCode: string;
  labName: string;
  checkInTime: string;
  checkOutTime?: string | null;
  totalHours?: number;
  durationText?: string;
  scanMethod: string;
  snapshot?: string | null;
  action: "CHECK_IN" | "CHECK_OUT";
  message: string;
}

interface EquipmentData {
  id: string;
  equipmentBarcode: string;
  equipmentName: string;
  category: string;
  status: string;
  labName: string;
  building: string;
  specifications?: string;
  activeIncidents: any[];
}

export default function ScanStationPage() {
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<{
    action: "CHECK_IN" | "CHECK_OUT";
    title: string;
    subtitle: string;
  } | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [scanSuccessFlash, setScanSuccessFlash] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  // Modal báo sự cố thiết bị khi quét mã EQ-
  const [equipmentModal, setEquipmentModal] = useState<EquipmentData | null>(null);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [incidentSubmitting, setIncidentSubmitting] = useState(false);
  const [incidentSuccess, setIncidentSuccess] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const html5QrCodeRef = useRef<any>(null);
  const lastScannedTimeRef = useRef<{ [code: string]: number }>({});

  // Tính định dạng thời gian rõ ràng (không dùng số thập phân giờ như 0.01 giờ)
  const formatFriendlyDuration = (checkIn: string, checkOut?: string | null) => {
    if (!checkOut) {
      const elapsedSec = Math.max(1, Math.floor((Date.now() - new Date(checkIn).getTime()) / 1000));
      const m = Math.floor(elapsedSec / 60);
      return m > 0 ? `Đang có mặt (${m} phút)` : "Đang có mặt (< 1 phút)";
    }
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const totalSec = Math.max(1, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h} giờ ${m} phút ${s} giây`;
    if (m > 0) return `${m} phút ${s} giây`;
    return `${s} giây`;
  };

  // 1. Đồng hồ thời gian thực
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Tải danh sách Logs gần đây
  const fetchStationData = useCallback(async () => {
    try {
      const res = await fetch("/api/attendance/scan");
      const data = await res.json();
      if (data.success) {
        setRecentLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Lỗi nạp dữ liệu:", err);
    }
  }, []);

  useEffect(() => {
    fetchStationData();
    const interval = setInterval(fetchStationData, 5000);
    return () => clearInterval(interval);
  }, [fetchStationData]);

  // 3. Chụp Snapshot khuôn mặt từ thẻ video của html5-qrcode
  const captureSnapshot = (): string | null => {
    const video = document.querySelector("#interactive-webcam-reader video") as HTMLVideoElement;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(
      `VLU LAB SECURE SNAPSHOT • ${new Date().toLocaleString("vi-VN")}`,
      12,
      canvas.height - 10
    );

    return canvas.toDataURL("image/jpeg", 0.7);
  };

  // 4. Xử lý quét Barcode qua Backend
  const handleBarcodeProcess = async (barcode: string, scanMethod: "USB_SCANNER" | "WEBCAM") => {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode) return;

    // Chống quét trùng lặp trong 1.8 giây (đủ để kéo thẻ ra khỏi ống kính camera)
    const nowTime = Date.now();
    if (lastScannedTimeRef.current[cleanBarcode] && nowTime - lastScannedTimeRef.current[cleanBarcode] < 1800) {
      return;
    }
    lastScannedTimeRef.current[cleanBarcode] = nowTime;

    if (isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);

    // Hiệu ứng viền xanh
    setScanSuccessFlash(true);
    setTimeout(() => setScanSuccessFlash(false), 900);

    const snapshot = captureSnapshot();

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: cleanBarcode,
          scanMethod,
          snapshotBase64: snapshot,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (isSoundEnabled) soundFX.playWarning();
        setErrorMessage(data.message);
        setSuccessBanner(null);
        setIsProcessing(false);
        return;
      }

      // THUẬT TOÁN ĐỊNH TUYẾN: MÃ THIẾT BỊ PHÒNG LAB (EQ-)
      if (data.type === "EQUIPMENT") {
        if (isSoundEnabled) soundFX.playEquipmentChime();
        setEquipmentModal(data.data);
        setIsProcessing(false);
        return;
      }

      // ĐIỂM DANH SINH VIÊN (CHECK-IN HOẶC CHECK-OUT): PHÁT ÂM THANH HIỆU ỨNG TƯƠNG ỨNG
      if (isSoundEnabled) {
        if (data.action === "CHECK_IN") {
          soundFX.playCheckIn(); // Tiếng chime đón tiếp thăng hoa
        } else {
          soundFX.playCheckOut(); // Tiếng chime hoàn thành ấm áp
        }
      }
      setErrorMessage(null);

      const actionTitle = data.action === "CHECK_IN" ? "CHECK-IN THÀNH CÔNG" : "CHECK-OUT THÀNH CÔNG";
      const actionSubtitle = data.action === "CHECK_IN"
        ? `Sinh viên: ${data.data.studentName} (${data.data.studentCode}) • Giờ vào: ${new Date(data.data.checkInTime).toLocaleTimeString("vi-VN")}`
        : `Sinh viên: ${data.data.studentName} (${data.data.studentCode}) • Thời gian có mặt: ${data.data.durationText}`;

      setSuccessBanner({
        action: data.action,
        title: actionTitle,
        subtitle: actionSubtitle,
      });

      // Tự động tắt banner thành công sau 8 giây
      setTimeout(() => {
        setSuccessBanner((prev) => (prev?.title === actionTitle ? null : prev));
      }, 8000);

      setLastResult({
        ...data.data,
        action: data.action,
        message: data.message,
      });

      fetchStationData();
    } catch (err: any) {
      if (isSoundEnabled) soundFX.playWarning();
      setErrorMessage("Không thể kết nối với máy chủ: " + err.message);
      setSuccessBanner(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Custom Hook Lớp 1: Anti-Cheat Keystroke Timing (Súng bắn USB)
  const { lastVelocity, cheatAlert, clearCheatAlert } = useBarcodeScanner({
    onScan: (barcode) => {
      handleBarcodeProcess(barcode, "USB_SCANNER");
    },
    onCheatDetected: () => {
      if (isSoundEnabled) soundFX.playWarning();
    },
    maxKeyInterval: 55,
    minBarcodeLength: 6,
  });

  // 6. KHỞI CHẠY BỘ QUÉT CAMERA BẰNG HTML5-QRCODE (ZXING ENGINE CHUẨN CODE 128 / CODE 39)
  useEffect(() => {
    let isCancelled = false;

    async function startScanner() {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
        if (isCancelled) return;

        const html5QrCode = new Html5Qrcode("interactive-webcam-reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });

        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "user" },
          {
            fps: 25,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              // Khung quét hình chữ nhật ngang rộng phù hợp mã vạch 1D Code 128
              const width = Math.min(viewfinderWidth * 0.9, 480);
              const height = Math.min(viewfinderHeight * 0.65, 220);
              return { width, height };
            },
            aspectRatio: 1.333333,
          },
          (decodedText) => {
            handleBarcodeProcess(decodedText, "WEBCAM");
          },
          () => {}
        );

        if (!isCancelled) {
          setCameraActive(true);
        }
      } catch (err) {
        console.warn("Lỗi khởi động Html5Qrcode camera:", err);
      }
    }

    startScanner();

    return () => {
      isCancelled = true;
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // 7. Gửi Báo cáo Sự cố Thiết bị
  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentModal || !incidentTitle.trim()) return;

    setIncidentSubmitting(true);
    try {
      const res = await fetch("/api/incidents/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: equipmentModal.id,
          studentCode: lastResult?.studentCode || "2373401010100",
          title: incidentTitle,
          severity: incidentSeverity,
          description: incidentDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        soundFX.playSuccess();
        setIncidentSuccess(`Đã tạo phiếu báo hỏng thành công cho thiết bị ${equipmentModal.equipmentBarcode}!`);
        setTimeout(() => {
          setEquipmentModal(null);
          setIncidentSuccess(null);
          setIncidentTitle("");
          setIncidentDesc("");
        }, 1800);
      }
    } catch (err: any) {
      alert("Lỗi khi gửi sự cố: " + err.message);
    } finally {
      setIncidentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <canvas ref={canvasRef} className="hidden" />

      {/* TOP HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              VLU LAB CHECK-IN / CHECK-OUT
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                TỰ ĐỘNG
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Trường Đại học Văn Lang • Khoa Công nghệ Thông tin • Điểm danh vào - ra phòng Lab bằng Barcode
            </p>
          </div>
        </div>

        {/* CỐ ĐỊNH PHÒNG TRỰC THỰC TẾ + TRỢ LÝ GIỌNG NÓI + ĐỒNG HỒ */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700 text-xs flex items-center gap-3">
            <Laptop className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Phòng máy thực hành:</div>
              <div className="font-bold text-white">
                LAB-CS3-G801 - Phòng Lab Mạng & An ninh mạng 8.01
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
              isSoundEnabled
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 shadow-sm"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title={isSoundEnabled ? "Nhấn để tắt âm thanh hiệu ứng" : "Nhấn để bật âm thanh hiệu ứng"}
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline font-bold">{isSoundEnabled ? "Âm thanh: BẬT" : "Âm thanh: TẮT"}</span>
          </button>

          <div className="text-right">
            <div className="text-2xl font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-400 animate-pulse" />
              {currentTime || "00:00:00"}
            </div>
            <div className="text-xs text-slate-400 capitalize">{currentDate}</div>
          </div>
        </div>
      </header>

      {/* ALERT & SUCCESS BANNERS */}
      {cheatAlert && (
        <div className="bg-rose-950/90 border-y border-rose-500/50 px-6 py-3 text-rose-200 flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-400 flex-shrink-0" />
            <p className="text-sm font-semibold">{cheatAlert}</p>
          </div>
          <button
            onClick={clearCheatAlert}
            className="px-3 py-1 text-xs bg-rose-800 hover:bg-rose-700 rounded-md text-white font-medium"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {successBanner && (
        <div
          className={`border-y px-6 py-3 flex items-center justify-between text-sm transition animate-in fade-in slide-in-from-top-2 ${
            successBanner.action === "CHECK_IN"
              ? "bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-900/20"
              : "bg-cyan-950/90 border-cyan-500/60 text-cyan-200 shadow-lg shadow-cyan-900/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded-full ${
                successBanner.action === "CHECK_IN" ? "bg-emerald-500/20 text-emerald-400" : "bg-cyan-500/20 text-cyan-400"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-wide">{successBanner.title}</span>
              <span className="mx-2 opacity-60">|</span>
              <span className="text-xs opacity-95">{successBanner.subtitle}</span>
            </div>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-slate-400 hover:text-white transition">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-amber-950/80 border-y border-amber-500/50 px-6 py-2.5 text-amber-200 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-amber-400 hover:text-white">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* MAIN TWO-COLUMN BODY */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* CỘT TRÁI (6 CỘT): CAMERA SCANNER & ANTI-CHEAT */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          {/* CAMERA FEED & LASER SCAN BOX */}
          <div
            className={`relative rounded-2xl overflow-hidden border-2 bg-slate-900 shadow-2xl aspect-[4/3] flex flex-col items-center justify-center transition-all duration-300 ${
              scanSuccessFlash
                ? "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.7)]"
                : "border-slate-800"
            }`}
          >
            {/* CONTAINER DÀNH RIÊNG CHO HTML5-QRCODE ENGINE (ZXING) */}
            <div id="interactive-webcam-reader" className="w-full h-full overflow-hidden" />

            {/* TIA LASER ĐỎ CHUYỂN ĐỘNG NẰM NGANG */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
              <div className="flex justify-between">
                <div
                  className={`w-12 h-12 border-t-4 border-l-4 rounded-tl-xl transition-colors ${
                    scanSuccessFlash ? "border-emerald-400" : "border-red-500"
                  }`}
                />
                <div
                  className={`w-12 h-12 border-t-4 border-r-4 rounded-tr-xl transition-colors ${
                    scanSuccessFlash ? "border-emerald-400" : "border-red-500"
                  }`}
                />
              </div>

              <div className="relative w-full h-24 flex items-center justify-center">
                <div
                  className={`w-full h-1 shadow-[0_0_20px_4px_rgba(239,68,68,0.9)] animate-laser-sweep transition-colors ${
                    scanSuccessFlash ? "bg-emerald-400 shadow-[0_0_25px_5px_rgba(16,185,129,0.9)]" : "bg-red-500"
                  }`}
                />
              </div>

              <div className="flex justify-between">
                <div
                  className={`w-12 h-12 border-b-4 border-l-4 rounded-bl-xl transition-colors ${
                    scanSuccessFlash ? "border-emerald-400" : "border-red-500"
                  }`}
                />
                <div
                  className={`w-12 h-12 border-b-4 border-r-4 rounded-br-xl transition-colors ${
                    scanSuccessFlash ? "border-emerald-400" : "border-red-500"
                  }`}
                />
              </div>
            </div>

            {/* TRẠNG THÁI CAMERA & SÚNG QUÉT */}
            <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 flex items-center gap-2 text-xs font-semibold shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400">CAMERA & SÚNG USB ĐANG SẴN SÀNG</span>
            </div>

            {/* HƯỚNG DẪN ĐIỂM DANH */}
            <div className="absolute bottom-4 inset-x-4 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 text-center">
              <div className="text-xs font-semibold text-white flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Đưa mã vạch thẻ SV cách camera 15-25cm hoặc bóp cò súng quét USB
              </div>
            </div>
          </div>


          {/* SIMULATION BAR: DÀNH CHO BẢO VỆ ĐỒ ÁN / TEST NHANH */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5 text-amber-400" />
                Mô phỏng quét nhanh:
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleBarcodeProcess("2373401010100", "USB_SCANNER")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-200 transition"
              >
                🎓 SV: Nguyễn Thiện Đức (2373401010100)
              </button>
              <button
                onClick={() => handleBarcodeProcess("2174802010708", "USB_SCANNER")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-200 transition"
              >
                🎓 SV: Nguyễn Bảo Thiên (2174802010708)
              </button>
              <button
                onClick={() => handleBarcodeProcess("2374802010490", "USB_SCANNER")}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-200 transition"
              >
                🎓 SV: Trần Thái Thuận (2374802010490)
              </button>
              <button
                onClick={() => handleBarcodeProcess("EQ-LAB801-PC01", "USB_SCANNER")}
                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md text-amber-300 transition"
              >
                💻 Máy: EQ-LAB801-PC01
              </button>
            </div>
          </div>
        </section>

        {/* CỘT PHẢI (6 CỘT): KẾT QUẢ QUÉT GẦN NHẤT + BẢNG LỊCH SỬ HÔM NAY */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          {/* KẾT QUẢ QUÉT GẦN NHẤT */}
          <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wide">
                  Kết quả quét vừa thực hiện
                </h2>
              </div>
              {lastResult && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5 ${
                    lastResult.action === "CHECK_IN"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  {lastResult.action === "CHECK_IN" ? (
                    <>
                      <LogIn className="h-3.5 w-3.5" /> ĐÃ CHECK-IN
                    </>
                  ) : (
                    <>
                      <LogOut className="h-3.5 w-3.5" /> ĐÃ CHECK-OUT
                    </>
                  )}
                </span>
              )}
            </div>

            {lastResult ? (
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                {/* Snapshot Image Preview */}
                <div className="w-36 h-36 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex-shrink-0 relative group">
                  {lastResult.snapshot ? (
                    <img
                      src={lastResult.snapshot}
                      alt="Face Snapshot"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                      <Camera className="h-8 w-8 mb-1" />
                      <span className="text-[10px]">No Snapshot</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-slate-300 px-1 rounded">
                    Snapshot
                  </span>
                </div>

                {/* Chi tiết sinh viên */}
                <div className="flex-1 w-full space-y-2 text-sm">
                  <div>
                    <h3 className="text-lg font-bold text-white">{lastResult.studentName}</h3>
                    <div className="text-slate-400 font-mono text-xs">
                      MSSV: <span className="text-emerald-400 font-bold">{lastResult.studentCode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Giờ Check-in:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {new Date(lastResult.checkInTime).toLocaleTimeString("vi-VN")}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Giờ Check-out:</span>
                      <span className="text-cyan-400 font-mono font-bold">
                        {lastResult.checkOutTime
                          ? new Date(lastResult.checkOutTime).toLocaleTimeString("vi-VN")
                          : "Đang ở phòng Lab"}
                      </span>
                    </div>
                  </div>

                  {lastResult.durationText && (
                    <div className="text-xs text-cyan-300 font-mono bg-cyan-950/40 p-2 rounded border border-cyan-800/50">
                      ⏱ Tổng thời gian có mặt: <span className="font-bold">{lastResult.durationText}</span>
                    </div>
                  )}

                  <div className="text-xs text-emerald-400/90 bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
                    {lastResult.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
                <div className="w-14 h-14 rounded-full bg-slate-800/60 flex items-center justify-center mb-3">
                  <UserCheck className="h-7 w-7 text-slate-400" />
                </div>
                <div className="text-sm font-medium text-slate-300">Chưa có lượt quét nào</div>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Đưa thẻ sinh viên vào trước camera hoặc bóp cò súng quét để Check-in / Check-out.
                </p>
              </div>
            )}
          </div>

          {/* NHẬT KÝ ĐIỂM DANH HÔM NAY */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-400" />
                Nhật ký điểm danh vào - ra hôm nay
              </h3>
              <button
                onClick={fetchStationData}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Làm mới
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[340px] rounded-lg border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Sinh viên</th>
                    <th className="py-2.5 px-3">Giờ Check-in</th>
                    <th className="py-2.5 px-3">Giờ Check-out</th>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3 font-sans">
                          <div className="font-semibold text-white">{log.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.studentCode}</div>
                        </td>
                        <td className="py-2 px-3 text-emerald-400 font-semibold">
                          {log.checkInTime
                            ? new Date(log.checkInTime).toLocaleTimeString("vi-VN")
                            : "--:--"}
                        </td>
                        <td className="py-2 px-3 text-cyan-400 font-semibold">
                          {log.checkOutTime
                            ? new Date(log.checkOutTime).toLocaleTimeString("vi-VN")
                            : "Đang trong Lab"}
                        </td>
                        <td className="py-2 px-3 text-cyan-300 font-mono font-medium">
                          {formatFriendlyDuration(log.checkInTime, log.checkOutTime)}
                        </td>
                        <td className="py-2 px-3 text-right font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              log.checkOutTime
                                ? "bg-cyan-500/20 text-cyan-300"
                                : "bg-emerald-500/20 text-emerald-300"
                            }`}
                          >
                            {log.checkOutTime ? "Đã Check-out" : "Đang có mặt"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                        Chưa có sinh viên nào check-in hôm nay
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL BÁO CÁO SỰ CỐ THIẾT BỊ PHÒNG LAB KHI QUÉT MÃ EQ- */}
      {equipmentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEquipmentModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">THIẾT BỊ PHÒNG LAB ĐƯỢC NHẬN DIỆN</h3>
                <p className="text-xs text-amber-400 font-mono">
                  Mã vạch: {equipmentModal.equipmentBarcode}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Tên thiết bị:</span>
                <span className="text-white font-semibold">{equipmentModal.equipmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vị trí:</span>
                <span className="text-slate-200">{equipmentModal.labName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cấu hình:</span>
                <span className="text-slate-300">{equipmentModal.specifications || "Chuẩn máy trạm VLU"}</span>
              </div>
            </div>

            {incidentSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>{incidentSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitIncident} className="space-y-3.5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Tạo nhanh Phiếu Báo hỏng (Incident Report - 5 Giây):
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Mô tả sự cố / Lỗi gặp phải:</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Không lên màn hình, bàn phím liệt phím Enter..."
                    value={incidentTitle}
                    onChange={(e) => setIncidentTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Mức độ nghiêm trọng:</label>
                    <select
                      value={incidentSeverity}
                      onChange={(e) => setIncidentSeverity(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="LOW">Thấp (Chưa ảnh hưởng ca học)</option>
                      <option value="MEDIUM">Vừa (Hỏng phụ kiện, chuột/phím)</option>
                      <option value="HIGH">Nghiêm trọng (Hỏng phần cứng máy)</option>
                      <option value="CRITICAL">Khẩn cấp (Cháy nổ/Chập điện)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Người trực ghi nhận:</label>
                    <input
                      type="text"
                      disabled
                      value={lastResult?.studentName || "Sinh viên trực ca"}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ghi chú bổ sung (Tùy chọn):</label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Đã thử đổi dây nguồn nhưng quạt nguồn không quay..."
                    value={incidentDesc}
                    onChange={(e) => setIncidentDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEquipmentModal(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    disabled={incidentSubmitting}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-amber-600/30"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {incidentSubmitting ? "Đang gửi..." : "Gửi Báo hỏng (5s)"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
