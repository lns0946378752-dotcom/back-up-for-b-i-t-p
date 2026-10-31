# NHẬT KÝ PROMPT VÀ PHẢN BIỆN BẢO MẬT CHƯƠNG 06 (AUTHENTICATION & AUTHORIZATION)

Dự án: **Quản lý sinh viên - JWT Authentication, Bcrypt & Role-Based Access Control (RBAC)**  
Nền tảng: **Node.js, Express, TypeScript, Sequelize, SQL Server, Zod, Morgan, Swagger OpenAPI 3.0**

---

## 1. NHẬT KÝ CÁC BƯỚC THỰC HIỆN THEO ĐỀ BÀI

### Bước 0: Khảo sát kiến trúc hiện tại
- **Mục tiêu:** Kế thừa toàn bộ hệ thống từ Chương 5 (5 API CRUD, Sequelize SQL Server, Zod Validation, Morgan Access Log).
- **Thực hiện:** Đảm bảo không đập đi xây lại, giữ nguyên các bảng học vụ `SinhVien`, `Lop`. Tách tài khoản người dùng sang bảng riêng `dbo.Users`.

### Bước 1 & 2: Thiết kế Schema User, băm mật khẩu và Register
- **Prompt:** Viết script SQL tạo bảng `dbo.Users` (id, fullName, email unique, passwordHash, role mặc định 'student') và API Register.
- **Phản biện bảo mật:**
  - Tuyệt đối không lưu mật khẩu rõ. Dùng `bcrypt.hash(password, 12)`.
  - Không nhận trường `role` từ client gửi lên để ngăn chặn leo thang đặc quyền (Privilege Escalation). Dùng Zod `.strict()` loại bỏ hoặc báo lỗi nếu body có `role`.
  - Không phản hồi `passwordHash` ra ngoài Client trong response 201.

### Bước 3 & 4: Xây dựng JWT Utility và API Login
- **Prompt:** Viết module `src/utils/jwt.ts` (`generateToken`, `verifyToken`) và API Login.
- **Phản biện bảo mật:**
  - Khóa bí mật `JWT_SECRET` phải lấy từ `process.env`, không hard-code vào mã nguồn.
  - Payload của JWT chỉ chứa thông tin định danh và vai trò (`sub: user.id`, `role: user.role`), thời hạn `1h`, thuật toán cố định `HS256`.
  - Không đưa mật khẩu hoặc `passwordHash` vào payload của JWT vì JWT chỉ được ký số, không mã hóa (bất kỳ ai cũng đọc được qua base64 decode).
  - So khớp mật khẩu bằng `bcrypt.compare`. Nếu sai email hoặc mật khẩu đều trả chung mã `401 Unauthorized` với câu thông báo trung lập "Email hoặc mật khẩu không chính xác" để chống tấn công vét cạn tài khoản (User Enumeration).

### Bước 5 & 6: Middleware isAuth và isAdmin
- **Prompt:** Xây dựng middleware xác thực và phân quyền RBAC.
- **Phản biện:**
  - `isAuth`: Trích xuất header `Authorization: Bearer <token>`, dùng `jwt.verify` (không dùng `jwt.decode` vì decode không kiểm tra chữ ký). Nếu hợp lệ, gán vào `req.user`.
  - `isAdmin`: Kiểm tra `req.user.role === 'admin'`. Nếu không phải admin thì trả `403 Forbidden`.
  - Thứ tự bắt buộc: `isAuth` phải luôn đứng trước `isAdmin`. Nếu đặt ngược lại, `req.user` là `undefined` sẽ dẫn tới lỗi Crash 500 hoặc phân quyền sai.

### Bước 7: Ghép vào Route CRUD SinhVien
- **Cấu hình chuỗi Middleware:**
  - `GET /api/v1/sinh-vien` và `GET /api/v1/sinh-vien/:maSV`: Giữ Public.
  - `POST /api/v1/sinh-vien`: `isAuth` ➔ `isAdmin` ➔ `validate(createSinhVienSchema)` ➔ `taoSinhVien`.
  - `PUT /api/v1/sinh-vien/:maSV`: `isAuth` ➔ `isAdmin` ➔ `validate(updateSinhVienSchema)` ➔ `capNhatSinhVien`.
  - `DELETE /api/v1/sinh-vien/:maSV`: `isAuth` ➔ `isAdmin` ➔ `xoaSinhVien`.

### Bước 8: Script Seed Admin nội bộ
- **File:** `src/scripts/seed-admin.ts`.
- **Thực hiện:** Script kiểm tra email `admin.lab@example.com`, nếu chưa có sẽ băm mật khẩu bằng bcrypt cost 12 và gán role `admin` một cách an toàn cho môi trường lab/dev, không mở endpoint cấp quyền ra ngoài internet.

---

## 2. PHẢN BIỆN CÂU HỎI BẢO VỆ CHƯƠNG 06 (THEO MỤC 20 CỦA ĐỀ BÀI)

