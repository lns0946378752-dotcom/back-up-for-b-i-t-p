# NHẬT KÝ PROMPT CTCO VÀ PHẢN BIỆN KỸ THUẬT CHƯƠNG 09
## KIỂM THỬ TỰ ĐỘNG, BẢO MẬT & TRIỂN KHAI DOCKER

---

## 1. HỆ THỐNG PROMPT CTCO THỰC HIỆN TRONG CHƯƠNG 09

### PROMPT 1: Cấu hình Jest + ESM + TypeScript (Lab 1)
- **C (Context):** Project dùng pnpm, Express 5, TypeScript, type: module, ESM/NodeNext; có package.json và tsconfig.json.
- **T (Task):** Cài Jest, ts-jest, Supertest; tạo cấu hình kiểm thử `jest.config.mjs` và `tsconfig.spec.json` phù hợp ESM, chạy mượt mà trên Windows.
- **C (Constraint):** Không đổi sang CommonJS; không thay TS bằng JS; không sửa logic nghiệp vụ của các module cũ.
- **O (Output):** Cấu hình `ts-jest/presets/default-esm`, moduleNameMapper cho đuôi `.js`, smoke test chạy thành công.

### PROMPT 2: Viết 5 Unit Tests cho Login Service với Mock (Lab 1)
- **C (Context):** Đã khảo sát `AuthService.login`, User Model Sequelize và tiện ích `jwt.ts`.
- **T (Task):** Viết bộ 5 Unit Test T01–T05 kiểm thử logic xác thực: tài khoản đúng/sai, tài khoản không tồn tại, validate input và lỗi CSDL.
- **C (Constraint):** Sử dụng Mock cô lập phụ thuộc CSDL thật; không hardcode JWT_SECRET thật; kiểm tra chặt chẽ việc KHÔNG cấp JWT khi sai mật khẩu.
- **O (Output):** File `tests/unit/login.test.ts` hoàn chỉnh, 100% test PASS.

### PROMPT 3: Viết API Test với Supertest kiểm tra luồng HTTP & Auth (Lab 1)
- **C (Context):** Express 5 có `/api/auth/login`, `/api/auth/profile`, middleware `isAuth` và Global Error Handler.
- **T (Task):** Tách `src/app.ts` khỏi `src/server.ts` để Supertest gửi request trực tiếp không cần mở cổng PORT; kiểm tra các mã 200, 400, 401, 404.
- **C (Constraint):** Không tạo instance Express app thứ hai; giữ nguyên các middleware bảo mật và hợp đồng API cũ.
- **O (Output):** File `tests/api/auth.api.test.ts` kiểm thử đầy đủ A01–A07.

### PROMPT 4: Tích hợp Helmet và Rate Limit cho API Login (Lab 2)
- **C (Context):** Hệ thống có Swagger YAML, Express 5, route Login công khai dễ bị brute-force.
- **T (Task):** Bổ sung Helmet toàn ứng dụng và middleware `loginLimiter` riêng cho `POST /api/auth/login` (tối đa 5 requests / 60 giây, trả HTTP 429).
- **C (Constraint):** Response 429 phải đúng chuẩn JSON `{success: false, status: 429, message: "...", data: null}`; không ảnh hưởng đến endpoint GET sinh viên.
- **O (Output):** File `src/middlewares/rate-limit.middleware.ts` và gắn vào `src/routes/auth.routes.ts`.

### PROMPT 5: Security Review & Báo cáo bảo mật OWASP (Lab 2)
- **C (Context):** Mã nguồn thực tế của Controller, Service, Middleware và CSDL SQL Server.
- **T (Task):** Lập bảng đánh giá các nguy cơ: SQL Injection, XSS, lộ thông tin nội bộ, BOLA phân quyền, Brute-force Login và File Upload.
- **C (Constraint):** Dựa trên bằng chứng kỹ thuật có thật trong mã nguồn; không bịa đặt lỗ hổng.
- **O (Output):** Tài liệu `docs/security-report.md` và ma trận S01–S07.

### PROMPT 6: Đo lường và Tối ưu hóa Truy vấn SQL Server (Lab 2)
- **C (Context):** Bảng `dbo.SinhVien`, câu lệnh phân trang `ORDER BY maSV ASC OFFSET ... FETCH NEXT ...` kết hợp `LIKE N'%Anh%'`.
- **T (Task):** Hướng dẫn bật `SET STATISTICS IO ON; SET STATISTICS TIME ON;`, phân tích Execution Plan và so sánh Logical Reads trước/sau tối ưu.
- **C (Constraint):** Không thay đổi cấu trúc bảng, không làm sai lệch thứ tự hoặc số dòng trả về của phân trang.
- **O (Output):** Tài liệu `docs/sql-optimization.md`.

### PROMPT 7: Xây dựng Dockerfile Multi-Stage tối ưu kích thước (Lab 3)
- **C (Context):** Dự án Node.js 22, pnpm, TypeScript, Sequelize, SQL Server.
- **T (Task):** Tạo `Dockerfile` 2 stage (Build compile TypeScript -> Runtime chỉ lấy dist/ và prod dependencies) và file `.dockerignore`.
- **C (Constraint):** Không copy file `.env`, `node_modules` hay `dist` từ máy host vào image; không hardcode secret trong image.
- **O (Output):** `Dockerfile` và `.dockerignore` đạt chuẩn production.

### PROMPT 8: Thiết lập Docker Compose với Named Volumes (Lab 3)
- **C (Context):** Cần chạy Backend container kết nối SQL Server 2022 container trong cùng mạng ảo bridge.
- **T (Task):** Viết `compose.yaml` gồm 2 services `backend` và `sqlserver`, cấu hình biến môi trường, named volume `sqlserver-data` và `uploads-data`.
- **C (Constraint):** Dữ liệu CSDL và avatar tải lên phải bền vững (không bị mất khi chạy `docker compose down` rồi `up -d`).
- **O (Output):** File `compose.yaml` và `docs/deployment-report.md`.

---

## 2. PHẢN BIỆN CÁC ĐỀ XUẤT SAI TỪ AI

### PHẢN BIỆN 1: AI ĐỀ XUẤT MOCK CHÍNH HÀM CẦN TEST TRONG UNIT TEST
- **Vấn đề:** AI sinh bài Unit Test bằng cách mock luôn phương thức `authService.login = jest.fn().mockResolvedValue(...)`.
- **Phê phán:** Mock chính hàm đang cần kiểm thử khiến bài test trở nên vô nghĩa, vì nó chỉ kiểm tra kết quả mà mock trả về chứ không hề thực thi một dòng code logic nào của `AuthService`.
- **Sửa lại đúng chuẩn:** Giữ nguyên hàm `authService.login()`, chỉ mock các phụ thuộc bên ngoài (Dependency Mocking): `User.findOne`, `bcrypt.compare`, `jwt.sign`.

### PHẢN BIỆN 2: AI ĐỀ XUẤT COPY CẢ THƯ MỤC `node_modules` VÀO DOCKER IMAGE
- **Vấn đề:** Trong Dockerfile, AI viết `COPY . .` trước khi build, kéo theo toàn bộ `node_modules` được cài trên Windows vào Linux Container.
- **Phê phán:** Gây lỗi kiến trúc nhị phân (Binary Incompatibility) đối với các thư viện native C++ như `bcrypt`, đồng thời làm phình to build context lên hàng trăm MB.
- **Sửa lại đúng chuẩn:** Thiết lập `.dockerignore` loại trừ `node_modules`, và trong Dockerfile sử dụng `RUN pnpm install --frozen-lockfile` để cài đặt tương thích trực tiếp trên môi trường Linux.
