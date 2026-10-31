import { ForeignKeyConstraintError, Op, UniqueConstraintError } from 'sequelize';
import type { ICapNhatSinhVienDTO, ISinhVienDTO } from '../dtos/sinhVien.dto.js';
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

// ────────────────────────────────────────────────────────────────────
// Chương 08: Phân trang + Tìm kiếm
// ────────────────────────────────────────────────────────────────────

export interface IPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface IDanhSachPhanTrangResult {
  data: ISinhVienDTO[];
  pagination: IPaginationMeta;
}

/**
 * Lấy danh sách sinh viên có phân trang và tìm kiếm theo hoTen.
 * Sử dụng Sequelize findAndCountAll – giới hạn tại SQL Server, không slice JS.
 *
 * @param page   - Trang yêu cầu (mặc định 1, >= 1)
 * @param limit  - Số bản ghi mỗi trang (mặc định 10, 1–50)
 * @param search - Chuỗi tìm kiếm theo hoTen (tùy chọn, tối đa 80 ký tự)
 */
export const layDanhSachSinhVienPhanTrang = async (
  page: number,
  limit: number,
  search: string
): Promise<IDanhSachPhanTrangResult> => {
  const offset = (page - 1) * limit;

  // Điều kiện WHERE: lọc theo hoTen nếu có search
  const whereClause =
    search.length > 0
      ? { hoTen: { [Op.like]: `%${search}%` } }
      : {};

  const { rows, count } = await SinhVien.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['maSV', 'ASC']],
  });

  const totalItems = count;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    data: rows.map(toSinhVienDTO),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
};

/**
 * Lấy danh sách tất cả sinh viên từ Database SQL Server, sắp xếp theo maSV tăng dần.
 * Giữ nguyên để tương thích – Chương 08 dùng layDanhSachSinhVienPhanTrang thay thế.
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

  // 1. Kiểm tra định dạng maSV
  if (!/^SV[0-9]{3}$/.test(normalizedStudent.maSV)) {
    throw new AppError(
      400,
      'Mã sinh viên phải có định dạng SV kèm 3 chữ số (VD: SV003)'
    );
  }

  // 2. Kiểm tra hoTen
  if (!normalizedStudent.hoTen) {
    throw new AppError(400, 'Họ tên không được để trống');
  }
  if (normalizedStudent.hoTen.length > 150) {
    throw new AppError(400, 'Họ tên không được vượt quá 150 ký tự');
  }

  // 3. Kiểm tra maLop
  if (!normalizedStudent.maLop) {
    throw new AppError(400, 'Mã lớp không được để trống');
  }
  if (normalizedStudent.maLop.length > 50) {
    throw new AppError(400, 'Mã lớp không được vượt quá 50 ký tự');
  }

  // 4. Kiểm tra email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedStudent.email)) {
    throw new AppError(400, 'Email không đúng định dạng');
  }
  if (normalizedStudent.email.length > 254) {
    throw new AppError(400, 'Email không được vượt quá 254 ký tự');
  }

  // 5. Kiểm tra mã lớp phải tồn tại trong bảng Lop
  const existingLop = await Lop.findByPk(normalizedStudent.maLop);
  if (!existingLop) {
    throw new AppError(400, 'Mã lớp không tồn tại');
  }

  // 6. Kiểm tra trước xem maSV đã tồn tại chưa để trả 409
  const existingStudent = await SinhVien.findByPk(normalizedStudent.maSV);
  if (existingStudent) {
    throw new AppError(409, 'Mã sinh viên đã tồn tại');
  }

  // 7. Ghi vào SQL Server
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
    throw error;
  }
};

/**
 * Cập nhật thông tin sinh viên theo mã (PUT).
 * maSV lấy từ URL; body gồm đủ ba trường: hoTen, email, maLop.
 */
export const capNhatSinhVien = async (
  maSV: string,
  input: unknown
): Promise<ISinhVienDTO> => {
  const trimmedMaSV = maSV.trim();
  const student = await SinhVien.findByPk(trimmedMaSV);
  if (!student) {
    throw new AppError(404, 'Không tìm thấy sinh viên');
  }

  if (!isRecord(input)) {
    throw new AppError(400, 'Dữ liệu cập nhật phải là một đối tượng JSON');
  }

  const { hoTen, email, maLop } = input;
  if (
    typeof hoTen !== 'string' ||
    typeof email !== 'string' ||
    typeof maLop !== 'string'
  ) {
    throw new AppError(
      400,
      'Các trường hoTen, email, maLop đều phải là chuỗi (string)'
    );
  }

  const normalizedUpdate: ICapNhatSinhVienDTO = {
    hoTen: hoTen.trim(),
    email: email.trim(),
    maLop: maLop.trim(),
  };

  if (!normalizedUpdate.hoTen) {
    throw new AppError(400, 'Họ tên không được để trống');
  }
  if (normalizedUpdate.hoTen.length > 150) {
    throw new AppError(400, 'Họ tên không được vượt quá 150 ký tự');
  }

  if (!normalizedUpdate.maLop) {
    throw new AppError(400, 'Mã lớp không được để trống');
  }
  if (normalizedUpdate.maLop.length > 50) {
    throw new AppError(400, 'Mã lớp không được vượt quá 50 ký tự');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedUpdate.email)) {
    throw new AppError(400, 'Email không đúng định dạng');
  }
  if (normalizedUpdate.email.length > 254) {
    throw new AppError(400, 'Email không được vượt quá 254 ký tự');
  }

  const existingLop = await Lop.findByPk(normalizedUpdate.maLop);
  if (!existingLop) {
    throw new AppError(400, 'Mã lớp không tồn tại');
  }

  try {
    await student.update(normalizedUpdate);
    return toSinhVienDTO(student);
  } catch (error: unknown) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new AppError(400, 'Mã lớp không tồn tại');
    }
    throw error;
  }
};

/**
 * Xóa một sinh viên theo mã (DELETE).
 * Xóa thành công trả void; không tìm thấy ném AppError(404).
 */
export const xoaSinhVien = async (maSV: string): Promise<void> => {
  const trimmedMaSV = maSV.trim();
  const student = await SinhVien.findByPk(trimmedMaSV);
  if (!student) {
    throw new AppError(404, 'Không tìm thấy sinh viên');
  }

  await student.destroy();
};
