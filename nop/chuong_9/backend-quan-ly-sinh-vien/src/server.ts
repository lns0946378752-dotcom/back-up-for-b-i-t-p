import 'dotenv/config';
import app from './app.js';
import { sequelize } from './config/database.js';

const PORT = Number(process.env.PORT ?? 5000);

/**
 * Hàm khởi động server:
 * Bắt buộc kết nối CSDL thành công trước khi Express mở cổng lắng nghe.
 */
async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Kết nối CSDL SQL Server thành công (QuanLySinhVienDB).');

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
      console.log(`Swagger UI khả dụng tại: http://localhost:${PORT}/api-docs`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[DATABASE STARTUP ERROR]:', error.name, error.message);
    } else {
      console.error(
        '[DATABASE STARTUP ERROR]: Không thể kết nối cơ sở dữ liệu khi khởi động.'
      );
    }
    await sequelize.close();
    process.exit(1);
  }
}

start();
