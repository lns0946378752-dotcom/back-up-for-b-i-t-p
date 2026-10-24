// Nạp biến môi trường ngay khi ứng dụng khởi động để có thể đọc PORT bên dưới.
import 'dotenv/config';
// Import kiểu Request/Response chỉ phục vụ TypeScript, không tạo mã JavaScript lúc chạy.
import express, { type Request, type Response } from 'express';
// Cho phép client từ origin khác gửi request tới API.
import cors from 'cors';
// Thêm các HTTP header giúp ứng dụng có cấu hình an toàn hơn.
import helmet from 'helmet';
// Route chứa các URL liên quan đến tài nguyên sinh viên.
import sinhVienRoutes from './routes/sinhVien.routes.js';
// Error middleware nhận các lỗi được chuyển tiếp từ middleware và controller.
import { errorMiddleware } from './middlewares/error.middleware.js';
// Logger ghi lại method và path của mỗi request đi vào server.
import { loggerMiddleware } from './middlewares/logger.middleware.js';

// Tạo ứng dụng Express để đăng ký middleware và các route HTTP.
const app = express();
// Ưu tiên cổng trong .env; dùng 5000 nếu biến PORT chưa được khai báo.
const PORT = Number(process.env.PORT ?? 5000);

// Ghi method và path trước khi request đi vào các middleware còn lại.
app.use(loggerMiddleware);

// Áp dụng các header bảo mật cho response.
app.use(helmet());
// Cho phép các origin khác gửi request tới API.
app.use(cors());
// Phân tích request body JSON để controller có thể đọc req.body.
app.use(express.json());

// Endpoint đơn giản để xác nhận server đã khởi động và phản hồi được.
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend quản lý sinh viên đang hoạt động',
  });
});

// Gắn tiền tố chung cho các endpoint sinh viên, ví dụ GET /api/v1/sinh-vien.
app.use('/api/v1/sinh-vien', sinhVienRoutes);

// Phản hồi thống nhất khi request không khớp route nào.
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy đường dẫn',
  });
});

// Error middleware phải nằm cuối để Express chuyển lỗi từ các bước phía trên tới đây.
app.use(errorMiddleware);

// Bắt đầu nhận kết nối HTTP tại cổng đã cấu hình.
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
