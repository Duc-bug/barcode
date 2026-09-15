"use client";

import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeLabelProps {
  value: string; // Chuỗi barcode (VD: "EQ-LAB801-PC01" hoặc MSSV)
  title?: string; // Tên máy (VD: "PC TRẠM SỐ 01")
  subtitle?: string; // Phòng Lab (VD: "PHÒNG LAB 801 - KHOA CNTT")
  footerText?: string; // VLU branding
  width?: number;
  height?: number;
  fontSize?: number;
}

export const BarcodeLabel: React.FC<BarcodeLabelProps> = ({
  value,
  title = "THIẾT BỊ PHÒNG LAB",
  subtitle = "KHOA CNTT - ĐẠI HỌC VĂN LANG",
  footerText = "TÀI SẢN PHÒNG THỰC HÀNH",
  width = 1.6,
  height = 48,
  fontSize = 13,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: true,
          fontSize: fontSize,
          textMargin: 3,
          font: "monospace",
          fontOptions: "bold",
          lineColor: "#000000",
          margin: 0,
        });
      } catch (err) {
        console.error("Lỗi vẽ Barcode JsBarcode:", err);
      }
    }
  }, [value, width, height, fontSize]);

  return (
    <div className="bg-white text-black p-3 rounded-lg border-2 border-dashed border-slate-400 w-[240px] flex flex-col items-center justify-between shadow-sm select-none break-inside-avoid">
      {/* HEADER TEM */}
      <div className="text-center w-full border-b border-black pb-1 mb-1.5">
        <div className="text-[10px] font-extrabold tracking-wider text-red-700 uppercase">
          {subtitle}
        </div>
        <div className="text-xs font-black uppercase text-slate-900 truncate">
          {title}
        </div>
      </div>

      {/* SVG BARCODE CODE 128 */}
      <div className="flex items-center justify-center my-1">
        <svg ref={svgRef} className="max-w-full" />
      </div>

      {/* FOOTER TEM */}
      <div className="text-[9px] font-semibold text-slate-600 text-center uppercase tracking-tight border-t border-slate-300 w-full pt-1 mt-1">
        {footerText}
      </div>
    </div>
  );
};
export default BarcodeLabel;
