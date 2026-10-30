import { Router } from 'express';
import {
  capNhatSinhVien,
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
  xoaSinhVien,
} from '../controllers/sinhVien.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createSinhVienSchema,
  updateSinhVienSchema,
} from '../validations/sinhVien.schema.js';

const router = Router();

// 1. GET danh sách và GET theo mã (không cần validate body)
router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);

// 2. POST thêm mới: bắt buộc qua middleware validate(createSinhVienSchema)
router.post('/', validate(createSinhVienSchema), taoSinhVien);

// 3. PUT cập nhật: bắt buộc qua middleware validate(updateSinhVienSchema)
router.put('/:maSV', validate(updateSinhVienSchema), capNhatSinhVien);

// 4. DELETE xóa sinh viên theo mã
router.delete('/:maSV', xoaSinhVien);

export default router;
