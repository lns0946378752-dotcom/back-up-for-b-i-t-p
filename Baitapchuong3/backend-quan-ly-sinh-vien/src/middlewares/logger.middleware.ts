import type { NextFunction, Request, Response } from 'express';

/**
 * Ghi nhận phương thức và đường dẫn, không ghi body hoặc dữ liệu cá nhân.
 */
export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
};
