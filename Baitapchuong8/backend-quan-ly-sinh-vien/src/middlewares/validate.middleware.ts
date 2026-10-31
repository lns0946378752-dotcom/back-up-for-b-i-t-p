import type { RequestHandler } from 'express';
import type { z } from 'zod';

/**
 * Middleware xác thực dữ liệu đầu vào bằng Zod Schema.
 * Nếu hợp lệ: gán dữ liệu đã chuẩn hóa (trim) vào req.body và gọi next().
 * Nếu không hợp lệ: ngắt luồng ngay, trả về HTTP 400 kèm chi tiết các trường lỗi.
 */
export const validate = (schema: z.ZodType): RequestHandler => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Dữ liệu đầu vào không hợp lệ',
        data: null,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'body',
          message: issue.message,
        })),
      });
      return; // Dừng, không cho vào Controller
    }

    req.body = parsed.data;
    next();
  };
};
