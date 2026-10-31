# NHẬT KÝ PROMPT CTCO VÀ PHẢN BIỆN BẢO MẬT CHƯƠNG 08
## PHÂN TRANG, TÌM KIẾM & XỬ LÝ LỖI TẬP TRUNG (SEQUELIZE · SQL SERVER · EXPRESS 5)

---

## 1. DANH SÁCH PROMPT CTCO ÁP DỤNG TRONG CHƯƠNG 08

### PROMPT 1: Khảo sát & Bảo tồn kiến trúc nền tảng (Bước 0)
- **C (Context):** Tôi tiếp tục đúng backend-quan-ly-sinh-vien sau Chương 07: Express 5, TypeScript, Sequelize 6, SQL Server, Zod, JWT, Vite/React.
- **T (Task):** Đọc package.json, tsconfig, GET routes/controller/service, SinhVien Model, AppError, error middleware, docs/openapi.yaml; vẽ luồng GET.
- **C (Constraint):** Chưa sửa bất cứ file nào; không đọc .env; không giả định có Products, Orders hoặc lớp học nếu không tìm thấy. Không dùng `sync({force:true})`.
- **O (Output):** Bảng file/đúng vai trò/cần sửa hay giữ; xác định thiếu gì; checklist API nền và truy vấn SSMS cần test.

### PROMPT 2: Xây dựng Schema Zod validate Query String (Lab 1)
- **C (Context):** GET SinhVien nhận `req.query`; project có Zod và AppError từ những chương trước.
- **T (Task):** Tạo module `validations/sinhVien.query.ts` validate `page`, `limit`, `search` với mặc định 1/10/"", giới hạn `limit` 1–50 và `search` tối đa 80 ký tự.
- **C (Constraint):** Sai trả HTTP 400 thống nhất; không sửa middleware JWT/Avatar; không tự đổi TypeScript, ESM và cấu trúc response; regex chặt chẽ tránh ép kiểu ngầm.
- **O (Output):** File `sinhVien.query.ts`, kiểu `ISinhVienQuery`, ném `AppError(400)` nếu vi phạm.

### PROMPT 3: Nâng cấp Service với Sequelize findAndCountAll (Lab 1)
- **C (Context):** Project đang dùng SinhVien Model và Sequelize 6 kết nối SQL Server thật.
- **T (Task):** Viết hàm `layDanhSachSinhVienPhanTrang(page, limit, search)` sử dụng `findAndCountAll`, WHERE lọc `hoTen` bằng `Op.like`, `order: [['maSV', 'ASC']]`, `limit`, `offset = (page - 1) * limit`.
- **C (Constraint):** Giữ maSV/hoTen/email/maLop; không thêm id/timestamps giả; tuyệt đối không gọi findAll toàn bộ rồi dùng `.slice()` của JavaScript.
- **O (Output):** Code service trả về `{ data, pagination: { page, limit, totalItems, totalPages } }`, tính `totalPages = Math.ceil(totalItems / limit)`.

### PROMPT 4: Cập nhật Controller và Hợp đồng OpenAPI 3.0 (Lab 1)
- **C (Context):** GET `/api/v1/sinh-vien` công khai; tài liệu API là `docs/openapi.yaml`.
- **T (Task):** Gắn query đã validate vào Controller, gọi service phân trang, trả JSON `{success, message, data, pagination}`. Cập nhật `openapi.yaml` bổ sung query params và schema response.
- **C (Constraint):** Không đổi URL/method/status của API cũ; không khóa GET bằng JWT; không bao bọc data thành object; giữ nguyên tương thích client cũ đọc mảng `data`.
- **O (Output):** Code controller và YAML diff chuẩn OpenAPI 3.0.

### PROMPT 5: Chuẩn hóa Global Error Middleware (Lab 2)
- **C (Context):** API đang có `{success, message, data}`; đã tồn tại AppError và Error Handler; ứng dụng chạy Express 5.
- **T (Task):** Chuẩn hóa JSON lỗi 400/404/500 có trường `status`; lỗi 500 che message gốc ("Lỗi hệ thống, vui lòng thử lại sau") và ghi log console server; chỉ gửi kèm `stack` khi `NODE_ENV === 'development'`.
- **C (Constraint):** Tuyệt đối không lộ `stack`, SQL query hay thông tin nhạy cảm ở production; nếu `res.headersSent` thì chuyển `next(error)`.
- **O (Output):** Code `error.middleware.ts` hoàn chỉnh kèm phân tích môi trường dev vs prod.

---

## 2. HAI BÀI PHẢN BIỆN ĐỀ XUẤT NGUY HIỂM TỪ AI (BẮT BUỘC THEO ĐỀ BÀI)