1. **Vì sao Register dùng `bcrypt.hash()` nhưng Login phải dùng `bcrypt.compare()`?**  
   *Trả lời:* `bcrypt` sử dụng cơ chế Salt ngẫu nhiên mỗi lần băm. Do đó, cùng một mật khẩu nhưng hai lần băm bằng `hash()` sẽ sinh ra hai chuỗi hash hoàn toàn khác nhau. Ở bước Login không thể dùng phép so sánh chuỗi bằng phẳng (`===`), mà phải dùng `bcrypt.compare(password, passwordHash)` để hàm trích xuất Salt từ chuỗi hash cũ và tính toán đối chiếu an toàn.

2. **Vì sao JWT có chữ ký số mà vẫn không nên chứa `passwordHash` trong payload?**  
   *Trả lời:* JWT chỉ dùng chữ ký số (Signature) để bảo đảm tính toàn vẹn (Integrity - không bị sửa đổi), chứ phần Header và Payload chỉ được mã hóa Base64URL, nghĩa là bất kỳ ai bắt được token đều giải mã và đọc được toàn bộ nội dung. Nếu để `passwordHash` vào token, kẻ tấn công có thể thu thập hash để tấn công giải mã ngoại tuyến (offline brute-force).

3. **Nếu User sửa chữ `student` thành `admin` trong payload JWT, điều gì xảy ra khi `isAuth` gọi `jwt.verify`?**  
   *Trả lời:* Chữ ký số ở phần thứ 3 của JWT được sinh ra dựa trên Payload và `JWT_SECRET`. Khi sửa payload (dù chỉ 1 ký tự), chữ ký số sẽ không còn khớp với payload mới. `jwt.verify()` sẽ lập tức ném ra ngoại lệ `JsonWebTokenError: invalid signature` và request bị chặn với mã `401 Unauthorized`.

4. **Phân biệt `401 Unauthorized` và `403 Forbidden`:**  
   *Trả lời:*
   - `401 Unauthorized`: Lỗi **chưa xác thực danh tính** (thiếu token, token sai chữ ký, hoặc token đã hết hạn). Ví dụ: Gọi `GET /api/auth/profile` mà không truyền header Authorization (ca test A08).
   - `403 Forbidden`: Đã xác thực được danh tính người dùng (token hợp lệ), nhưng **người dùng đó không có thẩm quyền / vai trò** để thực hiện hành động này. Ví dụ: Sinh viên có tài khoản hợp lệ nhưng cố gọi `DELETE /api/v1/sinh-vien/SV01` (ca test B04).

5. **Tại sao phải gắn `isAuth` trước `isAdmin`? `req.user` được tạo ở đâu?**  
   *Trả lời:* `req.user` được trích xuất từ payload của JWT và gán vào request object bên trong middleware `isAuth` sau khi giải mã thành công. Vì vậy `isAuth` bắt buộc phải chạy trước để tạo ra `req.user`. Nếu `isAdmin` chạy trước, `req.user` chưa tồn tại (`undefined`), dẫn đến việc kiểm tra thuộc tính `req.user.role` bị lỗi.

6. **Nếu Route `DELETE` chỉ được đánh dấu security trong Swagger nhưng không gắn `isAdmin` ở Express, có an toàn không?**  
   *Trả lời:* Hoàn toàn **không an toàn**. Swagger / OpenAPI chỉ là tài liệu giao diện tĩnh mô tả API cho người dùng đọc. Lớp bảo vệ thực sự nằm ở Middleware của runtime Express. Nếu Express không khai báo `isAdmin`, bất kỳ ai (kể cả không có quyền) gửi HTTP request trực tiếp qua Postman hoặc Curl đều sẽ xóa được dữ liệu.

7. **Nếu thay role của một User trong SQL Server sau khi đã cấp JWT, token cũ có cập nhật role ngay không? Muốn kiểm soát phải làm gì?**  
   *Trả lời:* Token cũ **không cập nhật ngay** vì JWT hoạt động theo cơ chế stateless (phi trạng thái), thông tin role đã được đóng gói cố định trong payload và có hiệu lực cho đến khi hết hạn (ví dụ 1 giờ). Để kiểm soát tức thời, hệ thống có thể: (1) Rút ngắn thời gian Access Token (ví dụ 15 phút) kết hợp Refresh Token; hoặc (2) Trong middleware `isAuth`, tra cứu lại role từ Database/Redis (Token Blacklist).

8. **Tại sao test 403 cần gọi GET/SELECT lại và không thể chỉ nhìn status là đủ?**  
   *Trả lời:* Status code `403` chỉ chứng minh phía Controller/Middleware đã trả về mã 403 cho Client, nhưng không loại trừ khả năng code bị lỗi logic (ví dụ lỡ tay thực hiện lệnh SQL xóa trước rồi mới trả lỗi 403 sau). Việc gọi lại GET/SELECT là minh chứng bất biến xác nhận dữ liệu trong database thực sự không bị biến đổi.
