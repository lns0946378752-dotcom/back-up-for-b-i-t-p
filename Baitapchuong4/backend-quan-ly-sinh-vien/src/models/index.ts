import { Lop } from './Lop.js';
import { SinhVien } from './SinhVien.js';

/**
 * Thiết lập mối quan hệ 1-N giữa Lop và SinhVien:
 *   - Một Lớp có nhiều Sinh Viên (hasMany, alias 'sinhViens')
 *   - Mỗi Sinh Viên thuộc về một Lớp (belongsTo, alias 'lop')
 * Khóa ngoại liên kết là cột maLop.
 */
Lop.hasMany(SinhVien, {
  foreignKey: 'maLop',
  as: 'sinhViens',
});

SinhVien.belongsTo(Lop, {
  foreignKey: 'maLop',
  as: 'lop',
});

export { Lop, SinhVien };
