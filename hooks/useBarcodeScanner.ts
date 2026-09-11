"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseBarcodeScannerOptions {
  onScan: (barcode: string, scanMethod: "USB_SCANNER") => void;
  onCheatDetected?: (reason: string, details: { avgDelta: number; charCount: number }) => void;
  maxKeyInterval?: number; // Ngưỡng Delta t tối đa giữa 2 phím (mặc định 50ms để nhận diện nhạy mọi loại súng USB)
  minBarcodeLength?: number; // Chiều dài chuỗi tối thiểu (10 ký tự cho MSSV hoặc EQ-)
}

export function useBarcodeScanner({
  onScan,
  onCheatDetected,
  maxKeyInterval = 50, // Điều chỉnh lên 50ms để siêu nhạy với mọi dòng súng quét USB và độ trễ CPU
  minBarcodeLength = 6, // Chấp nhận từ 6 ký tự trở lên (mã ngắn hoặc mã dài)
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>("");
  const keyTimestampsRef = useRef<number[]>([]);
  const isTypingManuallyRef = useRef<boolean>(false);

  const [lastVelocity, setLastVelocity] = useState<number | null>(null);
  const [cheatAlert, setCheatAlert] = useState<string | null>(null);

  // Clear buffer
  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
    keyTimestampsRef.current = [];
    isTypingManuallyRef.current = false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Chống copy/paste (Ctrl + V hoặc Meta + V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        setCheatAlert("CẢNH BÁO GIAN LẬN: Nghiêm cấm hành vi Dán (Paste) mã vạch!");
        if (onCheatDetected) {
          onCheatDetected("PASTE_DETECTED", { avgDelta: 999, charCount: 0 });
        }
        resetBuffer();
        return;
      }

      // Bỏ qua các phím điều hướng hệ thống (Shift, Alt, Ctrl, Tab...)
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") {
        return;
      }

      const now = performance.now();

      // Khi người dùng bấm Enter (súng bắn barcode luôn gửi Enter ở cuối chuỗi)
      if (e.key === "Enter") {
        const barcode = bufferRef.current.trim();
        const timestamps = keyTimestampsRef.current;

        if (barcode.length >= minBarcodeLength && timestamps.length >= 2) {
          // Tính khoảng thời gian trung bình giữa các phím: Delta t
          const intervals: number[] = [];
          for (let i = 1; i < timestamps.length; i++) {
            intervals.push(timestamps[i] - timestamps[i - 1]);
          }

          const avgInterval = intervals.reduce((acc, v) => acc + v, 0) / intervals.length;
          setLastVelocity(Math.round(avgInterval * 10) / 10);

          // THUẬT TOÁN LỚP 1: Phân biệt Súng bắn USB vs Gõ tay
          // Súng bắn HID gõ liên tục với Delta t cực nhỏ (<= 50ms)
          // Nếu gõ tay: khoảng cách giữa các phím sẽ > 70ms - 250ms
          if (avgInterval <= maxKeyInterval && !isTypingManuallyRef.current) {
            setCheatAlert(null);
            onScan(barcode, "USB_SCANNER");
          } else {
            // Chỉ cảnh báo nếu tốc độ quá chậm (người dùng cố tình gõ tay từng ký tự)
            if (avgInterval > 70) {
              const alertMsg = `CẢNH BÁO GIAN LẬN: Phát hiện thao tác gõ phím thủ công (Tốc độ: ${Math.round(
                avgInterval
              )}ms/phím, quy định: ≤${maxKeyInterval}ms). Hệ thống chỉ chấp nhận quét trực tiếp từ Thẻ sinh viên!`;
              setCheatAlert(alertMsg);

              if (onCheatDetected) {
                onCheatDetected("MANUAL_KEYSTROKE_DETECTED", {
                  avgDelta: avgInterval,
                  charCount: barcode.length,
                });
              }
            } else {
              // Vẫn chấp nhận nếu ở vùng giáp ranh
              onScan(barcode, "USB_SCANNER");
            }
          }
        }

        resetBuffer();
        return;
      }

      // Gom ký tự
      if (e.key.length === 1) {
        if (keyTimestampsRef.current.length > 0) {
          const lastTime = keyTimestampsRef.current[keyTimestampsRef.current.length - 1];
          const delta = now - lastTime;
          if (delta > 120) {
            isTypingManuallyRef.current = true;
          }
        }

        bufferRef.current += e.key;
        keyTimestampsRef.current.push(now);

        if (bufferRef.current.length > 50) {
          resetBuffer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [maxKeyInterval, minBarcodeLength, onScan, onCheatDetected, resetBuffer]);

  return {
    lastVelocity,
    cheatAlert,
    clearCheatAlert: () => setCheatAlert(null),
  };
}
