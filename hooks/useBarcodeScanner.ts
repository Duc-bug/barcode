"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseBarcodeScannerOptions {
  onScan: (barcode: string, scanMethod: "USB_SCANNER") => void;
  minBarcodeLength?: number;
}

/**
 * Hook lắng nghe tín hiệu từ Súng quét Barcode USB / Bluetooth HID
 * Tự động nhận diện chuỗi ký tự kết thúc bằng phím Enter và gửi tới callback onScan
 */
export function useBarcodeScanner({
  onScan,
  minBarcodeLength = 4,
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>("");
  const lastKeyTimeRef = useRef<number>(0);

  // Clear buffer
  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
    lastKeyTimeRef.current = 0;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Nếu người dùng đang tập trung gõ vào thẻ input / textarea / select, để form xử lý tự nhiên
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === "INPUT" || targetTag === "TEXTAREA" || targetTag === "SELECT") {
        return;
      }

      // Bỏ qua các phím điều hướng hệ thống
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") {
        return;
      }

      const now = performance.now();

      // Nếu khoảng cách giữa 2 phím trước đó > 700ms thì đây là phiên quét mới -> reset buffer
      if (lastKeyTimeRef.current > 0 && now - lastKeyTimeRef.current > 700) {
        bufferRef.current = "";
      }
      lastKeyTimeRef.current = now;

      // Khi súng bắn kết thúc chuỗi bằng phím Enter
      if (e.key === "Enter") {
        const barcode = bufferRef.current.trim();
        if (barcode.length >= minBarcodeLength) {
          onScan(barcode, "USB_SCANNER");
        }
        resetBuffer();
        return;
      }

      // Gom ký tự hợp lệ (chữ số, chữ cái, gạch nối...)
      if (e.key.length === 1) {
        bufferRef.current += e.key;

        // Tránh tràn buffer nếu có dữ liệu rác
        if (bufferRef.current.length > 80) {
          resetBuffer();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [minBarcodeLength, onScan, resetBuffer]);

  return {
    cheatAlert: null,
    clearCheatAlert: () => {},
  };
}

