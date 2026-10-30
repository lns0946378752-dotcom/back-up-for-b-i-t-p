# Nhật Ký Prompt Engineering (Khung CTCO) - Buổi 5 / Chương 4
## Dự án: RESTful CRUD & Swagger API Quản Lý Sinh Viên

Khung CTCO được áp dụng xuyên suốt quá trình xây dựng:
* **C (Context - Bối cảnh):** Dự án Node.js + Express 5 + TypeScript ESM/NodeNext, pnpm, cơ sở dữ liệu Microsoft SQL Server kết nối qua Sequelize ORM 6.
* **T (Task - Nhiệm vụ):** Hoàn thiện 5 API RESTful CRUD chuẩn (bổ sung PUT & DELETE), tích hợp tài liệu Swagger UI từ file `docs/openapi.yaml` riêng biệt, thiết lập bộ 12 ca kiểm thử Postman.
* **C (Constraint - Ràng buộc):** Giữ đúng kiến trúc Route → Controller → Service → Model; giữ nguyên các hợp đồng API cũ; không dùng JSDoc hay swagger-jsdoc; PUT lấy maSV từ URL và nhận đủ 3 trường `hoTen`, `email`, `maLop`; DELETE thành công trả 200 không có `data`, gọi lại trả 404.
* **O (Output - Đầu ra):** Mã nguồn hoàn chỉnh, file `docs/openapi.yaml` chuẩn OpenAPI 3.0.3, route `/api-docs` hoạt động, và bộ test assertions.

---

### Prompt Log 1: Phân tích & Bổ sung chức năng cập nhật (PUT)
* **Bối cảnh & File đưa AI:** `src/routes/sinhVien.routes.ts`, `src/controllers/sinhVien.controller.ts`, `src/services/sinhVien.service.ts`, `src/dtos/sinhVien.dto.ts`.
* **Prompt gửi AI:**
  > "Tôi đang làm dự án quản lý sinh viên bằng Express và TypeScript theo kiến trúc Route → Controller → Service trên SQL Server. Hãy bổ sung PUT /api/v1/sinh-vien/:maSV. Lấy maSV từ URL; body có đủ hoTen, email, maLop. Body sai trả 400, không có mã trả 404, thành công trả 200. Giữ nguồn dữ liệu và kiến trúc hiện tại."
* **Code đã bổ sung:**
  - `ICapNhatSinhVienDTO` trong `src/dtos/sinhVien.dto.ts`.
  - Hàm `capNhatSinhVien` trong `src/services/sinhVien.service.ts` kiểm tra tồn tại mã, kiểm tra mã lớp khóa ngoại, validate kiểu chuỗi, độ dài và cập nhật qua Sequelize.
  - Hàm `capNhatSinhVien` trong `src/controllers/sinhVien.controller.ts`.
  - Route `router.put('/:maSV', capNhatSinhVien)` trong `src/routes/sinhVien.routes.ts`.

---

### Prompt Log 2: Bổ sung chức năng xóa (DELETE)
* **Prompt gửi AI:**
  > "Tiếp tục project trên. Hãy bổ sung DELETE /api/v1/sinh-vien/:maSV. Lấy maSV từ URL và xóa qua Service hiện có. Không tìm thấy trả 404; xóa thành công trả 200 với thông báo 'Xóa sinh viên thành công'. Không thay đổi các API khác."
* **Code đã bổ sung:**
  - `xoaSinhVien` trong `src/services/sinhVien.service.ts` gọi `student.destroy()`.
  - `xoaSinhVien` trong `src/controllers/sinhVien.controller.ts` trả status 200 `{ "success": true, "message": "Xóa sinh viên thành công" }`.
  - Route `router.delete('/:maSV', xoaSinhVien)`.

---

### Prompt Log 3: Đặc tả OpenAPI YAML & Tích hợp Swagger UI
* **Prompt gửi AI:**
  > "Tạo file docs/openapi.yaml chuẩn OpenAPI 3.0.3 cho 5 API CRUD sinh viên (GET list, GET detail, POST, PUT, DELETE). Sau đó tích hợp Swagger UI tại /api-docs bằng swagger-ui-express và js-yaml đọc file YAML riêng biệt."
* **Thư viện cài đặt:** `pnpm add swagger-ui-express js-yaml`, `@types/swagger-ui-express @types/js-yaml openapi-types`.
* **File đã tạo:** `docs/openapi.yaml`, `src/config/swagger.config.ts`, mount vào `src/server.ts`.

---

### Các câu hỏi tự trả lời và củng cố kiến thức:
1. **PUT đi qua những file nào?**
   `server.ts` → `routes/sinhVien.routes.ts` (bắt method PUT) → `controllers/sinhVien.controller.ts` (lấy `req.params.maSV` và `req.body`) → `services/sinhVien.service.ts` (xác thực dữ liệu, kiểm tra `maLop` khóa ngoại, gọi Model cập nhật) → `models/SinhVien.ts` (Sequelize ghi SQL Server).
2. **Vì sao DELETE lần thứ hai trả 404 là kết quả đúng?**
   Vì bản ghi đã bị xóa ở lần gọi thứ nhất. Khi gọi lại, Service tìm kiếm khóa chính không thấy trong database nên ném lỗi 404 Not Found.
3. **Vì sao phải GET lại sau POST, PUT, DELETE?**
   Để kiểm chứng tính bền vững và sự toàn vẹn dữ liệu thực tế trong SQL Server, tránh trường hợp server chỉ trả mã giả 200/201 mà không thực sự ghi/sửa/xóa trong database.
