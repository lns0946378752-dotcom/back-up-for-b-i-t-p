# Nhật Ký Prompt Engineering (Khung CTCO) - Buổi 06 / Chương 05
## Dự án: Middlewares & Validation (Zod, Morgan, OpenAPI 3.0)

---

### Khung CTCO chung cho Chương 05:
* **C — Context:** Dự án Node.js + Express 5 + TypeScript ESM/NodeNext từ Chương 04, đã có 5 API CRUD sinh viên kết nối SQL Server qua Sequelize ORM và Swagger UI tại `/api-docs`.
* **T — Task:** Nâng cấp hệ thống kiểm soát dữ liệu: Tạo Zod Schema kiểm tra body cho POST/PUT, viết Middleware `validate(schema)` dùng chung từ chối dữ liệu sai trước khi vào Controller, cấu hình Morgan ghi log truy cập dạng append vào file `logs/access.log`, và cập nhật OpenAPI YAML.
* **C — Constraint:** Giữ nguyên 5 endpoint và cấu trúc phản hồi `success/message/data`; trả lỗi HTTP 400 kèm chi tiết mảng `errors: [{ field, message }]`; dùng `.strict()` từ chối trường lạ; không phá hỏng kiểm tra nghiệp vụ tầng Database (409 trùng mã, 404 không tồn tại).
* **O — Output:** Mã nguồn hoàn chỉnh, không có lỗi TypeScript, file `access.log` ghi nhận thực tế và bộ 12 ca kiểm thử Postman V01–V12.

---

### Prompt Log 1: Tạo Zod Schema cho POST và PUT
* **Context:** Đã cài đặt thư viện `zod@^4.6.7` vào dự án Express/TypeScript.
* **Prompt gửi AI:**
  > "Tạo src/validations/sinhVien.schema.ts gồm createSinhVienSchema và updateSinhVienSchema. POST yêu cầu đủ 4 trường maSV, hoTen, email, maLop; PUT chỉ gồm hoTen, email, maLop. Trim chuỗi, kiểm tra độ dài theo Model SQL Server, dùng .strict() từ chối trường lạ ngoài hợp đồng."
* **Code đã tạo:** File `src/validations/sinhVien.schema.ts` với đầy đủ rule `z.string().trim().min(1).max(...)` và `z.email()`.

---

### Prompt Log 2: Tạo Middleware Validation dùng chung
* **Context:** Cần hàm middleware trung gian nhận schema làm tham số để dùng chung cho cả POST và PUT.
* **Prompt gửi AI:**
  > "Tạo src/middlewares/validate.middleware.ts dùng schema.safeParse(req.body). Nếu sai trả 400 kèm errors (field, message) và dừng lại. Nếu đúng gán parsed.data vào req.body và gọi next()."
* **Code đã tạo:** File `src/middlewares/validate.middleware.ts` nhận `z.ZodType`, short-circuit ngăn request sai vào Controller.

---

### Prompt Log 3: Tích hợp Morgan Logging vào hệ thống
* **Context:** Cần ghi nhật ký truy cập HTTP cho toàn bộ hệ thống ở chế độ append.
* **Prompt gửi AI:**
  > "Tạo src/middlewares/access-log.middleware.ts dùng morgan('combined') ghi stream vào logs/access.log với cờ flags: 'a'. Gắn vào server.ts trước các router."
* **Code đã tạo:** `src/middlewares/access-log.middleware.ts` và gắn `app.use(accessLogger)` vào `src/server.ts`.

---

### Trả lời các câu hỏi ôn tập lý thuyết (Trang 21 PDF):
1. **Middleware nằm trước hay sau Controller?**
   Middleware nằm trước Controller trong chuỗi xử lý của Express (`Route → Middleware → Controller → Service`). Middleware có thể chặn đứng request (short-circuit) và trả về HTTP 400 ngay nếu dữ liệu sai.
2. **`safeParse()` khác `parse()` ở điểm nào?**
   `parse()` sẽ tự động ném ra ngoại lệ (throw Exception) làm crash hoặc nhảy vào error handler nếu không bắt try/catch. Trong khi đó, `safeParse()` trả về object `{ success: true, data }` hoặc `{ success: false, error }`, giúp lập trình viên kiểm soát luồng điều kiện sạch sẽ và chuyên nghiệp hơn.
3. **Khi nào trả về 400, 401, 403, 404, 409?**
   - `400 Bad Request`: Dữ liệu đầu vào sai cú pháp/kiểu/thiếu trường bắt buộc.
   - `401 Unauthorized`: Chưa xác thực danh tính (chưa đăng nhập/thiếu token).
   - `403 Forbidden`: Đã xác thực nhưng không đủ quyền hạn truy cập tài nguyên.
   - `404 Not Found`: Không tìm thấy đường dẫn URL hoặc không tìm thấy bản ghi.
   - `409 Conflict`: Xung đột dữ liệu (trùng khóa chính maSV).
