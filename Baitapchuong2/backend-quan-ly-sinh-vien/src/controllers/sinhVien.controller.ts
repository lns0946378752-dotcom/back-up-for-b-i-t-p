import type { NextFunction, Request, Response } from 'express';
import {
  layDanhSachSinhVien,
  themSinhVien,
  timSinhVienTheoMa,
} from '../services/sinhVien.service.js';

/**
 * Xử lý GET danh sách: Controller nối HTTP với Service rồi định dạng response.
 */
export const getDanhSachSinhVien = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Lấy dữ liệu từ Service; Controller không tự truy cập mảng lưu trữ.
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách sinh viên thành công',
      data: layDanhSachSinhVien(),
    });
  } catch (error) {
    // Chuyển lỗi sang error middleware để xử lý response tại một nơi thống nhất.
    next(error);
  }
};

/**
 * Xử lý GET theo mã sinh viên lấy từ tham số URL.
 */
export const getSinhVienTheoMa = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Express cung cấp giá trị động trong URL ở req.params.
    const { maSV } = req.params;
    // Bảo vệ kiểu dữ liệu trước khi truyền mã sang Service.
    if (typeof maSV !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Mã sinh viên không hợp lệ',
      });
      return;
    }

    // Service tìm sinh viên trong nguồn dữ liệu hiện tại.
    const sinhVien = timSinhVienTheoMa(maSV);
    if (!sinhVien) {
      // Dừng hàm sau response 404 để không gửi thêm response thành công.
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên',
      });
      return;
    }

    // Trả về dữ liệu tìm thấy với status HTTP thành công.
    res.status(200).json({
      success: true,
      message: 'Tìm sinh viên thành công',
      data: sinhVien,
    });
  } catch (error) {
    // Không xử lý lỗi lặp lại ở đây; giao cho middleware lỗi tập trung.
    next(error);
  }
};

/**
 * Xử lý POST tạo sinh viên mới từ request body.
 */
export const taoSinhVien = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Service chịu trách nhiệm kiểm tra dữ liệu và chỉ lưu khi hợp lệ.
    const newStudent = themSinhVien(req.body);
    // HTTP 201 biểu thị tài nguyên mới đã được tạo thành công.
    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công',
      data: newStudent,
    });
  } catch (error) {
    // Chuyển cả lỗi validation/trùng mã sang error middleware.
    next(error);
  }
};
