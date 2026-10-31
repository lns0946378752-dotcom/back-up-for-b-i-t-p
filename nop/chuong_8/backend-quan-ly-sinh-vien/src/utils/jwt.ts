import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';

export interface JwtUserPayload {
  sub: string;
  role: 'student' | 'admin';
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new AppError(500, 'JWT_SECRET chưa được cấu hình trong biến môi trường');
  }
  return secret;
};

export const generateToken = (payload: { id: number | string; role: 'student' | 'admin' }): string => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return jwt.sign(
    {
      sub: String(payload.id),
      role: payload.role,
    },
    secret,
    {
      expiresIn: expiresIn as any,
      algorithm: 'HS256',
    }
  );
};

export const verifyToken = (token: string): JwtUserPayload => {
  const secret = getJwtSecret();
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as unknown as JwtUserPayload;

    if (!decoded.sub || !decoded.role) {
      throw new AppError(401, 'Token không chứa đầy đủ thông tin xác thực');
    }

    return decoded;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new AppError(401, 'Token đã hết hạn');
    }
    throw new AppError(401, 'Token không hợp lệ hoặc chữ ký sai');
  }
};
