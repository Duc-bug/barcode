import { NextRequest, NextResponse } from "next/server";
import { generateQrSessionToken } from "@/lib/qr-security";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labCode = searchParams.get("labCode") || "LAB-A518";

    // Sinh token có thời hạn 30 giây (chuẩn TOTP bảo mật)
    const { token, payload } = generateQrSessionToken(labCode, 30);

    // Xác định URL đầy đủ để điện thoại quét mã QR mở trực tiếp
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const checkInUrl = `${proto}://${host}/mobile-checkin?token=${token}&lab=${labCode}`;

    return NextResponse.json({
      success: true,
      token,
      checkInUrl,
      sessionId: payload.sessionId,
      issuedAt: payload.issuedAt,
      expiresAt: payload.expiresAt,
      ttl: 20, // Chu kỳ đổi mã trên màn hình: 20 giây
      labCode,
      labName: "Phòng 5.18 - Lầu 5, Tòa A (Cơ sở chính)",
    });
  } catch (error: any) {
    console.error("Lỗi sinh QR Session:", error);
    return NextResponse.json(
      { success: false, message: "Không thể khởi tạo phiên mã QR: " + error.message },
      { status: 500 }
    );
  }
}
