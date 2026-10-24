import { Router } from 'express';
import {
  getDanhSachSinhVien,
  getSinhVienTheoMa,
  taoSinhVien,
} from '../controllers/sinhVien.controller.js';

const router = Router();

router.get('/', getDanhSachSinhVien);
router.get('/:maSV', getSinhVienTheoMa);
router.post('/', taoSinhVien);

export default router;
