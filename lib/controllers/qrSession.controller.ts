import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { generateQrSessionToken } from "@/lib/qr-security";

// Hàm lấy địa chỉ IP LAN của máy tính để điện thoại quét mã truy cập được
function getLocalLanIp(): string | null {
  const interfaces = os.networkInterfaces();
  const candidates: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const isVirtual =
      name.toLowerCase().includes("warp") ||
      name.toLowerCase().includes("virtual") ||
      name.toLowerCase().includes("pseudo");
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        if (!isVirtual) {
          return iface.address; // Ưu tiên card mạng thật (Wi-Fi, Ethernet, Hotspot)
        }
        candidates.push(iface.address);
      }
    }
  }
  return candidates[0] || null;
}

export async function handleQrSession(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labCode = searchParams.get("labCode") || "LAB-A518";

    // Sinh token có thời hạn 30 giây (chuẩn TOTP bảo mật)
    const { token, payload } = generateQrSessionToken(labCode, 30);

    // Xác định URL đầy đủ để điện thoại quét mã QR mở trực tiếp
    let host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";

    // Nếu đang chạy bằng localhost hoặc 127.0.0.1, tự động thay bằng IP mạng LAN của máy tính
    const envAppUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
    let checkInUrl = "";

    if (envAppUrl) {
      checkInUrl = `${envAppUrl.replace(/\/$/, "")}/mobile-checkin?token=${token}&lab=${labCode}`;
    } else if (host.includes("localhost") || host.includes("127.0.0.1")) {
      const port = host.split(":")[1] || "3000";
      const lanIp = getLocalLanIp();
      const resolvedHost = lanIp ? `${lanIp}:${port}` : host;
      checkInUrl = `${proto}://${resolvedHost}/mobile-checkin?token=${token}&lab=${labCode}`;
    } else {
      checkInUrl = `${proto}://${host}/mobile-checkin?token=${token}&lab=${labCode}`;
    }

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