### PHẢN BIỆN 1: AI ĐỀ XUẤT DÙNG `findAll()` RỒI `.slice()` ĐỂ PHÂN TRANG
- **Đoạn code sai AI đưa ra:**
  ```javascript
  const allStudents = await SinhVien.findAll({ order: [['maSV', 'ASC']] });
  const offset = (page - 1) * limit;
  const data = allStudents.slice(offset, offset + limit);
  return { data, totalItems: allStudents.length };
  ```
- **Chỉ ra rủi ro và phê phán:**
  1. *Lãng phí tài nguyên và làm nghẽn Database:* Lấy toàn bộ hàng chục nghìn dòng dữ liệu từ SQL Server về RAM của Node.js qua mạng, làm tốn băng thông, tiêu tốn bộ nhớ server, gây latency cao.
  2. *Phân trang giả:* Đây là client-side/memory slicing, không phải phân trang Database thực sự.
  3. *Không đáp ứng chuẩn SQL Server:* Không tận dụng mệnh đề `OFFSET ... ROWS FETCH NEXT ... ROWS ONLY` tối ưu trên chỉ mục khóa chính `maSV`.
- **Bản sửa đúng chuẩn SQL Server:**
  ```typescript
  const offset = (page - 1) * limit;
  const { rows, count } = await SinhVien.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['maSV', 'ASC']]
  });
  ```

### PHẢN BIỆN 2: AI ĐỀ XUẤT TRẢ `err.stack` VÀ `err.message` TRỰC TIẾP CHO MỌI LỖI 500
- **Đoạn code sai AI đưa ra:**
  ```javascript
  app.use((err, req, res, next) => {
    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  });
  ```
- **Chỉ ra rủi ro và phê phán:**
  1. *Rò rỉ thông tin hệ thống (Information Disclosure):* `err.stack` tiết lộ đường dẫn thư mục tuyệt đối trên máy chủ, cấu trúc mã nguồn, phiên bản thư viện, vị trí dòng code có thể bị khai thác.
  2. *Lộ thông tin nhạy cảm của CSDL:* Khi lỗi kết nối CSDL xảy ra, `err.message` của Sequelize thường chứa câu SQL nội bộ, tên bảng, tên cột, thậm chí username/connection string.
- **Bản sửa đúng chuẩn bảo mật:**
  ```typescript
  console.error('[UNHANDLED SERVER ERROR]:', error);
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(500).json({
    success: false,
    status: 500,
    message: 'Lỗi hệ thống, vui lòng thử lại sau',
    data: null,
    ...(isDevelopment && {
      stack: error instanceof Error ? error.stack : String(error)
    })
  });
  ```

---

## 3. TRẢ LỜI 12 CÂU HỎI BẢO VỆ CHƯƠNG 08 (MỤC 22 ĐỀ BÀI)

1. **page, limit và offset khác nhau thế nào? page=5 và limit=20 thì offset là bao nhiêu?**
   - *page:* Số thứ tự trang người dùng muốn xem (bắt đầu từ 1).
   - *limit:* Số lượng bản ghi tối đa trên một trang.
   - *offset:* Số lượng bản ghi cần bỏ qua tính từ đầu tập dữ liệu. Công thức: `offset = (page - 1) * limit`.
   - Với `page = 5, limit = 20` thì `offset = (5 - 1) * 20 = 80`.

2. **Vì sao phải ORDER BY maSV trước khi dùng OFFSET/FETCH trong SQL Server?**
   - Mệnh đề `OFFSET ... FETCH` trong chuẩn T-SQL bắt buộc phải đi kèm `ORDER BY`. Nếu không có `ORDER BY`, thứ tự bản ghi không được đảm bảo cố định giữa các lần truy vấn, dẫn đến việc phân trang bị nhảy dòng, trùng lặp hoặc sót dữ liệu giữa các trang. Sắp xếp theo khóa chính `maSV` đảm bảo thứ tự luôn xác định và tối ưu hiệu năng.

3. **findAll() khác findAndCountAll() ra sao? rows và count dùng để làm gì?**
   - `findAll()` chỉ thực hiện một truy vấn `SELECT` lấy danh sách bản ghi.
   - `findAndCountAll()` đồng thời trả về:
     - `rows`: Mảng các bản ghi thuộc trang hiện tại (áp dụng LIMIT và OFFSET).
     - `count`: Tổng số bản ghi thỏa mãn điều kiện `WHERE` (thực hiện truy vấn `COUNT` tương đương).
   - `count` dùng để tính tổng số trang (`totalPages`) cho metadata phân trang.

4. **Vì sao totalPages = Math.ceil(totalItems / limit)? Khi không có dữ liệu thì trả gì?**
   - Phép chia `totalItems / limit` có thể ra số lẻ thập phân (ví dụ 5 mục, limit 2 => 2.5). Dùng `Math.ceil()` làm tròn lên để trang cuối cùng chứa phần dư còn lại (3 trang). Khi không có dữ liệu (`totalItems = 0`), quy ước trả `totalPages = 0` và `data = []`.

