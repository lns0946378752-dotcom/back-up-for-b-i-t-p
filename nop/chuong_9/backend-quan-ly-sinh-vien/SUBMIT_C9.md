# BÁO CÁO TỔNG KẾT BÀI TẬP THỰC HÀNH CHƯƠNG 09
## KIỂM THỬ, BẢO MẬT VÀ TRIỂN KHAI HỆ THỐNG BACKEND
**Môn học:** Lập trình Backend (Node.js, Express, Sequelize, SQL Server, Docker)

---

## 1. THÔNG TIN SINH VIÊN VÀ HỆ THỐNG
- **Họ và tên:** Lê Ngọc Sơn
- **Dự án:** `backend-quan-ly-sinh-vien` (Kế thừa và hoàn thiện từ Chương 08)
- **Công nghệ triển khai:**
  - Runtime: Node.js 22 LTS, TypeScript (ESM)
  - Framework: Express 5 (tách biệt `app.ts` và `server.ts`)
  - ORM: Sequelize 6 kết nối Microsoft SQL Server 2022
  - Testing: Jest 29, ts-jest, Supertest
  - Security: Helmet Security Headers, express-rate-limit (giới hạn 5 req/phút cho Login)
  - Dockerization: Dockerfile Multi-stage, Docker Compose với Named Volumes (`sqlserver-data`, `uploads-data`)

---

## 2. KẾT QUẢ THỰC HIỆN CẢ 3 BUỔI LAB

### BUỔI 12 (LAB 1) - AUTOMATED TESTING (JEST & SUPERTEST)
- Cấu hình thành công Jest và ts-jest chạy trên kiến trúc ESM/NodeNext (`jest.config.mjs`, `tsconfig.spec.json`).
- Viết đủ 5 Unit Test (**T01 - T05**) cho `AuthService.login` sử dụng Mock để cô lập Database: kiểm thử đăng nhập đúng, sai mật khẩu, tài khoản không tồn tại, validate input và lỗi kết nối CSDL.
- Viết đủ 7 API Test (**A01 - A07**) bằng Supertest kiểm thử toàn diện các status code: 200, 400, 401, 404 và bảo vệ Bearer Token.
- Toàn bộ 13 bài test đều **PASS 100%**.

### BUỔI 13 (LAB 2) - SECURITY & SQL OPTIMIZATION
- Cấu hình Helmet bổ sung đầy đủ các security headers chống sniffing và clickjacking.
- Tạo middleware `loginLimiter` chặn brute-force mật khẩu trên endpoint `POST /api/auth/login`, kiểm chứng mã lỗi `HTTP 429 Too Many Requests`.
- Hoàn thành báo cáo đánh giá bảo mật `docs/security-report.md` theo chuẩn OWASP Top 10 API Security.
- Phân tích và đo lường hiệu năng truy vấn phân trang SQL Server thật với `SET STATISTICS IO ON` và `SET STATISTICS TIME ON` (`docs/sql-optimization.md`).

### BUỔI 14 (LAB 3) - DOCKERIZATION & PERSISTENCE
- Viết `Dockerfile` Multi-stage tối ưu dung lượng (Stage 1 build TypeScript -> Stage 2 runtime Node slim).
- Thiết lập `.dockerignore` loại bỏ an toàn các thư mục rác và file bí mật `.env`.
- Soạn thảo `compose.yaml` phối hợp 2 container `backend` và `sqlserver` trong mạng riêng `app-network`.
- Sử dụng Named Volumes `sqlserver-data` và `uploads-data` chứng minh dữ liệu sinh viên và ảnh avatar không bị mất sau khi chạy `docker compose down` rồi khởi động lại.
- Báo cáo chi tiết tại: `docs/deployment-report.md`.

---

## 3. TỔNG HỢP KIỂM THỬ VÀ BẰNG CHỨNG
- **Unit Testing (T01 - T05):** PASS 100%
- **API Testing (A01 - A07):** PASS 100%
- **Security Testing (S01 - S07):** PASS 100%
- **Docker Testing (D01 - D09):** PASS 100%
- **Regression Testing (R01 - R05):** PASS 100%
- Chi tiết xem tại: `docs/test-results.md`
- Nhật ký prompt CTCO xem tại: `docs/prompt-log.md`
