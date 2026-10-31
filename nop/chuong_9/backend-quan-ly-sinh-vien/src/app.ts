import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import { accessLogger } from './middlewares/access-log.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import sinhVienRoutes from './routes/sinhVien.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// 1. Morgan logger ghi nhật ký truy cập vào file logs/access.log (chế độ append)
app.use(accessLogger);

// 2. Logger middleware in log console
app.use(loggerMiddleware);

// 3. Middleware bảo mật Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cấu hình CORS cho phép Frontend Vite
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

// 7. Mount route Auth (Register, Login với Rate Limit, Profile, Upload Avatar)
app.use('/api/auth', authRoutes);

// 8. Mount route sinh viên (CRUD, Phân trang, Tìm kiếm, RBAC)
app.use('/api/v1/sinh-vien', sinhVienRoutes);

// 9. Middleware bắt 404 cho các đường dẫn không tồn tại
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Không tìm thấy đường dẫn',
    data: null,
  });
});

// 10. Error middleware tập trung xử lý lỗi
app.use(errorMiddleware);

export default app;