5. **Vì sao lọc search theo hoTen phải xảy ra trước khi tính count và lấy trang?**
   - Nếu phân trang trước rồi mới lọc tìm kiếm trên trang đó, ta chỉ tìm trong phạm vi vài bản ghi của trang hiện tại và bỏ sót tất cả sinh viên phù hợp ở các trang khác. Cần áp dụng điều kiện `WHERE hoTen LIKE ...` vào toàn bộ bảng trước, tính `count` trên tập kết quả lọc, sau đó mới chia trang.

6. **Nếu client gửi page="abc" hoặc limit=-2, lỗi phù hợp là 400 hay 500? Vì sao?**
   - Lỗi phù hợp là **400 Bad Request**. Vì đây là lỗi do phía client gửi tham số đầu vào không hợp lệ (sai kiểu dữ liệu, vi phạm ràng buộc miền giá trị). Mã 500 chỉ dành cho lỗi nội bộ của server (chết kết nối DB, lỗi logic chưa bắt,...).

7. **Vì sao không nên trả data={rows,pagination} thay cho data[] của chương trước?**
   - Vì vi phạm tính tương thích ngược (Backward Compatibility). Các client hoặc Frontend của Chương 04–07 đang kỳ vọng `response.data.data` là một mảng để render danh sách `data.map(...)`. Nếu đổi thành object `{ rows, pagination }`, mã nguồn Frontend cũ sẽ lập tức bị lỗi `data.map is not a function`. Metadata `pagination` phải đặt cùng cấp với `data` ở root của response.

8. **Axios gửi SQL tới Database hay gửi HTTP tới Backend? Chứng minh bằng Network.**
   - Axios chạy trên trình duyệt chỉ gửi **yêu cầu mạng HTTP** (ví dụ `GET /api/v1/sinh-vien?page=2&limit=2`) tới Express Backend. Trình duyệt không có quyền và không kết nối trực tiếp đến Database. Express Backend nhận HTTP request, xử lý logic, dùng Sequelize gửi câu lệnh SQL qua cổng TDS (1433) tới SQL Server. Bằng chứng: trong tab Network của DevTools chỉ có các request HTTP/HTTPS với headers và status code, không hề có luồng kết nối TCP SQL.

9. **AppError và Global Error Middleware khác nhau về trách nhiệm?**
   - `AppError` là lớp đối tượng (Error Model) biểu diễn một lỗi nghiệp vụ có chủ đích, chứa thông điệp và mã trạng thái HTTP (400, 401, 403, 404, 409).
   - `Global Error Middleware` là hàm xử lý tập trung đặt ở cuối chuỗi ứng dụng Express (4 tham số: `err, req, res, next`), chịu trách nhiệm tiếp nhận mọi lỗi từ controller/service ném ra, định dạng cấu trúc JSON phản hồi thống nhất và quyết định việc log/ẩn thông tin nhạy cảm.

10. **Express 5 chuyển lỗi từ async handler tới middleware như thế nào?**
    - Trong Express 5, các async route handler trả về một `Promise`. Khi một lỗi xảy ra bên trong hàm async (hoặc Promise bị reject), Express 5 tự động bắt lấy (`catch`) và chuyển giao lỗi đó cho chuỗi Error Middleware xử lý mà không bắt buộc phải dùng wrapper `asyncHandler` hay viết khối `try-catch` thủ công ở mọi nơi.

11. **Vì sao không được hiển thị stack trace và connection string ở production?**
    - Stack trace tiết lộ cấu trúc mã nguồn, đường dẫn file trên máy chủ, thư viện bên thứ ba và phiên bản hệ điều hành. Connection string có thể chứa tên server, cổng, username, mật khẩu SQL Server. Khi công khai ra ngoài, kẻ tấn công có thể lợi dụng những thông tin này để khai thác lỗ hổng bảo mật hoặc chiếm quyền điều khiển CSDL.

12. **Nêu ba bằng chứng để chứng minh nâng cấp Chương 08 không làm hỏng Chương 07.**
    - *Bằng chứng 1:* Gọi `GET /api/v1/sinh-vien` không truyền query vẫn nhận mã `200 OK` với `data` là mảng sinh viên tương thích hoàn toàn giao diện cũ.
    - *Bằng chứng 2:* API `POST /api/auth/login` và `GET /api/auth/profile` kèm Bearer JWT vẫn hoạt động trơn tru; Student gọi `DELETE` vẫn bị chặn mã `403 Forbidden`.
    - *Bằng chứng 3:* API Upload ảnh đại diện `/api/auth/me/avatar` vẫn nhận multipart file qua Multer, lưu ảnh vào `public/uploads/` và cập nhật trường `avatarUrl` trong SQL Server.
