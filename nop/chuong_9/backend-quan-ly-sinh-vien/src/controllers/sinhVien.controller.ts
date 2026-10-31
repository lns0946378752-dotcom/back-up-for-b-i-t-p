import type { NextFunction, Request, Response } from 'express';
import {
  capNhatSinhVien as capNhatSinhVienService,
  layDanhSachSinhVienPhanTrang,
  themSinhVien,
  timSinhVienTheoMa,
  xoaSinhVien as xoaSinhVienService,
} from '../services/sinhVien.service.js';
import { validateSinhVienQuery } from '../validations/sinhVien.query.js';
import { AppError } from '../utils/AppError.js';

/**
 * Controller lấy danh sách sinh viên có phân trang và tìm kiếm.
 * Chương 08 – Lab 1: dùng findAndCountAll thay findAll.
 *
 * GET /api/v1/sinh-vien?page=1&limit=10&search=Anh
 */
export const getDanhSachSinhVien = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Validate & chuẩn hóa query string
    const { page, limit, search } = validateSinhVienQuery(req.query);

    // 2. Gọi Service – phân trang và tìm kiếm tại SQL Server
    const { data, pagination } = await layDanhSachSinhVienPhanTrang(page, limit, search);

    // 3. Trả về JSON – data là mảng, pagination ở cấp cao nhất
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data,
      pagination,
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
      throw new AppError(400, 'Mã sinh viên không hợp lệ');
    }

    const data = await timSinhVienTheoMa(maSV);
    if (!data) {
      throw new AppError(404, 'Không tìm thấy sinh viên');
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
      throw new AppError(400, 'Mã sinh viên không hợp lệ');
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
      throw new AppError(400, 'Mã sinh viên không hợp lệ');
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
