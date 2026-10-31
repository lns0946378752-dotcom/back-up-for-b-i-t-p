import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string({ error: 'fullName phải là chuỗi' })
      .trim()
      .min(1, 'Họ tên không được rỗng')
      .max(150, 'Họ tên tối đa 150 ký tự'),
    email: z
      .string({ error: 'email phải là chuỗi' })
      .trim()
      .email('Email không đúng định dạng')
      .max(254, 'Email tối đa 254 ký tự'),
    password: z
      .string({ error: 'password phải là chuỗi' })
      .min(6, 'Mật khẩu tối thiểu 6 ký tự')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z
      .string({ error: 'email phải là chuỗi' })
      .trim()
      .email('Email không đúng định dạng'),
    password: z
      .string({ error: 'password phải là chuỗi' })
      .min(1, 'Mật khẩu không được rỗng'),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
