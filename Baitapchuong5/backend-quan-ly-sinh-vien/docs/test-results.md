# Bảng Ghi Nhận Kết Quả Kiểm Thử Validation (V01 - V12) - Buổi 06 / Chương 05
## Dự án: Middlewares & Validation API Quản Lý Sinh Viên

| Mã | Request / Thao tác | Dữ liệu kiểm thử | Status kỳ vọng | Status thực tế | Xác nhận bảo toàn dữ liệu & Log | Kết luận |
|:---:|:---|:---|:---:|:---:|:---|:---:|
| **V01** | POST SV006 hợp lệ | `maSV: SV006`, đủ 4 trường | `201 Created` | 201 | GET lại thấy SV006 trong CSDL | PASS |
| **V02** | POST thiếu họ tên | `maSV: SV007`, không có hoTen | `400 Bad Request` | 400 | GET không thấy SV007 trong CSDL | PASS |
| **V03** | POST email sai định dạng | email: `khong-phai-email` | `400 Bad Request` | 400 | `errors` có `field: email` | PASS |
| **V04** | POST có trường lạ `role: admin` | Thừa thuộc tính `role: "admin"` | `400 Bad Request` | 400 | Zod `.strict()` chặn trường ngoài hợp đồng | PASS |
| **V05** | PUT SV006 thiếu email | Chỉ gửi `hoTen`, `maLop` | `400 Bad Request` | 400 | GET lại thấy email cũ của SV006 không đổi | PASS |
| **V06** | PUT SV006 đủ 3 trường hợp lệ | `hoTen: Nguyễn Minh An Updated` | `200 OK` | 200 | GET lại thấy họ tên mới đã cập nhật | PASS |
| **V07** | PUT SV006 email sai kiểu (số) | `email: 12345` (số) | `400 Bad Request` | 400 | Dữ liệu trong CSDL giữ nguyên | PASS |
| **V08** | POST maSV đã tồn tại | Gửi lại `maSV: SV006` | `409 Conflict` | 409 | SQL Server PK chặn, chỉ có 1 SV006 | PASS |
| **V09** | PUT mã không tồn tại | `PUT /api/v1/sinh-vien/SV9999` | `404 Not Found` | 404 | Không tìm thấy mã, không tự tạo mới | PASS |
| **V10** | GET danh sách tổng | `GET /api/v1/sinh-vien` | `200 OK` | 200 | Danh sách trả về mảng đầy đủ | PASS |
| **V11** | GET /health kiểm tra log | `GET /health` | `200 OK` | 200 | File `logs/access.log` ghi nhận dòng mới | PASS |
| **V12** | Restart server, gọi lại GET | Tắt & bật lại server, gửi GET | `200 OK` | 200 | File `logs/access.log` ghi nối tiếp (append) | PASS |

---

### Hướng dẫn kiểm tra nhanh
1. Dùng Postman nạp collection `postman/Buoi6-Validation.postman_collection.json`.
2. Chạy lần lượt từ V01 đến V12.
3. Mở file `logs/access.log` trong VS Code để xem các dòng log tương ứng được Morgan ghi nhận.
