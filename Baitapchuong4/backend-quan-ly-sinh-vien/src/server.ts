import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './config/database.js';
import { swaggerSpec } from './config/swagger.config.js';
import sinhVienRoutes from './routes/sinhVien.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// 1. Logger middleware ghi lại method và path trước khi vào các middleware khác
app.use(loggerMiddleware);

// 2. Middleware nền tảng: bảo mật header, hỗ trợ CORS, phân tích JSON body
app.use(
  helmet({
    contentSecurityPolicy: false, // Để Swagger UI tải assets và inline scripts trơn tru
  })
);
app.use(cors());
app.use(express.json());

// 3. Route kiểm tra trạng thái máy chủ
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

// 4. Mount route Swagger UI tài liệu API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 5. Mount route sinh viên
app.use('/api/v1/sinh-vien', sinhVienRoutes);

// 6. Middleware bắt 404 cho các đường dẫn không tồn tại
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy đường dẫn',
  });
});

// 7. Error middleware tập trung xử lý lỗi
app.use(errorMiddleware);

/**
 * Hàm khởi động server:
 * Bắt buộc kết nối CSDL thành công trước khi Express mở cổng lắng nghe.
 */
async function start(): Promise<void> {
  try {
    // Xác thực kết nối CSDL trước khi mở HTTP server
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
