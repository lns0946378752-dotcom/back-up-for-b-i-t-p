/**
 * Khuôn dữ liệu sinh viên được dùng giữa các tầng trong ứng dụng.
 * Cả bốn trường đều bắt buộc và có kiểu chuỗi.
 */
export interface ISinhVienDTO {
  maSV: string;
  hoTen: string;
  email: string;
  maLop: string;
}

/**
 * DTO nhận dữ liệu cập nhật (PUT).
 * maSV được lấy từ URL params, body chỉ gồm hoTen, email, maLop.
 */
export interface ICapNhatSinhVienDTO {
  hoTen: string;
  email: string;
  maLop: string;
}
