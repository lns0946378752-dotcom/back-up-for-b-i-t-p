import type { ISinhVienDTO } from '../dtos/sinhVien.dto.js';
import { AppError } from '../utils/AppError.js';

// Dữ liệu chỉ lưu tạm trong RAM và sẽ trở về mẫu ban đầu khi server khởi động lại.
// Service sở hữu mảng để các chức năng đọc, tìm và thêm cùng thao tác trên một nguồn dữ liệu.
const sinhVienList: ISinhVienDTO[] = [
  {
    maSV: 'SV001',
    hoTen: 'Minh Nhật',
    email: 'minhnhat@example.com',
    maLop: '25CT114',
  },
  {
    maSV: 'SV002',
    hoTen: 'Lan Anh',
    email: 'lananh@example.com',
    maLop: '25CT114',
  },
];

/**
 * Thu hẹp unknown thành object có khóa để có thể kiểm tra từng trường an toàn.
 * Mảng và null bị loại vì chúng không phải object sinh viên hợp lệ.
 */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Trả về danh sách hiện tại; không sao chép hoặc tạo danh sách mới.
 */
export const layDanhSachSinhVien = (): ISinhVienDTO[] => sinhVienList;

/**
 * Tìm sinh viên theo mã duy nhất; undefined nghĩa là không có mã đó.
 */
export const timSinhVienTheoMa = (
  maSV: string
): ISinhVienDTO | undefined => sinhVienList.find((sinhVien) => sinhVien.maSV === maSV);

/**
 * Kiểm tra dữ liệu thô trước khi thay đổi mảng sinh viên.
 * Dữ liệu đầu vào là unknown vì request bên ngoài chưa được đảm bảo có kiểu DTO.
 */
export const themSinhVien = (input: unknown): ISinhVienDTO => {
  // Bước 1: chỉ chấp nhận object; từ chối null và array trước khi đọc thuộc tính.
  if (!isRecord(input)) {
    throw new AppError(400, 'Dữ liệu sinh viên phải là một đối tượng JSON');
  }

  // Bước 2: lấy đúng bốn trường cần có từ object nhận được.
  const { maSV, hoTen, email, maLop } = input;
  // Kiểm tra kiểu tại runtime vì interface TypeScript không kiểm tra JSON gửi từ client.
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

  // Bước 3: bỏ khoảng trắng thừa ở đầu/cuối trước khi kiểm tra và lưu dữ liệu.
  const normalizedStudent = {
    maSV: maSV.trim(),
    hoTen: hoTen.trim(),
    email: email.trim(),
    maLop: maLop.trim(),
  };

  // Bước 4: mã sinh viên phải gồm tiền tố SV và đúng ba chữ số.
  if (!/^SV[0-9]{3}$/.test(normalizedStudent.maSV)) {
    throw new AppError(
      400,
      'Mã sinh viên phải có định dạng SV kèm 3 chữ số (VD: SV003)'
    );
  }

  // Bước 5: họ tên và mã lớp không được để trống sau khi đã trim.
  if (!normalizedStudent.hoTen) {
    throw new AppError(400, 'Họ tên không được để trống');
  }

  if (!normalizedStudent.maLop) {
    throw new AppError(400, 'Mã lớp không được để trống');
  }

  // Bước 6: kiểm tra email theo định dạng cơ bản trước khi lưu.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedStudent.email)) {
    throw new AppError(400, 'Email không đúng định dạng');
  }

  // Bước 7: chỉ kiểm tra trùng mã sau khi các trường đã vượt qua validation.
  if (sinhVienList.some((sinhVien) => sinhVien.maSV === normalizedStudent.maSV)) {
    throw new AppError(409, 'Mã sinh viên đã tồn tại');
  }

  // Bước 8: tạo object sạch gồm đúng bốn trường DTO; bỏ qua trường thừa từ request.
  const newStudent: ISinhVienDTO = normalizedStudent;
  // Chỉ thay đổi mảng sau khi toàn bộ kiểm tra thành công.
  sinhVienList.push(newStudent);
  // Trả sinh viên vừa lưu để controller tạo response HTTP.
  return newStudent;
};
