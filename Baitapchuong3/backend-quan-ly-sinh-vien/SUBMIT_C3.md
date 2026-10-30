# Theo Dõi Việc Cần Làm & Yêu Cầu Nộp Bài - Chương 3
## Kết Nối SQL Server & Sequelize ORM (Buổi 4)

File này tổng hợp toàn bộ các tiêu chí nộp bài theo đúng tài liệu **Bài thực hành chương 3 (Mục 22 - Nộp bài và tự giải thích)**.

---

## 1. Danh Mục Hồ Sơ Cần Nộp (Checklist)

- [x] **Mã nguồn và cấu hình hoàn chỉnh**:
  - `src/`: Controller, Service, Model (SinhVien, Lop), Config (database.ts), DTO, Middleware, Routes, Scripts.
  - `sql/`: `01-quan-ly-sinh-vien.sql`, `02-seed.sql`, `03-app-login.sql`, `04-lop-va-quan-he.sql`.
  - Cấu hình: `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.env.example`, `.gitignore`.
  - *Lưu ý tuyệt đối:* Không nộp `.env` thật, không nộp `node_modules/` và `dist/`.
- [x] **File Postman Collection**:
  - File `postman_collection_buoi4.json` đã có sẵn tại thư mục gốc dự án.
- [x] **Tài liệu README**:
  - `README.md` đã mô tả đầy đủ các bước cài đặt SQL Server, thứ tự chạy script và lệnh pnpm.
- [ ] **Bằng chứng ảnh chụp thực tế (CẦN BỔ SUNG)**:
  - Lưu ảnh vào thư mục `Baitapchuong3/picture_test/` (hoặc theo yêu cầu của giảng viên).
- [x] **Nhật ký trả lời câu hỏi tự đánh giá**:
  - Đã có tại `NHAT_KY_THAO_TAC_CHUONG_3.md` (DTO vs Model, await Controller, tính bền vững CSDL, PK chống trùng).

---

## 2. Danh Sách 7 Ảnh Bằng Chứng Cần Chụp Thực Tế

| STT | Tên ảnh gợi ý | Thao tác cần thực hiện | Nội dung trong ảnh cần thấy rõ |
|:---:|:---|:---|:---|
| 1 | `01_check_db_success.png` | Chạy lệnh `pnpm check:db` trong Terminal | Dòng chữ `DB connected: QuanLySinhVienDB` |
| 2 | `02_ssms_select_tables.png` | Trong SSMS, chạy `SELECT * FROM dbo.SinhVien` và `SELECT * FROM dbo.Lop` | Bảng dữ liệu có các sinh viên (SV001, SV002, ...) và mã lớp `25CT114` |
| 3 | `03_post_sinhvien_201.png` | Trong Postman: `POST http://localhost:5000/api/v1/sinh-vien` với body SV003 (hoặc mã mới) | Status `201 Created`, JSON `success: true` và data vừa tạo |
| 4 | `04_get_after_restart_persistence.png` | Tắt server (`Ctrl+C`), bật lại (`pnpm dev`), gửi `GET http://localhost:5000/api/v1/sinh-vien/SV003` | Status `200 OK`, dữ liệu SV003 vẫn tồn tại (chứng minh lưu DB thật, không mất khi restart) |
| 5 | `05_post_duplicate_409.png` | Gửi lại `POST` với mã đã có (SV003) | Status `409 Conflict`, thông báo "Mã sinh viên đã tồn tại" |
| 6 | `06_validation_error_400.png` | Gửi `POST` với dữ liệu sai (ví dụ `maSV: 4` hoặc email không hợp lệ) | Status `400 Bad Request`, thông báo lỗi validation rõ ràng |
| 7 | `07_check_association_include.png` | Chạy lệnh `pnpm tsx src/scripts/check-association.ts` trong Terminal | Kết quả join 1-N giữa Lớp và Sinh Viên thành công |

---

## 3. Thứ Tự Thao Tác Chụp Ảnh Chuẩn Xác

1. **Khởi động server**:
   Mở terminal tại thư mục `backend-quan-ly-sinh-vien`, gõ:
   ```powershell
   pnpm dev
   ```
2. **Thao tác Postman**:
   - Mở Postman, chọn **Import** -> nạp file `postman_collection_buoi4.json`.
   - Lần lượt chạy từng request và chụp ảnh màn hình (phím tắt `Windows + Shift + S`).
3. **Kiểm tra tính bền vững**:
   - Nhấn `Ctrl + C` tại terminal để tắt server.
   - Gõ lại `pnpm dev` để khởi động lại server.
   - Gửi GET xem sinh viên vừa thêm; nếu còn nguyên vẹn là chứng minh lưu CSDL thành công.
