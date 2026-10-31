# BẢNG KẾT QUẢ KIỂM THỬ THỰC TẾ CHƯƠNG 07 (MULTER & KẾT NỐI VITE REACT)

- **Backend Base URL:** `http://localhost:5000`
- **Frontend URL:** `http://localhost:5173`
- **Database:** SQL Server Local (`QuanLySinhVienDB` - `dbo.Users.avatarUrl`)

---

## 1. MA TRẬN KIỂM THỬ UPLOAD AVATAR VỚI MULTER (U01 - U12)

| Mã | Tình huống kiểm thử | Expected | Actual Status | Bằng chứng kiểm chứng | Kết quả |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **U01** | Upload Avatar PNG hợp lệ + Student JWT | `200 OK` | `200 OK` | File sinh ngẫu nhiên lưu tại `public/uploads/`, URL dạng `/uploads/...`, SQL Server cập nhật đúng `Users.avatarUrl` | **PASS** |
| **U02** | Upload Avatar JPEG hợp lệ + Student JWT | `200 OK` | `200 OK` | Mở trực tiếp ảnh qua trình duyệt `http://localhost:5000/uploads/...` thành công | **PASS** |
| **U03** | Upload không gửi header Authorization | `401 Unauthorized` | `401 Unauthorized` | Bị `isAuth` chặn trước khi vào Multer; không sinh file rác trên ổ đĩa và không UPDATE SQL | **PASS** |
| **U04** | Upload với JWT sai chữ ký / hết hạn | `401 Unauthorized` | `401 Unauthorized` | Bị `isAuth` chặn ngay từ đầu; không có file mới | **PASS** |
| **U05** | Gửi Request multipart nhưng thiếu file | `400 Bad Request` | `400 Bad Request` | Multer báo "Vui lòng chọn một file ảnh để tải lên" | **PASS** |
| **U06** | Gửi sai field name (`photo` thay vì `avatar`) | `400 Bad Request` | `400 Bad Request` | Bắt lỗi `LIMIT_UNEXPECTED_FILE`, yêu cầu gửi key `avatar` | **PASS** |
| **U07** | Dung lượng file ảnh > 2MB (> 2.097.152 bytes) | `413 Payload Too Large` | `413 Payload Too Large` | Bắt lỗi `LIMIT_FILE_SIZE` của Multer, trả đúng mã 413 theo hợp đồng | **PASS** |
| **U08** | File TXT đổi đuôi giả mạo thành `.png` | `400 Bad Request` | `400 Bad Request` | Kiểm tra Magic Bytes nhị phân phát hiện file không phải JPEG/PNG thật; tự động xóa tệp rác | **PASS** |
| **U09** | File định dạng `.gif` hoặc MIME không cho phép | `400 Bad Request` | `400 Bad Request` | Bộ lọc Multer từ chối định dạng; không sinh file tĩnh | **PASS** |
| **U10** | Upload lần 2 trên cùng một tài khoản | `200 OK` | `200 OK` | Tên file mới không đè tên cũ, DB cập nhật URL mới nhất | **PASS** |
| **U11** | Student A cố tình gửi `userId` của Admin trong body | `200 OK` | `200 OK` | Controller chỉ lấy `userId` từ `req.user` (JWT); chỉ Student A đổi avatar, Admin giữ nguyên | **PASS** |
| **U12** | Gọi `GET /api/auth/profile` sau khi restart server | `200 OK` | `200 OK` | `avatarUrl` tồn tại vĩnh viễn trong SQL Server, ảnh tĩnh mở lại vẫn hợp lệ | **PASS** |

---

## 2. MA TRẬN KIỂM THỬ GIAO DIỆN FRONTEND REACT VITE (F01 - F12)

| Mã | Tình huống kiểm thử trên giao diện | Expected | Thực tế | Đánh giá |
| :---: | :--- | :---: | :--- | :---: |
| **F01** | Vite chạy tại `localhost:5173`, Backend bật tại `5000` | Trang mở bình thường | Giao diện hiển thị form Login, Network GET trạng thái 200 | **PASS** |
| **F02** | Xem danh sách Sinh viên trên Table | Đầy đủ 4 cột | Hiển thị bảng gồm Mã SV, Họ tên, Email, Mã Lớp chuẩn dữ liệu SQL Server | **PASS** |
| **F03** | Trường hợp danh sách rỗng | Không crash | Hiển thị thông báo "Hiện chưa có sinh viên nào trong cơ sở dữ liệu" | **PASS** |
| **F04** | Khi Backend tắt mà mở danh sách | Hiện lỗi rõ ràng | Hiển thị thông báo lỗi kết nối và nút "Thử lại", không bị đơ loading vô hạn | **PASS** |
| **F05** | Bật lại Backend và bấm "Thử lại" | Phục hồi dữ liệu | Bảng sinh viên tải lại thành công | **PASS** |
| **F06** | Đăng nhập tài khoản Student (`an.lab@example.com`) | 200 + Profile | Nhận JWT, hiển thị badge vai trò Sinh viên, không hiển thị nút Xóa | **PASS** |
| **F07** | Đăng nhập sai mật khẩu trên giao diện | Báo lỗi 401 | Hiển thị alert đỏ "Email hoặc mật khẩu không chính xác", không lưu token | **PASS** |
| **F08** | Gọi Profile khi chưa đăng nhập / token rỗng | 401 | Giao diện giữ nguyên ở màn hình Login, không lộ dữ liệu học vụ | **PASS** |
| **F09** | Tài khoản Student gọi DELETE sinh viên | 403 Forbidden | Backend từ chối với 403, giao diện thông báo không đủ quyền | **PASS** |
| **F10** | Admin bấm nút "Xóa" trên dòng sinh viên | 200 OK | Hiện hộp thoại xác nhận; xóa thành công và bảng tự refresh biến mất dòng đó | **PASS** |
| **F11** | Chọn ảnh và bấm Tải lên Avatar từ giao diện | 200 OK | Gửi `FormData` multipart; ảnh đại diện hiện ngay lập tức trên thanh header | **PASS** |
| **F12** | Trình duyệt gọi cross-origin tới `localhost:5000` | CORS Cho phép | Backend phản hồi header `Access-Control-Allow-Origin: http://localhost:5173` | **PASS** |
