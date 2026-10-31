import { Router } from 'express';
import {
  capNhatSinhVien,
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
  xoaSinhVien,
} from '../controllers/sinhVien.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { isAuth } from '../middlewares/isAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  createSinhVienSchema,
  updateSinhVienSchema,
} from '../validations/sinhVien.schema.js';

const router = Router();

// 1. GET danh sách và GET theo mã (Public theo đúng yêu cầu đề bài)
router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);

// 2. POST thêm mới: isAuth -> isAdmin -> validate(createSinhVienSchema) -> taoSinhVien
router.post('/', isAuth, isAdmin, validate(createSinhVienSchema), taoSinhVien);

// 3. PUT cập nhật: isAuth -> isAdmin -> validate(updateSinhVienSchema) -> capNhatSinhVien
router.put('/:maSV', isAuth, isAdmin, validate(updateSinhVienSchema), capNhatSinhVien);

// 4. DELETE xóa sinh viên: isAuth -> isAdmin -> xoaSinhVien
router.delete('/:maSV', isAuth, isAdmin, xoaSinhVien);

export default router;
