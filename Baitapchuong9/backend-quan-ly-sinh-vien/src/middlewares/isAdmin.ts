import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Người dùng chưa được xác thực (chưa chạy qua isAuth)',
      data: null,
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      status: 403,
      message: 'Truy cập bị từ chối: Yêu cầu quyền admin',
      data: null,
    });
    return;
  }

  next();
};
