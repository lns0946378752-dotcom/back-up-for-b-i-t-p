import type { NextFunction, Request, Response } from 'express';

/**
 * Ghi nhận method và path của request để quan sát lượt gọi API.
 * Không ghi body để tránh đưa dữ liệu cá nhân vào log.
 */
export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Ghi thông tin tối thiểu rồi gọi next để request tiếp tục tới middleware/route.
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
};
