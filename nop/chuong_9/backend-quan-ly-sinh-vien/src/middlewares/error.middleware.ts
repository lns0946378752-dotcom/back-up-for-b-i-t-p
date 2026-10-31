import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  // 1. AppError (lỗi nghiệp vụ có chủ đích: 400, 401, 403, 404, 409, 413,...)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      status: error.statusCode,
      message: error.message,
      data: null,
    });
    return;
  }

  // 2. SyntaxError: JSON body sai cú pháp
  if (
    error instanceof SyntaxError &&
    'status' in error &&
    error.status === 400
  ) {
    res.status(400).json({
      success: false,
      status: 400,
      message: 'Dữ liệu JSON trong body sai cú pháp',
      data: null,
    });
    return;
  }

  // 3. Lỗi hệ thống 500 không lường trước
  console.error('[UNHANDLED SERVER ERROR]:', error);

  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    status: 500,
    message: 'Lỗi hệ thống, vui lòng thử lại sau',
    data: null,
    ...(isDevelopment && {
      stack: error instanceof Error ? error.stack : String(error),
    }),
  });
};
