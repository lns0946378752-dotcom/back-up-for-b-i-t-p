# BÁO CÁO TỔNG KẾT BÀI TẬP THỰC HÀNH CHƯƠNG 08
## TRUY VẤN NÂNG CAO, PHÂN TRANG VÀ XỬ LÝ LỖI TẬP TRUNG
**Môn học:** Lập trình Backend (Node.js, Express, Sequelize, SQL Server)

---

## 1. THÔNG TIN SINH VIÊN VÀ MÔI TRƯỜNG THỰC HIỆN
- **Họ và tên:** Lê Ngọc Sơn
- **Dự án:** `backend-quan-ly-sinh-vien` (Kế thừa trực tiếp từ Chương 07)
- **Công nghệ nền tảng:**
  - Runtime: Node.js (v20+) & TypeScript
  - Framework: Express 5 (Hỗ trợ Promise rejection async tự động chuyển sang Error Middleware)
  - ORM: Sequelize 6 kết nối Microsoft SQL Server thật (`QuanLySinhVienDB`)
  - Validation: Zod 4 cho cả Body DTO và Query String
  - Authentication / RBAC: JWT Bearer Token, Phân quyền Admin / Student
  - File Upload: Multer lưu ảnh đại diện vào `public/uploads/`
  - Documentation: Swagger UI qua OpenAPI 3.0 YAML (`/api-docs`)

---

## 2. KẾT QUẢ THỰC HIỆN HAI PHẦN LAB CHÍNH

### LAB 1: PAGINATION & SEARCH TRÊN SQL SERVER THẬT
1. **Validation Query String (`src/validations/sinhVien.query.ts`):**
   - `page`: Số nguyên dương >= 1, mặc định 1. Bắt các lỗi số âm, số thực, chữ số.
   - `limit`: Số nguyên dương từ 1 đến 50, mặc định 10. Chặn các giá trị > 50.
   - `search`: Chuỗi tìm kiếm theo họ tên (`hoTen`), tự động trim khoảng trắng, tối đa 80 ký tự.
   - Sai tham số query ném ngay `AppError(400)` đồng bộ, không gửi query lỗi xuống SQL Server.

2. **Truy vấn Sequelize Server-side (`src/services/sinhVien.service.ts`):**
   - Sử dụng `SinhVien.findAndCountAll(...)`.
   - Mệnh đề lọc: `where: { hoTen: { [Op.like]: '%search%' } }` áp dụng trước `count` và `limit/offset`.
   - Sắp xếp ổn định bắt buộc: `order: [['maSV', 'ASC']]`.
   - Tọa độ phân trang: `offset = (page - 1) * limit`.
   - Metadata trả về ở root: `{ page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) }`.
   - Dữ liệu `data` luôn là mảng (kể cả khi không có bản ghi nào hoặc page vượt quá).

3. **Cập nhật Đặc tả API (`docs/openapi.yaml`):**
   - Bổ sung parameters `page`, `limit`, `search` trong endpoint `GET /api/v1/sinh-vien`.
   - Schema phản hồi `SinhVienListResponse` có `pagination` và response `400 Bad Request`.

### LAB 2: GLOBAL ERROR HANDLING TẬP TRUNG
1. **Kiến trúc AppError (`src/utils/AppError.ts`):**
   - Kế thừa lớp `Error` chuẩn, mang theo `statusCode` định danh mã lỗi HTTP (400, 401, 403, 404, 409, 413,...).
2. **Global Error Middleware (`src/middlewares/error.middleware.ts`):**
   - Đặt ở cuối ứng dụng sau toàn bộ router và route fallback 404.
   - Chuẩn hóa cấu trúc phản hồi lỗi thống nhất:
     ```json
     {
       "success": false,
       "status": 400,
       "message": "Thông điệp lỗi chi tiết",
       "data": null
     }
     ```
   - Che giấu lỗi hệ thống 500: trả message an toàn `"Lỗi hệ thống, vui lòng thử lại sau"`.
   - Bảo mật thông tin: Tuyệt đối không để lộ `stack`, SQL query, connection string ở môi trường production. Chỉ đính kèm trường `stack` khi `NODE_ENV === 'development'`.
   - Hỗ trợ `res.headersSent` chuyển tiếp `next(error)` tránh lỗi ghi response 2 lần.

---

## 3. BẢO TỒN TÍNH TƯƠNG THÍCH VÀ KHÔNG HỒI QUY CHƯƠNG 07
- Toàn bộ tính năng Authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`) giữ nguyên hoạt động.
- Middleware `isAuth` và `isAdmin` tiếp tục bảo vệ các quyền POST, PUT, DELETE.
- Chức năng Upload Avatar qua Multer (`/api/auth/me/avatar`) tiếp tục kiểm tra kích thước 2MB (trả 413) và magic bytes nhị phân.
- Endpoint `GET /api/v1/sinh-vien` không truyền query vẫn trả về `200 OK` với mảng `data` đầy đủ, không gây lỗi các Client cũ.

---

## 4. TỔNG HỢP KIỂM THỬ (TEST RESULTS)
- **Lab 1 (P01 - P17):** Đạt 17/17 ca kiểm thử phân trang và tìm kiếm (PASS 100%).
- **Lab 2 (E01 - E10):** Đạt 10/10 ca kiểm thử xử lý lỗi 400, 404, 500 và bảo mật (PASS 100%).
- Chi tiết xem tại tài liệu: `docs/test-results.md`.
- Nhật ký prompt và phản biện AI xem tại: `docs/prompt-log.md`.
