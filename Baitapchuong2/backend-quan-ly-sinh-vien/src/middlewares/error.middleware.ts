import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

/**
 * Error handler của Express có bốn tham số; tham số đầu tiên nhận lỗi được next(error) chuyển tới.
 */
export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  // Lỗi nghiệp vụ có chủ đích giữ nguyên status và message đã định nghĩa trong Service.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // express.json() phát sinh SyntaxError khi request body chứa JSON sai cú pháp.
  // Trả JSON 400 thay vì để Express tạo trang lỗi HTML mặc định.
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400
  ) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON trong body sai cú pháp',
    });
    return;
  }

  // Lỗi bất ngờ chỉ ghi chi tiết ở server; response client không tiết lộ thông tin nội bộ.
  console.error('[UNHANDLED ERROR]:', error);
  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống',
  });
};
