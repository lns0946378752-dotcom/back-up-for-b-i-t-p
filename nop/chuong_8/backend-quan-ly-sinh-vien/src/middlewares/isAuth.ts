import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: 'Thiếu header Authorization',
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1].trim()) {
    res.status(401).json({
      success: false,
      message: 'Định dạng token không hợp lệ (yêu cầu: Bearer <token>)',
    });
    return;
  }

  const token = parts[1].trim();

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Xác thực token thất bại',
    });
  }
};
