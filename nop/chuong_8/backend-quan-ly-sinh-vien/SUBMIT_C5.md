# Hướng Dẫn & Checklist Nộp Bài - Chương 5 (Buổi 06)
## Middlewares, Validation (Zod) & Logging (Morgan)

File này tổng hợp các tiêu chí nộp bài theo đúng tài liệu **Bài thực hành Chương 5 (Buổi 06 - Trang 2, 22)**.

---

## 1. Danh Mục Hồ Sơ Cần Nộp (Checklist)

- [x] **Mã nguồn hoàn chỉnh**:
  - `src/validations/sinhVien.schema.ts`: Schema Zod cho POST và PUT (chế độ `.strict()`).
  - `src/middlewares/validate.middleware.ts`: Middleware `validate(schema)` dùng chung trả 400 kèm `errors`.
  - `src/middlewares/access-log.middleware.ts`: Morgan ghi log truy cập với cờ append `flags: 'a'`.
  - `src/routes/sinhVien.routes.ts`: Đã gắn validation vào POST và PUT.
  - `src/server.ts`: Đã gắn `accessLogger` và route `/health`.
  - `docs/openapi.yaml`: Cập nhật schema `ValidationIssue` và trường `errors`.
  - Cấu hình: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.env.example`, `.gitignore`.
- [x] **Postman Collection**:
  - `postman/Buoi6-Validation.postman_collection.json` (Bộ 12 ca kiểm thử V01 → V12 có test script tự động).
- [x] **Hồ sơ tài liệu**:
  - `docs/prompt-log.md`: Nhật ký Prompt theo khung CTCO (Buổi 06).
  - `docs/test-results.md`: Bảng ghi nhận 12 ca test V01 → V12.
- [ ] **Bằng chứng ảnh chụp thực tế (BẠN CHỤP KHI QUAY LẠI)**:
  - Lưu vào thư mục `Baitapchuong5/picture_test_postman/`.

---

## 2. Danh Sách Các Ảnh Cần Chụp (Khuyến nghị 5 ảnh theo Trang 22 PDF)

| STT | Tên ảnh gợi ý | Thao tác cần thực hiện | Nội dung trong ảnh cần thấy rõ |
|:---:|:---|:---|:---|
| 1 | `01_post_valid_201.png` | Trong Postman chạy V01: POST SV006 hợp lệ | Status `201 Created`, phản hồi đúng thông tin SV006 và Test Results PASS |
| 2 | `02_post_invalid_email_400.png` | Trong Postman chạy V03: POST email sai định dạng | Status `400 Bad Request`, body có mảng `errors` với `field: "email"` |
| 3 | `03_put_missing_email_400.png` | Trong Postman chạy V05: PUT thiếu email | Status `400 Bad Request`, chứng minh Zod từ chối body thiếu trường |
| 4 | `04_put_valid_200.png` | Trong Postman chạy V06: PUT SV006 hợp lệ | Status `200 OK`, họ tên mới cập nhật là "Nguyễn Minh An Updated" |
| 5 | `05_access_log_file.png` | Mở file `logs/access.log` trong VS Code | Thấy các dòng nhật ký HTTP request được Morgan ghi lại liên tục |

---

## 3. Thứ Tự Thao Tác Khi Bạn Quay Lại

1. Mở Terminal tại `Baitapchuong5\backend-quan-ly-sinh-vien`, chạy server:
   ```powershell
   pnpm dev
   ```
2. Mở Postman, chọn **Import** -> chọn file:
   `D:\Backend\back up for bài tập\Baitapchuong5\backend-quan-ly-sinh-vien\postman\Buoi6-Validation.postman_collection.json`
3. Lần lượt bấm **Send** từ V01 đến V12 (tất cả các test script đều PASS).
4. Mở file `logs/access.log` để xem nhật ký và chụp các ảnh theo bảng trên.
