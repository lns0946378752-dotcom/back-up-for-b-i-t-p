import { Router } from 'express';
import {
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
} from '../controllers/sinhVien.controller.js';

// Router nhóm các endpoint liên quan đến sinh viên trước khi gắn vào server.
const router = Router();

// GET /api/v1/sinh-vien: lấy toàn bộ danh sách.
router.get('/', getDanhSachSinhVien);
// GET /api/v1/sinh-vien/:maSV: tìm một sinh viên theo mã trên URL.
router.get('/:maSV', getSinhVienTheoMa);
// POST /api/v1/sinh-vien: nhận dữ liệu mới trong request body.
router.post('/', taoSinhVien);

// Cho phép server gắn router này dưới tiền tố /api/v1/sinh-vien.
export default router;
