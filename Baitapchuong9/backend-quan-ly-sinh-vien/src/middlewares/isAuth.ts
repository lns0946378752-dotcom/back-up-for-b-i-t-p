import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Thiếu header Authorization hoặc không tìm thấy token',
      data: null,
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1].trim()) {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Định dạng token không hợp lệ (yêu cầu: Bearer <token>)',
      data: null,
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
      status: 401,
      message: error.message || 'Xác thực token thất bại',
      data: null,
    });
  }
};
