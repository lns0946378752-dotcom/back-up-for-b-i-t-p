# TỔNG HỢP HỒ SƠ NỘP BÀI THỰC HÀNH CHƯƠNG 07 (UPLOAD HÌNH ẢNH & KẾT NỐI FRONTEND - BACKEND)

- **Môn học:** Lập trình Backend (Node.js + Express + TypeScript + SQL Server + Vite React)
- **Chủ đề:** Upload Avatar (Multer <= 2MB, Magic Bytes), Public Static Files, CORS Configuration, Vite React + Axios SPA

---

## 1. THÀNH PHẦN HỒ SƠ NỘP
1. **Mã nguồn Backend:** Thư mục `backend-quan-ly-sinh-vien/` đầy đủ các tầng MVC, Middleware (`upload.middleware.ts`, `isAuth.ts`, `isAdmin.ts`), Phục vụ ảnh tĩnh `/uploads`.
2. **Mã nguồn Frontend:** Thư mục `frontend/` (Vite + React + TypeScript + Axios).
3. **Cơ sở dữ liệu:** Script `sql/07-add-avatar-url.sql` bổ sung cột `avatarUrl NVARCHAR(255) NULL` cho bảng `dbo.Users`.
4. **Swagger UI:** Cập nhật `docs/openapi.yaml` bổ sung `POST /api/auth/me/avatar` dạng `multipart/form-data`.
5. **Postman Collection:** File `postman/Buoi8-Multer-Upload.postman_collection.json` (12 ca test U01-U12).
6. **Báo cáo kiểm thử & Phản biện:**
   - [docs/test-results.md](file:///d:/Backend/back%20up%20for%20b%C3%A0i%20t%E1%BA%ADp/Baitapchuong7/backend-quan-ly-sinh-vien/docs/test-results.md)
   - [docs/prompt-log.md](file:///d:/Backend/back%20up%20for%20b%C3%A0i%20t%E1%BA%ADp/Baitapchuong7/backend-quan-ly-sinh-vien/docs/prompt-log.md)

---

## 2. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG (CẢ 2 PHẦN)

### Khởi chạy Backend (Port 5000):
```bash
cd "d:\Backend\back up for bài tập\Baitapchuong7\backend-quan-ly-sinh-vien"
pnpm dev
```
- Swagger UI: `http://localhost:5000/api-docs`

### Khởi chạy Frontend (Port 5173):
```bash
cd "d:\Backend\back up for bài tập\Baitapchuong7\frontend"
pnpm dev
```
- Giao diện Web: `http://localhost:5173`
