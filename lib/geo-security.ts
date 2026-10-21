/**
 * Module bảo mật chống gian lận vị trí GPS và thiết bị điểm danh
 * Cơ sở chính Trường Đại học Văn Lang (69/68 Đặng Thùy Trâm, P. 13, Q. Bình Thạnh, TP.HCM)
 * Phòng Lab 5.18, Lầu 5, Tòa A
 */

// Tọa độ chuẩn của Tòa A - Cơ sở chính Đại học Văn Lang (CS3)
export const VLU_MAIN_CAMPUS_COORDS = {
  name: "Trường Đại học Văn Lang - Cơ sở chính (Tòa A, Phòng 5.18)",
  address: "69/68 Đặng Thùy Trâm, Phường 13, Bình Thạnh, TP. Hồ Chí Minh",
  latitude: 10.82754,
  longitude: 106.70003,
  // Bán kính cho phép bao quát toàn bộ khuôn viên trường và phòng Lab: 300 mét
  maxAllowedRadiusMeters: 300,
};

/**
 * Tính khoảng cách giữa 2 tọa độ theo công thức Haversine (chuẩn quốc tế)
 * Trả về khoảng cách tính bằng mét (m)
 */
export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Bán kính Trái Đất (mét)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Kiểm tra xem tọa độ của sinh viên có nằm trong khuôn viên Đại học Văn Lang hay không
 */
export function verifyVluLocation(
  userLat?: number | null,
  userLng?: number | null
): {
  isValid: boolean;
  distanceMeters: number;
  formattedDistance: string;
  error?: string;
} {
  if (userLat === undefined || userLat === null || userLng === undefined || userLng === null) {
    return {
      isValid: false,
      distanceMeters: -1,
      formattedDistance: "Không xác định",
      error: "Vui lòng cấp quyền định vị GPS trên điện thoại để xác thực bạn đang có mặt tại trường!",
    };
  }

  const distance = calculateDistanceInMeters(
    userLat,
    userLng,
    VLU_MAIN_CAMPUS_COORDS.latitude,
    VLU_MAIN_CAMPUS_COORDS.longitude
  );

  const formattedDistance =
    distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance} mét`;

  if (distance > VLU_MAIN_CAMPUS_COORDS.maxAllowedRadiusMeters) {
    return {
      isValid: false,
      distanceMeters: distance,
      formattedDistance,
      error: `Bạn đang ở cách phòng Lab ${formattedDistance} (Vượt quá bán kính cho phép ${VLU_MAIN_CAMPUS_COORDS.maxAllowedRadiusMeters}m). Bạn phải có mặt trực tiếp tại trường Đại học Văn Lang để điểm danh!`,
    };
  }

  return {
    isValid: true,
    distanceMeters: distance,
    formattedDistance,
  };
}
