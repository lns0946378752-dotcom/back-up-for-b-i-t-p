import type { NextFunction, Request, Response } from 'express';
import {
  layDanhSachSinhVien,
  themSinhVien,
  timSinhVienTheoMa,
} from '../services/sinhVien.service.js';

/**
 * Controller lấy danh sách tất cả sinh viên.
 * Sử dụng async/await vì Service truy vấn SQL Server bất đồng bộ.
 */
export const getDanhSachSinhVien = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await layDanhSachSinhVien();
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller tìm sinh viên theo mã.
 */
export const getSinhVienTheoMa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { maSV } = req.params;
    if (typeof maSV !== 'string' || !maSV) {
      res.status(400).json({
        success: false,
        message: 'Mã sinh viên không hợp lệ',
      });
      return;
    }

    const data = await timSinhVienTheoMa(maSV);
    if (!data) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Tìm sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller thêm mới một sinh viên.
 */
export const taoSinhVien = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await themSinhVien(req.body);
    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};
