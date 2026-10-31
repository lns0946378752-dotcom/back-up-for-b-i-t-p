# BÁO CÁO ĐÁNH GIÁ BẢO MẬT HỆ THỐNG BACKEND (CHƯƠNG 09 - LAB 2)
**Dự án:** `backend-quan-ly-sinh-vien` (Express 5, Sequelize 6, SQL Server, JWT, Helmet, Rate Limit)

---

## 1. PHẠM VI VÀ PHƯƠNG PHÁP REVIEW
- **Mục tiêu:** Rà soát toàn bộ các nguy cơ bảo mật trong kiến trúc ứng dụng Backend theo chuẩn OWASP Top 10 API Security.
- **Phương pháp:** Phân tích mã nguồn tĩnh (Static Code Analysis), kiểm thử hộp xám (Gray-box Testing) với Postman và kiểm tra phản hồi HTTP Headers.
- **Phạm vi file rà soát:**
  - `src/server.ts` & `src/app.ts`: Cấu hình Helmet, CORS, Middleware thứ tự.
  - `src/routes/auth.routes.ts` & `src/routes/sinhVien.routes.ts`: Kiểm soát phân quyền và Rate Limit.
  - `src/services/auth.service.ts` & `src/services/sinhVien.service.ts`: Mã hóa mật khẩu, truy vấn CSDL.
  - `src/middlewares/error.middleware.ts`: Chính sách che giấu thông tin lỗi hệ thống.

---

## 2. BẢNG PHÂN TÍCH RỦI RO VÀ GIẢI PHÁP THỰC HIỆN

| STT | Nguy cơ bảo mật | Mức độ rủi ro | Vị trí kiểm tra | Thực trạng & Giải pháp khắc phục đã áp dụng | Trạng thái |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **1** | **Brute-Force & Spam Login (CWE-307)** | **High** | `POST /api/auth/login` | Tích hợp middleware `loginLimiter` (dùng `express-rate-limit`): Giới hạn tối đa 5 lần gọi trong 60 giây từ 1 IP. Khi vượt ngưỡng, lập tức trả về mã `HTTP 429 Too Many Requests` kèm thông báo rõ ràng, ngăn chặn kẻ tấn công dò quét mật khẩu từ điển. | **ĐÃ BẢO VỆ (PASS)** |
| **2** | **SQL Injection (CWE-89)** | **Critical** | `src/services/sinhVien.service.ts` | Tuyệt đối không nối chuỗi thô (`'${search}'`). Sử dụng toán tử chuẩn của Sequelize ORM `{ hoTen: { [Op.like]: '%...%' } }` tự động tham số hóa (Parameterized Query) và thoát ký tự nguy hiểm trước khi gửi tới SQL Server Engine. | **ĐÃ BẢO VỆ (PASS)** |
| **3** | **Lộ thông tin nội bộ (Information Disclosure - CWE-209)** | **Medium** | `src/middlewares/error.middleware.ts` | Trong môi trường `production`, mã lỗi 500 trả về thông điệp trung tính `"Lỗi hệ thống, vui lòng thử lại sau"`, ẩn hoàn toàn `stack trace`, tên bảng, chuỗi SQL hay connection string. Trường `stack` chỉ bật cục bộ khi `NODE_ENV === 'development'`. | **ĐÃ BẢO VỆ (PASS)** |
| **4** | **Thiếu bảo vệ Security Headers (CWE-693)** | **Low** | Toàn bộ ứng dụng Express | Đã kích hoạt middleware `helmet()` giúp tự động thiết lập các header bảo vệ: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `X-DNS-Prefetch-Control`,... chống clickjacking và sniffing. | **ĐÃ BẢO VỆ (PASS)** |
| **5** | **Bypass Phân quyền (Broken Object Level Authorization - BOLA)** | **High** | `src/routes/sinhVien.routes.ts` | Mọi thao tác ghi dữ liệu (POST, PUT, DELETE) đều phải đi qua chuỗi xác thực bắt buộc: `isAuth` (kiểm tra tính hợp lệ của chữ ký JWT) -> `isAdmin` (kiểm tra vai trò `role === 'admin'`). Tài khoản Student bị từ chối với HTTP 403 Forbidden. | **ĐÃ BẢO VỆ (PASS)** |
| **6** | **Tải lên mã độc giả mạo đuôi ảnh (Unrestricted File Upload)** | **High** | `src/middlewares/upload.middleware.ts` | Multer giới hạn kích thước file <= 2MB (trả 413 nếu vượt). Kiểm tra Magic Bytes nhị phân (PNG: `89 50 4E 47`, JPEG: `FF D8 FF`), xóa ngay file nếu phát hiện file script/exe đổi đuôi giả mạo. | **ĐÃ BẢO VỆ (PASS)** |

---

## 3. MA TRẬN KIỂM THỬ BẢO MẬT THỰC TẾ (S01 - S07)

| Mã test | Tình huống kiểm thử | Hành động | Kết quả mong đợi | Thực tế | Đánh giá |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **S01** | Gửi 5 request Login trong 60 giây | POST `/api/auth/login` | Cả 5 request đều được tiếp nhận xử lý bình thường | Xử lý đăng nhập bình thường (200 nếu đúng, 401 nếu sai) | **PASS** |
| **S02** | Gửi request Login thứ 6 trong cùng 60s | POST `/api/auth/login` | Bị Rate Limiter chặn ngay lập tức, trả HTTP 429 | `HTTP 429 Too Many Requests`<br>`{"success":false,"status":429,"message":"Bạn đã gửi quá nhiều yêu cầu..."}` | **PASS** |
| **S03** | Đợi sau 60 giây cửa sổ | Gửi lại POST Login | Hạn mức được reset, cho phép đăng nhập lại | Tiếp nhận xử lý bình thường | **PASS** |
| **S04** | Gọi GET danh sách sinh viên liên tục | GET `/api/v1/sinh-vien` | Không bị ảnh hưởng bởi limiter của Login | Trả về 200 OK bình thường | **PASS** |
| **S05** | Kiểm tra Response Headers của server | Kiểm tra qua Postman / Curl | Xuất hiện các headers an toàn của Helmet | Có `X-Content-Type-Options: nosniff`, `X-XSS-Protection` | **PASS** |
| **S06** | Thử đăng nhập sai mật khẩu | Nhập sai pass | Trả 401, không sinh Token, bộ đếm limiter vẫn tăng | Trả 401 Unauthorized | **PASS** |
| **S07** | Sinh viên gọi DELETE xóa bản ghi | Bearer Token role "student" | Bị chặn bởi `isAdmin`, trả HTTP 403 | `HTTP 403 Forbidden` | **PASS** |
