import { Router } from 'express';
import {
  capNhatSinhVien,
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
  xoaSinhVien,
} from '../controllers/sinhVien.controller.js';

const router = Router();

router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);
router.post('/', taoSinhVien);
router.put('/:maSV', capNhatSinhVien);
router.delete('/:maSV', xoaSinhVien);

export default router;
