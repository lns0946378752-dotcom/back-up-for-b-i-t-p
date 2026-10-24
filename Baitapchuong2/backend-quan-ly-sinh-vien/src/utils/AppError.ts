/**
 * Lỗi nghiệp vụ dự kiến, mang theo HTTP status và thông báo có thể gửi cho client.
 * Lớp này không phụ thuộc Express để Service có thể báo lỗi mà không xử lý HTTP.
 */
export class AppError extends Error {
  // Mã status được error middleware dùng khi tạo response.
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    // Khởi tạo phần message/name chuẩn của lỗi JavaScript.
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    // Bảo toàn quan hệ kế thừa Error để instanceof AppError hoạt động đúng.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
