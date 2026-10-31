import type { NextFunction, Request, Response } from 'express';
import {
  capNhatSinhVien as capNhatSinhVienService,
  layDanhSachSinhVien,
  themSinhVien,
  timSinhVienTheoMa,
  xoaSinhVien as xoaSinhVienService,
} from '../services/sinhVien.service.js';

/**
 * Controller lấy danh sách tất cả sinh viên.
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

/**
 * Controller cập nhật thông tin sinh viên theo mã (PUT).
 */
export const capNhatSinhVien = async (
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

    const data = await capNhatSinhVienService(maSV, req.body);
    res.status(200).json({
      success: true,
      message: 'Cập nhật sinh viên thành công',
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller xóa sinh viên theo mã (DELETE).
 */
export const xoaSinhVien = async (
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

    await xoaSinhVienService(maSV);
    res.status(200).json({
      success: true,
      message: 'Xóa sinh viên thành công',
    });
  } catch (error) {
    next(error);
  }
};
