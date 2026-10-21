import crypto from "crypto";

const QR_SECRET = process.env.QR_JWT_SECRET || "vlu_lab_dynamic_qr_secret_key_2026";
const DEFAULT_TTL_SECONDS = 30; // Chuẩn TOTP 30 giây bảo mật cao và đủ thời gian cho SV bấm xác nhận

export interface QrTokenPayload {
  labCode: string;
  sessionId: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Sinh chuỗi Token mã QR động có gắn chữ ký số HMAC-SHA256
 */
export function generateQrSessionToken(
  labCode: string = "LAB-A518",
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): { token: string; payload: QrTokenPayload } {
  const now = Date.now();
  const expiresAt = now + ttlSeconds * 1000;
  const sessionId = crypto.randomBytes(8).toString("hex");

  const payload: QrTokenPayload = {
    labCode,
    sessionId,
    issuedAt: now,
    expiresAt,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", QR_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  const token = `${payloadBase64}.${signature}`;
  return { token, payload };
}

/**
 * Xác thực chuỗi Token mã QR động
 * - Kiểm tra tính toàn vẹn chữ ký HMAC
 * - Kiểm tra thời hạn hiệu lực (TTL)
 */
export function verifyQrSessionToken(token: string): {
  valid: boolean;
  payload?: QrTokenPayload;
  error?: string;
} {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Token không tồn tại hoặc sai định dạng!" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Định dạng mã QR không hợp lệ!" };
  }

  const [payloadBase64, signature] = parts;

  // 1. Kiểm tra chữ ký HMAC
  const expectedSignature = crypto
    .createHmac("sha256", QR_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  // So sánh an toàn chống timing attack
  const isSignatureValid =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isSignatureValid) {
    return { valid: false, error: "Chữ ký bảo mật mã QR không hợp lệ hoặc đã bị can thiệp!" };
  }

  // 2. Giải mã Payload
  let payload: QrTokenPayload;
  try {
    const jsonString = Buffer.from(payloadBase64, "base64url").toString("utf8");
    payload = JSON.parse(jsonString);
  } catch (err) {
    return { valid: false, error: "Dữ liệu payload của mã QR bị hỏng!" };
  }

  // 3. Kiểm tra thời hạn hiệu lực (cho phép dung sai mạng 3 giây)
  const now = Date.now();
  const clockSkewToleranceMs = 3000;

  if (now > payload.expiresAt + clockSkewToleranceMs) {
    const expiredSecondsAgo = Math.round((now - payload.expiresAt) / 1000);
    return {
      valid: false,
      error: `Mã QR đã hết hạn cách đây ${expiredSecondsAgo} giây! Vui lòng quét lại mã QR mới trên màn hình phòng Lab.`,
    };
  }

  return { valid: true, payload };
}
