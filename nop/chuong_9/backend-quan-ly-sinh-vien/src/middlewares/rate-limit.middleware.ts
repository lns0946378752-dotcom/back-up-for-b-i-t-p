import { rateLimit } from 'express-rate-limit';

/**
 * Middleware giới hạn tần suất gọi API Đăng nhập (Chương 09 – Lab 2).
 * Hạn chế tấn công brute-force mật khẩu và spam request:
 * - Giới hạn 5 requests trong cửa sổ 60 giây (1 phút).
 * - Vượt giới hạn trả về HTTP 429 Too Many Requests theo hợp đồng JSON thống nhất.
 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  limit: 5, // Tối đa 5 lượt gọi
  standardHeaders: 'draft-7', // Trả về headers: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    status: 429,
    message: 'Bạn đã gửi quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 1 phút',
    data: null,
  },
});
