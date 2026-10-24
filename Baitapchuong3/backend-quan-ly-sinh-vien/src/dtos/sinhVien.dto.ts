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
