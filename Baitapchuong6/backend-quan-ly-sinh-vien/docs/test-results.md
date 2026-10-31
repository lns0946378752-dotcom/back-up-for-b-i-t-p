# BẢNG KẾT QUẢ KIỂM THỬ THỰC TẾ CHƯƠNG 06 (AUTHENTICATION & AUTHORIZATION JWT)

**Môi trường thử nghiệm:**
- **URL Base:** `http://localhost:5000`
- **Database:** SQL Server Local (`QuanLySinhVienDB` - Table: `dbo.Users` & `dbo.SinhVien`)
- **Bộ test Postman:** `Buoi7-JWT-RBAC.postman_collection.json` (24 ca test chuẩn theo ma trận đề bài)

---

## 1. MA TRẬN TEST AUTHENTICATION & JWT (A01 - A12)

| Mã | Request / Tình huống | Expected | Actual Status | Bằng chứng kiểm chứng | Đánh giá |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **A01** | Register email mới (`an.lab@example.com`), body hợp lệ | `201 Created` | `201 Created` | User được tạo trong SQL Server, role='student', password được hash bcrypt cost 12, không trả passwordHash ra response | **PASS** |
| **A02** | Register lặp lại email `an.lab@example.com` | `409 Conflict` | `409 Conflict` | Response báo message "Email này đã được sử dụng", không tạo bản ghi trùng | **PASS** |
| **A03** | Register body cố tình gửi kèm `role: "admin"` | `400 Bad Request` | `400 Bad Request` | Zod `.strict()` chặn field lạ; không thể leo quyền Admin qua API public | **PASS** |
| **A04** | Register thiếu password hoặc email sai định dạng | `400 Bad Request` | `400 Bad Request` | Zod Validation chặn dữ liệu sai cấu trúc trước Controller | **PASS** |
| **A05** | Login đúng tài khoản student (`an.lab@example.com` / `SinhVien@123`) | `200 OK` | `200 OK` | Trả về `accessToken` JWT HS256 có thời hạn 3600s (1h), lưu vào biến Postman `studentToken` | **PASS** |
| **A06** | Login sai password | `401 Unauthorized` | `401 Unauthorized` | Bcrypt so khớp thất bại, trả thông báo chung, không cấp token | **PASS** |
| **A07** | Login email không tồn tại trong hệ thống | `401 Unauthorized` | `401 Unauthorized` | Trả thông báo lỗi chung, không làm lộ thông tin tài khoản tồn tại | **PASS** |
| **A08** | `GET /api/auth/profile` không truyền Bearer token | `401 Unauthorized` | `401 Unauthorized` | `isAuth` middleware chặn ngay từ đầu, báo "Thiếu header Authorization" | **PASS** |
| **A09** | `GET /api/auth/profile` với token bị sửa 1 ký tự cuối | `401 Unauthorized` | `401 Unauthorized` | `jwt.verify` kiểm tra chữ ký HS256 thất bại, từ chối request | **PASS** |
| **A10** | `GET /api/auth/profile` với JWT student hợp lệ | `200 OK` | `200 OK` | Trả đúng thông tin `id`, `fullName`, `email`, `role`, tuyệt đối không có `passwordHash` | **PASS** |
| **A11** | `GET /api/auth/profile` với token đã hết hạn | `401 Unauthorized` | `401 Unauthorized` | Bắt lỗi `TokenExpiredError`, trả về "Token đã hết hạn" | **PASS** |
| **A12** | Login tài khoản Admin (`admin.lab@example.com`) | `200 OK` | `200 OK` | Cấp `accessToken` cho Admin có claim `role: "admin"`, lưu vào `adminToken` | **PASS** |

---

## 2. MA TRẬN PHÂN QUYỀN RBAC TRÊN SINH VIÊN (B01 - B12)

| Mã | Request / Tài khoản thao tác | Expected | Actual Status | Bằng chứng kiểm chứng | Đánh giá |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **B01** | `GET /api/v1/sinh-vien` không cần JWT | `200 OK` | `200 OK` | Route xem danh sách giữ Public theo hợp đồng, trả mảng sinh viên | **PASS** |
| **B02** | `POST /api/v1/sinh-vien` không gửi JWT | `401 Unauthorized` | `401 Unauthorized` | `isAuth` chặn thao tác ghi không có token; SQL Server không chèn bản ghi | **PASS** |
| **B03** | `PUT /api/v1/sinh-vien/SV01` token sai chữ ký | `401 Unauthorized` | `401 Unauthorized` | `isAuth` chặn; dữ liệu trong database giữ nguyên | **PASS** |
| **B04** | `DELETE /api/v1/sinh-vien/SV01` bằng tài khoản `student` | `403 Forbidden` | `403 Forbidden` | `isAdmin` phát hiện role='student', từ chối quyền xóa; sinh viên vẫn còn | **PASS** |
| **B05** | `POST /api/v1/sinh-vien` bằng tài khoản `student` | `403 Forbidden` | `403 Forbidden` | `isAdmin` chặn; không tạo sinh viên mới | **PASS** |
| **B06** | `PUT /api/v1/sinh-vien/SV01` bằng tài khoản `student` | `403 Forbidden` | `403 Forbidden` | `isAdmin` chặn; không cập nhật thông tin | **PASS** |
| **B07** | `POST /api/v1/sinh-vien` mã `SV_C6_99` bằng `admin` | `201 Created` | `201 Created` | `isAuth` & `isAdmin` cho phép; bản ghi được INSERT thành công vào DB | **PASS** |
| **B08** | `PUT /api/v1/sinh-vien/SV_C6_99` bằng `admin` | `200 OK` | `200 OK` | Admin có quyền sửa; họ tên được cập nhật thành công | **PASS** |
| **B09** | `DELETE /api/v1/sinh-vien/SV_C6_99` bằng `admin` | `200 OK` | `200 OK` | Admin xóa thành công; gọi lại GET trả về 404 Not Found | **PASS** |
| **B10** | Admin `POST` body vi phạm Zod schema (mã sai regex,...) | `400 Bad Request` | `400 Bad Request` | Middleware `validate` chạy sau `isAdmin`, vẫn bắt lỗi dữ liệu sai | **PASS** |
| **B11** | Admin `POST` mã sinh viên đã tồn tại (`SV01`) | `409 Conflict` | `409 Conflict` | Xử lý trùng khóa chính trả 409 nhất quán | **PASS** |
| **B12** | Admin `DELETE` mã `SV_C6_99` lần thứ 2 | `404 Not Found` | `404 Not Found` | Báo không còn dữ liệu để xóa, xử lý logic xóa sạch sẽ | **PASS** |

---

## 3. KẾT LUẬN & ĐÁNH GIÁ AN TOÀN BẢO MẬT
1. **Mật khẩu:** Toàn bộ mật khẩu được băm bằng thuật toán `bcrypt` với Salt Round (cost) = 12. Không bao giờ lưu hay phản hồi mật khẩu rõ / passwordHash ra client.
2. **Access Token:** Ký chuẩn thuật toán đối xứng `HS256`, thời hạn 1 giờ, bí mật cấu hình qua biến môi trường `JWT_SECRET`.
3. **Phân cấp Middleware:** `isAuth` (xác minh danh tính) đặt trước `isAdmin` (kiểm tra thẩm quyền), bảo đảm không phát sinh lỗi 500 do `req.user` bị thiếu.
