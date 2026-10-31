# TỔNG HỢP HỒ SƠ NỘP BÀI THỰC HÀNH CHƯƠNG 06 (AUTHENTICATION & AUTHORIZATION JWT)

- **Môn học:** Lập trình Backend (Node.js + Express + TypeScript + SQL Server)
- **Chủ đề:** Authentication, Bcrypt Password Hashing, JWT Bearer Token, Role-Based Access Control (RBAC)

---

## 1. THÀNH PHẦN HỒ SƠ NỘP
1. **Mã nguồn:** Thư mục `backend-quan-ly-sinh-vien/` đầy đủ các lớp Router, Controller, Service, Model (`User.ts`), Middlewares (`isAuth.ts`, `isAdmin.ts`, `validate.middleware.ts`), Utilities (`jwt.ts`), Seed Script (`seed-admin.ts`).
2. **Cơ sở dữ liệu:** File `sql/06-users-auth.sql` tạo bảng `dbo.Users` với ràng buộc UNIQUE email và cấp quyền cho user `sv_app`.
3. **Swagger UI:** Cập nhật file `docs/openapi.yaml` với bảo mật `bearerAuth`, 3 API Auth và bảo vệ các Route SinhVien.
4. **Postman Collection:** File `postman/Buoi7-JWT-RBAC.postman_collection.json` với 24 ca kiểm thử chi tiết.
5. **Nhật ký & Báo cáo kiểm thử:**
   - [docs/test-results.md](file:///d:/Backend/back%20up%20for%20b%C3%A0i%20t%E1%BA%ADp/Baitapchuong6/backend-quan-ly-sinh-vien/docs/test-results.md)
   - [docs/prompt-log.md](file:///d:/Backend/back%20up%20for%20b%C3%A0i%20t%E1%BA%ADp/Baitapchuong6/backend-quan-ly-sinh-vien/docs/prompt-log.md)

---

## 2. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN
1. Di chuyển vào thư mục dự án:
   ```bash
   cd "d:\Backend\back up for bài tập\Baitapchuong6\backend-quan-ly-sinh-vien"
   ```
2. Cài đặt các gói phụ thuộc (nếu tải mới):
   ```bash
   pnpm install
   ```
3. Chạy script seed tài khoản admin mẫu:
   ```bash
   pnpm tsx src/scripts/seed-admin.ts
   ```
4. Khởi động server:
   ```bash
   pnpm dev
   ```
5. Mở tài liệu Swagger UI trên trình duyệt:
   `http://localhost:5000/api-docs`
