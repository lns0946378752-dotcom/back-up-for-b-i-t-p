import { z } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Schema Zod validate query string cho GET /api/v1/sinh-vien
 * Chương 08 – Lab 1: Pagination + Search
 *
 * Quy ước:
 *   page  : số nguyên >= 1, mặc định 1
 *   limit : số nguyên 1–50, mặc định 10
 *   search: chuỗi tùy chọn theo hoTen, trim, tối đa 80 ký tự
 */
const sinhVienQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val, ctx) => {
      // Bắt ép kiểu không hợp lệ: "abc", "1.5", "-1", "0"
      if (!/^\d+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tham số page phải là số nguyên dương',
        });
        return z.NEVER;
      }
      const n = Number(val);
      if (n < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tham số page phải >= 1',
        });
        return z.NEVER;
      }
      return n;
    }),

  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val, ctx) => {
      if (!/^\d+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tham số limit phải là số nguyên dương',
        });
        return z.NEVER;
      }
      const n = Number(val);
      if (n < 1 || n > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tham số limit phải trong khoảng 1–50',
        });
        return z.NEVER;
      }
      return n;
    }),

  search: z
    .string()
    .optional()
    .default('')
    .transform((val) => val.trim())
    .refine((val) => val.length <= 80, {
      message: 'Từ khóa tìm kiếm không được vượt quá 80 ký tự',
    }),
});

export type ISinhVienQuery = {
  page: number;
  limit: number;
  search: string;
};

/**
 * Validate và chuẩn hóa query string cho endpoint GET danh sách sinh viên.
 * Ném AppError(400) nếu tham số không hợp lệ.
 */
export const validateSinhVienQuery = (raw: unknown): ISinhVienQuery => {
  const result = sinhVienQuerySchema.safeParse(raw);

  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new AppError(400, firstError?.message ?? 'Tham số query không hợp lệ');
  }

  return result.data as ISinhVienQuery;
};
