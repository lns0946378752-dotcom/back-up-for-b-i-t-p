# Hướng Dẫn & Checklist Nộp Bài - Chương 4 (Buổi 5)
## RESTful CRUD & Swagger API Quản Lý Sinh Viên

File này tổng hợp toàn bộ các tiêu chí nộp bài theo đúng tài liệu **Bài thực hành Chương 4 (Buổi 5 - Trang 2, 20)**.

---

## 1. Danh Mục Hồ Sơ Cần Nộp (Checklist)

- [x] **Mã nguồn hoàn chỉnh**:
  - `src/`: Controller, Service, Model (SinhVien, Lop), Routes (đủ 5 API), Middleware, Config (`swagger.config.ts`, `database.ts`), server.ts.
  - `docs/openapi.yaml`: Đặc tả OpenAPI 3.0.3 độc lập.
  - Cấu hình: `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`.
  - *Lưu ý tuyệt đối:* Không nộp `.env` thật, không nộp `node_modules/` và `dist/`.
- [x] **File Postman Collection**:
  - `postman/Buoi5-CRUD.postman_collection.json` (12 test case có assertions).
- [x] **Hồ sơ tài liệu**:
  - `docs/prompt-log.md`: Nhật ký Prompt Engineering theo khung CTCO.
  - `docs/test-results.md`: Bảng kết quả kiểm thử 12 ca test T01 → T12.
- [ ] **Bằng chứng ảnh chụp thực tế (CẦN BỔ SUNG)**:
  - Lưu vào thư mục `Baitapchuong4/picture_test_postman/`.

---

## 2. Danh Sách Các Ảnh Cần Chụp Thực Tế (Khuyến nghị 4 - 6 ảnh)

| STT | Tên ảnh gợi ý | Thao tác cần thực hiện | Nội dung trong ảnh cần thấy rõ |
|:---:|:---|:---|:---|
| 1 | `01_swagger_ui_operations.png` | Mở trình duyệt: `http://localhost:5000/api-docs` | Giao diện Swagger UI hiển thị nhóm SinhVien với đủ 5 operation (GET, POST, GET/:maSV, PUT/:maSV, DELETE/:maSV) |
| 2 | `02_post_201_created.png` | Trong Postman chạy T02: POST SV003 | Status `201 Created`, phản hồi đúng 4 trường và Test Results PASS |
| 3 | `03_put_200_updated.png` | Trong Postman chạy T06: PUT SV003 với body cập nhật | Status `200 OK`, họ tên mới là "Ngọc Mai Updated" |
| 4 | `04_delete_200_success.png` | Trong Postman chạy T10: DELETE SV003 | Status `200 OK`, message "Xóa sinh viên thành công" (không có data) |
| 5 | `05_get_after_delete_404.png` | Trong Postman chạy T11: GET SV003 | Status `404 Not Found` (chứng minh bản ghi đã thực sự bị xóa khỏi SQL Server) |
| 6 | `06_validation_error_400.png` | Trong Postman chạy T07: PUT thiếu email | Status `400 Bad Request` |

---

## 3. Thứ Tự Thao Tác Chạy Server & Lấy Bằng Chứng

1. Mở Terminal tại `Baitapchuong4\backend-quan-ly-sinh-vien`, chạy server:
   ```powershell
   pnpm dev
   ```
2. Mở trình duyệt web truy cập:
   `http://localhost:5000/api-docs`
   Chụp ảnh màn hình giao diện Swagger UI.
3. Mở Postman, chọn **Import** -> nạp file:
   `d:\Backend\back up for bài tập\Baitapchuong4\backend-quan-ly-sinh-vien\postman\Buoi5-CRUD.postman_collection.json`
4. Chạy từng request và chụp màn hình bằng phím tắt `Windows + Shift + S`.
