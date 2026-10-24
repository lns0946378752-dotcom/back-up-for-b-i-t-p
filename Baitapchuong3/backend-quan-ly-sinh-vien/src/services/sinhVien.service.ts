import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import type { ISinhVienDTO } from '../dtos/sinhVien.dto.js';
import { Lop, SinhVien } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Hàm chuyển đổi instance Sequelize sang plain DTO đúng 4 trường.
 * Không làm lộ các thuộc tính nội bộ của Sequelize Model ra ngoài tầng Service.
 */
const toSinhVienDTO = (sv: SinhVien): ISinhVienDTO => ({
  maSV: sv.maSV,
  hoTen: sv.hoTen,
  email: sv.email,
  maLop: sv.maLop,
});

/**
 * Lấy danh sách tất cả sinh viên từ Database SQL Server, sắp xếp theo maSV tăng dần.
 */
export const layDanhSachSinhVien = async (): Promise<ISinhVienDTO[]> => {
  const sinhViens = await SinhVien.findAll({
    order: [['maSV', 'ASC']],
  });
  return sinhViens.map(toSinhVienDTO);
};

/**
 * Tìm sinh viên theo mã (khóa chính).
 * Trả về ISinhVienDTO nếu tìm thấy, hoặc undefined nếu không có để Controller trả về 404.
 */
export const timSinhVienTheoMa = async (
  maSV: string
): Promise<ISinhVienDTO | undefined> => {
  const sinhVien = await SinhVien.findByPk(maSV);
  if (!sinhVien) {
    return undefined;
  }
  return toSinhVienDTO(sinhVien);
};

/**
 * Xác thực dữ liệu và thêm một sinh viên mới vào SQL Server.
 * Bao gồm kiểm tra ràng buộc khóa ngoại với bảng Lop (Mục 20 mở rộng).
 */
export const themSinhVien = async (input: unknown): Promise<ISinhVienDTO> => {
  if (!isRecord(input)) {
    throw new AppError(400, 'Dữ liệu sinh viên phải là một đối tượng JSON');
  }

  const { maSV, hoTen, email, maLop } = input;
  if (
    typeof maSV !== 'string' ||
    typeof hoTen !== 'string' ||
    typeof email !== 'string' ||
    typeof maLop !== 'string'
  ) {
    throw new AppError(
      400,
      'Các trường maSV, hoTen, email, maLop đều phải là chuỗi (string)'
    );
  }

  const normalizedStudent: ISinhVienDTO = {
    maSV: maSV.trim(),
    hoTen: hoTen.trim(),
    email: email.trim(),
    maLop: maLop.trim(),
  };

  // 1. Kiểm tra định dạng maSV: bắt đầu bằng SV và theo sau là 3 chữ số
  if (!/^SV[0-9]{3}$/.test(normalizedStudent.maSV)) {
    throw new AppError(
      400,
      'Mã sinh viên phải có định dạng SV kèm 3 chữ số (VD: SV003)'
    );
  }

  // 2. Kiểm tra hoTen không rỗng và độ dài tối đa 150 ký tự
  if (!normalizedStudent.hoTen) {
    throw new AppError(400, 'Họ tên không được để trống');
  }
  if (normalizedStudent.hoTen.length > 150) {
    throw new AppError(400, 'Họ tên không được vượt quá 150 ký tự');
  }

  // 3. Kiểm tra maLop không rỗng và độ dài tối đa 50 ký tự
  if (!normalizedStudent.maLop) {
    throw new AppError(400, 'Mã lớp không được để trống');
  }
  if (normalizedStudent.maLop.length > 50) {
    throw new AppError(400, 'Mã lớp không được vượt quá 50 ký tự');
  }

  // 4. Kiểm tra email đúng định dạng và độ dài tối đa 254 ký tự
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedStudent.email)) {
    throw new AppError(400, 'Email không đúng định dạng');
  }
  if (normalizedStudent.email.length > 254) {
    throw new AppError(400, 'Email không được vượt quá 254 ký tự');
  }

  // 5. Kiểm tra mã lớp phải tồn tại trong bảng Lop (Quy tắc mở rộng Mục 20)
  const existingLop = await Lop.findByPk(normalizedStudent.maLop);
  if (!existingLop) {
    throw new AppError(400, 'Mã lớp không tồn tại');
  }

  // 6. Kiểm tra trước xem maSV đã tồn tại chưa để trả 409
  const existingStudent = await SinhVien.findByPk(normalizedStudent.maSV);
  if (existingStudent) {
    throw new AppError(409, 'Mã sinh viên đã tồn tại');
  }

  // 7. Ghi vào SQL Server và xử lý tranh chấp khóa chính (409) hoặc khóa ngoại (400)
  try {
    const createdStudent = await SinhVien.create(normalizedStudent);
    return toSinhVienDTO(createdStudent);
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(409, 'Mã sinh viên đã tồn tại');
    }
    if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(400, 'Mã lớp không tồn tại');
    }
    // Các lỗi khác đẩy tiếp cho error middleware trả 500
    throw error;
  }
};
