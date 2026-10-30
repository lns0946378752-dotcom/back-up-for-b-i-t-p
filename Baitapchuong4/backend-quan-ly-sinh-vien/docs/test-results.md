# Bảng Ghi Nhận Kết Quả Kiểm Thử (12 Ca Test Bắt Buộc) - Buổi 5 / Chương 4
## Dự án: RESTful CRUD SinhVien & Swagger

| ID | Thao tác / Ca kiểm thử | Method & Endpoint | Status kỳ vọng | Kết quả mong đợi & Xác nhận thêm | Trạng thái |
|:---:|:---|:---|:---:|:---|:---:|
| **T01** | Lấy danh sách sinh viên ban đầu | `GET /api/v1/sinh-vien` | `200 OK` | `data` là mảng sinh viên | PASS |
| **T02** | Thêm mới sinh viên SV003 hợp lệ | `POST /api/v1/sinh-vien` | `201 Created` | Tạo thành công, trả về đúng 4 trường của SV003 | PASS |
| **T03** | Thêm lại cùng mã SV003 lần hai | `POST /api/v1/sinh-vien` | `409 Conflict` | Bị từ chối, message "Mã sinh viên đã tồn tại" | PASS |
| **T04** | Thêm sinh viên mới thiếu họ tên | `POST /api/v1/sinh-vien` | `400 Bad Request` | Bị từ chối validation, không lưu vào DB | PASS |
| **T05** | Đọc chi tiết SV003 sau khi tạo | `GET /api/v1/sinh-vien/SV003` | `200 OK` | Tìm thấy SV003, dữ liệu nguyên vẹn | PASS |
| **T06** | Cập nhật SV003 đủ 3 trường hợp lệ | `PUT /api/v1/sinh-vien/SV003` | `200 OK` | Cập nhật thành công, họ tên mới "Ngọc Mai Updated" | PASS |
| **T07** | Cập nhật SV003 thiếu email | `PUT /api/v1/sinh-vien/SV003` | `400 Bad Request` | Bị từ chối validation, dữ liệu cũ giữ nguyên | PASS |
| **T08** | Cập nhật SV9999 không tồn tại | `PUT /api/v1/sinh-vien/SV9999` | `404 Not Found` | Không tìm thấy mã, không tự sinh bản ghi mới | PASS |
| **T09** | Đọc kiểm chứng SV9999 | `GET /api/v1/sinh-vien/SV9999` | `404 Not Found` | Xác nhận SV9999 không tồn tại trong database | PASS |
| **T10** | Xóa sinh viên SV003 | `DELETE /api/v1/sinh-vien/SV003` | `200 OK` | Message "Xóa sinh viên thành công" (không có data) | PASS |
| **T11** | Đọc lại SV003 sau khi xóa | `GET /api/v1/sinh-vien/SV003` | `404 Not Found` | Xác nhận sinh viên đã bị xóa thật khỏi SQL Server | PASS |
| **T12** | Xóa lại SV003 lần hai | `DELETE /api/v1/sinh-vien/SV003` | `404 Not Found` | Báo 404 vì bản ghi không còn tồn tại | PASS |

---

### Hướng dẫn chạy kiểm thử bằng Postman
1. Mở Postman, chọn **Import** -> nạp file `postman/Buoi5-CRUD.postman_collection.json`.
2. Kiểm tra biến `baseUrl` trỏ về `http://localhost:5000`.
3. Chạy lần lượt từ **T01** đến **T12**.
4. Mở tab **Test Results** ở mỗi request để đối chiếu kết quả kiểm thử tự động.
