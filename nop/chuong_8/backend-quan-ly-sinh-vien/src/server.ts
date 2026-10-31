import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { sequelize } from './config/database.js';
import { swaggerSpec } from './config/swagger.config.js';
import { accessLogger } from './middlewares/access-log.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import sinhVienRoutes from './routes/sinhVien.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 5000);

// 1. Morgan logger ghi nhật ký truy cập vào file logs/access.log (chế độ append)
app.use(accessLogger);

// 2. Logger middleware in log console
app.use(loggerMiddleware);

// 3. Middleware nền tảng: bảo mật header, hỗ trợ CORS, phân tích JSON body
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cấu hình CORS cho phép Frontend Vite (localhost:5173 và các origin cục bộ)
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());

// Phục vụ ảnh tĩnh tải lên từ thư mục public/uploads
app.use('/uploads', express.static('public/uploads'));

// 4. Route kiểm tra trạng thái máy chủ
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

// 5. Route kiểm tra sức khỏe hệ thống (Health Check)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 6. Mount route Swagger UI tài liệu API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 7. Mount route Auth (Chương 6: Register, Login, Profile)
app.use('/api/auth', authRoutes);

// 8. Mount route sinh viên (đã tích hợp Zod Validation và Phân quyền JWT)
app.use('/api/v1/sinh-vien', sinhVienRoutes);

// 8. Middleware bắt 404 cho các đường dẫn không tồn tại
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Không tìm thấy đường dẫn',
    data: null,
  });
});

// 9. Error middleware tập trung xử lý lỗi
app.use(errorMiddleware);

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
