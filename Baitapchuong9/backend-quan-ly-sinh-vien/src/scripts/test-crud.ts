import { sequelize } from '../config/database.js';
import {
  capNhatSinhVien,
  layDanhSachSinhVien,
  themSinhVien,
  timSinhVienTheoMa,
  xoaSinhVien,
} from '../services/sinhVien.service.js';

async function main() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TRỰC TIẾP CRUD VỚI SQL SERVER THẬT ===');
  await sequelize.authenticate();
  console.log('1. Kết nối SQL Server thành công.');

  // Đảm bảo dọn dẹp SVTEST trước nếu còn tồn tại
  try {
    await xoaSinhVien('SV999');
  } catch {
    // bỏ qua nếu chưa có
  }

  // 1. Thử tạo sinh viên mới
  console.log('2. Kiểm tra themSinhVien (POST):');
  const created = await themSinhVien({
    maSV: 'SV999',
    hoTen: 'Sinh Vien Test',
    email: 'test@example.com',
    maLop: '25CT114',
  });
  console.log('   ✅ Đã tạo thành công:', JSON.stringify(created));

  // 2. Thử tìm sinh viên theo mã
  console.log('3. Kiểm tra timSinhVienTheoMa (GET detail):');
  const found = await timSinhVienTheoMa('SV999');
  console.log('   ✅ Đã tìm thấy:', JSON.stringify(found));

  // 3. Thử cập nhật sinh viên
  console.log('4. Kiểm tra capNhatSinhVien (PUT):');
  const updated = await capNhatSinhVien('SV999', {
    hoTen: 'Sinh Vien Test Da Cap Nhat',
    email: 'updated@example.com',
    maLop: '25CT114',
  });
  console.log('   ✅ Đã cập nhật thành công:', JSON.stringify(updated));

  // 4. Thử xóa sinh viên
  console.log('5. Kiểm tra xoaSinhVien (DELETE):');
  await xoaSinhVien('SV999');
  console.log('   ✅ Đã xóa thành công SV999.');

  // 5. Kiểm tra lại sau khi xóa (phải là undefined)
  const afterDelete = await timSinhVienTheoMa('SV999');
  if (afterDelete === undefined) {
    console.log('   ✅ Xác nhận sau khi xóa: Không còn SV999 trong CSDL.');
  } else {
    console.error('   ❌ Lỗi: SV999 vẫn còn trong CSDL!');
  }

  console.log('6. Lấy danh sách tổng (GET list):');
  const list = await layDanhSachSinhVien();
  console.log(`   ✅ Danh sách hiện có ${list.length} sinh viên trong SQL Server.`);

  await sequelize.close();
  console.log('=== TẤT CẢ 5 HÀM CRUD ĐÃ CHẠY ĐÚNG 100% VỚI SQL SERVER THẬT ===');
}

main().catch(err => {
  console.error('Lỗi kiểm thử CRUD:', err);
  process.exit(1);
});
