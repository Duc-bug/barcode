# Hệ Thống Quản Lý & Điểm Danh Phòng LAB Bằng Barcode

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)
![Prisma](https://img.shields.io/badge/Prisma-5.0-teal?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

Hệ thống trạm Kiosk điểm danh tự động vào - ra phòng máy thực hành bằng mã vạch 1D (**Code 128**) dành cho sinh viên và quản lý tài sản phần cứng phòng Lab. Hệ thống hỗ trợ song song cả **Camera máy tính (ZXing Engine)** và **Súng quét mã vạch chuyên dụng USB HID**, tích hợp cơ chế định tuyến thông minh (**Smart Barcode Router**), tính toán thời gian có mặt chính xác và xuất báo cáo bảng chấm công Excel chuẩn hóa.

---

## 📑 Mục Lục
1. [Kiến Trúc Tổng Thể](#-kiến-trúc-tổng-thể)
2. [Yêu Cầu Môi Trường](#-yêu-cầu-môi-trường)
3. [Cài Đặt & Cấu Hình Cơ Sở Dữ Liệu MySQL](#-cài-đặt--cấu-hình-cơ-sở-dữ-liệu-mysql)
4. [Mô Hình Dữ Liệu (Prisma ORM & Schema)](#-mô-hình-dữ-liệu-prisma-orm--schema)
5. [Các Phân Hệ Chức Năng](#-các-phân-hệ-chức-năng)
6. [Tài Liệu API Endpoint](#-tài-liệu-api-endpoint)
7. [Khởi Chạy Ứng Dụng](#-khởi-chạy-ứng-dụng)
8. [Quy Chuẩn Kỹ Thuật Mã Vạch (Code 128)](#-quy-chuẩn-kỹ-thuật-mã-vạch-code-128)

---

## 🏛 Kiến Trúc Tổng Thể

```mermaid
graph TD
    A[Thẻ Sinh Viên / Tem Máy Tính 1D Code 128] -->|Quét quang học| B[Webcam Trạm Kiosk - ZXing Engine]
    A -->|Bóp cò laser| C[Súng quét USB HID - Keystroke Capture]
    B --> D[Frontend Kiosk Station - Next.js 14]
    C --> D
    D -->|HTTP POST Payload + Snapshot Base64| E[API Gateway Router: /api/attendance/scan]
    E --> F{Smart Barcode Router}
    F -->|Mã 'EQ-'| G[Lab Equipment Service: Tra cứu & Ghi sự cố máy]
    F -->|MSSV Thẻ SV| H[Attendance Engine: Quản lý Check-in / Check-out]
    G --> I[(MySQL 8.0 Database)]
    H --> I
    I --> J[Dashboard Analytics: SheetJS Excel Export]
```

---

## 💻 Yêu Cầu Môi Trường
- **Node.js**: Phiên bản 18.18.0 trở lên (khuyên dùng Node.js 20 LTS).
- **Trình quản lý gói**: npm 9+ hoặc pnpm / yarn.
- **Cơ sở dữ liệu**: MySQL Server 8.0+ (hoặc MariaDB 10.5+).
- **Phần cứng ngoại vi (tùy chọn)**:
  - Webcam / Camera độ phân giải tối thiểu 720p.
  - Súng quét mã vạch 1D Barcode chuẩn USB HID (plug & play).

---

## 🗄 Cài Đặt & Cấu Hình Cơ Sở Dữ Liệu MySQL

### 1. Khởi động MySQL Server
Đảm bảo dịch vụ MySQL đang chạy trên máy chủ nội bộ hoặc máy cá nhân (Port mặc định: `3306`).
Trên Windows (PowerShell / Command Prompt):
```powershell
Get-Service MySQL*
# Nếu chưa chạy:
net start MySQL80
```

### 2. Tạo Cơ Sở Dữ Liệu `vlu_barcode_lab`
Đăng nhập vào MySQL CLI bằng tài khoản quản trị `root`:
```bash
mysql -u root -p
```
Nhập mật khẩu quản trị, sau đó thực thi các câu lệnh SQL sau để tạo cơ sở dữ liệu với bảng mã ký tự tiếng Việt đầy đủ (`utf8mb4`):
```sql
CREATE DATABASE IF NOT EXISTS vlu_barcode_lab 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Kiểm tra cơ sở dữ liệu đã được tạo thành công
SHOW DATABASES LIKE 'vlu_barcode_lab';
```

### 3. Cấu hình biến môi trường (`.env`)
Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc của dự án:
```env
# Chuỗi kết nối MySQL chuẩn: mysql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
DATABASE_URL="mysql://root:123456@localhost:3306/vlu_barcode_lab"

# Môi trường chạy
NODE_ENV="development"
```

### 4. Đồng bộ Schema Prisma vào MySQL
Dự án sử dụng Prisma ORM để quản lý cấu trúc bảng. Chạy lệnh sau để tự động tạo toàn bộ các bảng, khóa ngoại và chỉ mục index vào MySQL:
```bash
npx prisma db push
```

### 5. Nạp dữ liệu khởi tạo mẫu thực tế (Database Seeding)
Chạy script seed tự động để nạp dữ liệu:
- Danh sách phòng Lab CS3 (`LAB-CS3-G801` - Phòng Lab Mạng máy tính & An ninh mạng).
- 40 máy trạm phòng Lab (`EQ-LAB801-PC01` đến `EQ-LAB801-PC40`).
- Danh sách tài khoản giảng viên hướng dẫn và sinh viên thực tập.
- Các khung ca trực tiêu chuẩn.

```bash
npx prisma db seed
```

---

## 📊 Mô Hình Dữ Liệu (Prisma ORM & Schema)

### Các Thực Thể Chính
- `User`: Lưu thông tin sinh viên, giảng viên và quản trị viên phòng Lab.
- `LabRoom`: Danh mục các phòng máy thực hành, tòa nhà, sức chứa máy.
- `LabEquipment`: Quản lý 40 máy tính trạm, cấu hình phần cứng, trạng thái (`GOOD`, `BROKEN`, `REPAIRING`).
- `Shift`: Khung ca trực / ca thực hành (`07:00` - `21:30`).
- `DutySchedule`: Lịch phân công trực phòng Lab theo từng ngày.
- `AttendanceLog`: Lưu vết điểm danh chi tiết:
  - `checkInTime`: Thời điểm quét thẻ vào.
  - `checkOutTime`: Thời điểm quét thẻ ra (có thể check-out bất cứ lúc nào).
  - `totalHours`: Số giờ quy đổi.
  - `checkInSnapshot`: Ảnh snapshot khuôn mặt Base64 chụp lúc quét thẻ.
  - `scanMethod`: Phương thức (`WEBCAM` hoặc `USB_SCANNER`).
- `Incident`: Phiếu báo cáo sự cố máy tính khi sinh viên hoặc kỹ thuật viên quét mã `EQ-`.

---

## ⚡ Các Phân Hệ Chức Năng

### 1. Trạm Quét Kiosk Tự Động (`/scan-station`)
- **Full-Duplex Scanning**: Hỗ trợ đồng thời cả camera máy tính và súng bắn mã vạch USB.
- **Linh hoạt Check-in / Check-out**: Sinh viên quét lần 1 để Check-in, quét lần 2 bất cứ lúc nào để Check-out mà không bị ràng buộc ca trực cứng nhắc.
- **Thời gian hiển thị chi tiết**: Tính toán chính xác thời gian lưu lại phòng máy định dạng tiếng Việt chuẩn (`15 giây`, `4 phút 50 giây`, `2 giờ 15 phút`).
- **Web Audio Chime FX**: Âm thanh phản hồi tần số cao khi Check-in ($G_5 \rightarrow C_6 \rightarrow E_6$) và hạ âm ấm áp khi Check-out ($E_6 \rightarrow C_6 \rightarrow A_5$) không phụ thuộc tài nguyên ngoài.

### 2. Quản Lý Thiết Bị & In Tem Decal A4 (`/equipments`)
- Quản lý danh mục 40 máy PC tại phòng G8.01.
- Chuyển đổi trạng thái máy nhanh 1-click (`GOOD` $\rightarrow$ `BROKEN` $\rightarrow$ `REPAIRING`).
- Tạo lô mã vạch và in tem chuẩn Decal A4 khổ 3 cột bằng CSS `@media print`.

### 3. Dashboard Quản Trị & Xuất Báo Cáo Excel (`/dashboard`)
- Thống kê thời gian thực số lượt quét, sinh viên đang có mặt và tình trạng thiết bị.
- Bảng nhật ký chi tiết hỗ trợ tìm kiếm theo tên, MSSV, phòng máy và lọc trạng thái.
- Tự động xuất file chấm công Excel (`.xlsx`) chuẩn hóa qua thư viện **SheetJS**.

### 4. Quản Lý Sự Cố Kỹ Thuật (`/incidents`)
- Tự động tạo phiếu sự cố khi quét mã vạch máy trạm tại Kiosk.
- Phân cấp mức độ nghiêm trọng: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- Quản lý vòng đời khắc phục: `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED`.

---

## 🔌 Tài Liệu API Endpoint

| Phương thức | Đường dẫn API | Mô tả chức năng |
| :--- | :--- | :--- |
| `POST` | `/api/attendance/scan` | Xử lý quét Barcode điểm danh hoặc định tuyến thiết bị `EQ-` |
| `GET` | `/api/attendance/scan` | Lấy danh sách 25 lượt điểm danh gần nhất trong ngày |
| `GET` | `/api/dashboard` | Cung cấp số liệu KPI, biểu đồ và toàn bộ log phục vụ xuất Excel |
| `GET` | `/api/equipments` | Lấy danh sách máy trạm theo phòng Lab và trạng thái |
| `PATCH` | `/api/equipments` | Cập nhật nhanh trạng thái máy tính (`status`) |
| `GET` | `/api/incidents` | Lấy danh sách phiếu báo sự cố máy tính |
| `PATCH` | `/api/incidents` | Cập nhật tiến độ xử lý sự cố (`incidentStatus`) |
| `GET` | `/api/users` | Quản lý danh sách sinh viên & giảng viên phòng Lab |

---

## 🚀 Khởi Chạy Ứng Dụng

### 1. Cài đặt các gói npm
```bash
npm install
```

### 2. Chạy ứng dụng trong môi trường Development
```bash
npm run dev
```
Truy cập giao diện tại: **[http://localhost:3000](http://localhost:3000)**

### 3. Build và chạy Production
```bash
npm run build
npm start
```

---

## 🏷 Quy Chuẩn Kỹ Thuật Mã Vạch (Code 128)
- **Thẻ Sinh Viên**: Mã hóa chuỗi MSSV chuẩn Văn Lang (VD: `2373401010100`).
- **Thiết Bị Phòng Lab**: Tiền tố `EQ-` kết hợp mã phòng và số thứ tự máy trạm (VD: `EQ-LAB801-PC01` đến `EQ-LAB801-PC40`).
- **Độ phân giải in**: Tối thiểu 300 DPI, chuẩn tỷ lệ thanh 1:2.5 giúp súng quét đọc ngay cả trong điều kiện ánh sáng yếu.
