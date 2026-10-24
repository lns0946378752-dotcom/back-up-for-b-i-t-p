/**
 * Khuôn dữ liệu sinh viên được dùng giữa các tầng trong ứng dụng.
 * TypeScript dùng interface này để kiểm tra cấu trúc dữ liệu lúc biên dịch.
 */
export interface ISinhVienDTO {
  maSV: string; // Mã sinh viên, ví dụ "SV001".
  hoTen: string; // Họ tên sinh viên.
  email: string; // Địa chỉ email liên hệ.
  maLop: string; // Mã lớp của sinh viên.
}
