import { sequelize } from '../config/database.js';

/**
 * Script kiểm tra kết nối độc lập tới Database SQL Server.
 * Chạy xong sẽ đóng kết nối (close) và thoát tiến trình.
 */
async function main(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('DB connected: QuanLySinhVienDB');
  } catch (error: unknown) {
    // Thông báo chẩn đoán lỗi nhưng không hiển thị thông tin nhạy cảm/secrets
    if (error instanceof Error) {
      console.error('[DB CHECK FAILED]:', error.name, error.message);
    } else {
      console.error('[DB CHECK FAILED]: Không thể kết nối tới cơ sở dữ liệu');
    }
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();
