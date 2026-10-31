import { sequelize } from '../config/database.js';
import { Lop, SinhVien } from '../models/index.js';

/**
 * Script kiểm tra độc lập quan hệ 1-N giữa Lop và SinhVien qua Sequelize ORM (Mục 20).
 * Sử dụng include alias 'lop' và include alias 'sinhViens'.
 */
async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('--- KIỂM TRA QUAN HỆ 1-N (SEQUELIZE INCLUDE) ---');

    // 1. Lấy danh sách sinh viên kèm thông tin lớp (alias 'lop')
    const sinhViens = await SinhVien.findAll({
      include: [{ model: Lop, as: 'lop' }],
      order: [['maSV', 'ASC']],
    });

    console.log('\n[DANH SÁCH SINH VIÊN KÈM LỚP]');
    for (const sv of sinhViens) {
      const svJson = sv.toJSON() as any;
      console.log(
        `Sinh viên: ${svJson.maSV} - ${svJson.hoTen} | Lớp: ${svJson.lop?.maLop} (${svJson.lop?.tenLop})`
      );
    }

    // 2. Lấy danh sách lớp kèm danh sách sinh viên trực thuộc (alias 'sinhViens')
    const lops = await Lop.findAll({
      include: [{ model: SinhVien, as: 'sinhViens' }],
      order: [['maLop', 'ASC']],
    });

    console.log('\n[DANH SÁCH LỚP KÈM SINH VIÊN TRỰC THUỘC]');
    for (const lop of lops) {
      const lopJson = lop.toJSON() as any;
      console.log(
        `Lớp ${lopJson.maLop} (${lopJson.tenLop}) có ${lopJson.sinhViens?.length ?? 0} sinh viên:`
      );
      for (const sv of lopJson.sinhViens ?? []) {
        console.log(`   - ${sv.maSV}: ${sv.hoTen} (${sv.email})`);
      }
    }

    console.log('\n✅ KIỂM TRA QUAN HỆ 1-N THÀNH CÔNG!');
  } catch (error: unknown) {
    console.error('❌ Lỗi kiểm tra quan hệ:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
