# Hướng Dẫn Dự Án Backend Quản Lý Sinh Viên - Buổi 4 (SQL Server & Sequelize ORM)

Dự án này là bước nâng cấp từ mảng dữ liệu tạm trong RAM sang hệ quản trị cơ sở dữ liệu quan hệ **Microsoft SQL Server** thông qua **Sequelize 6 ORM** và driver **Tedious**.

---

## 1. Cấu Hình SQL Server Local

- **Phiên bản CSDL**: Microsoft SQL Server (SQLEXPRESS)
- **Giao thức mạng**: TCP/IP (Port 1433, IPAll)
- **Chế độ xác thực**: Mixed Mode (SQL Server and Windows Authentication)
- **Database**: `QuanLySinhVienDB`
- **Tài khoản ứng dụng**: `sv_app` (Chỉ được cấp đặc quyền tối thiểu `SELECT, INSERT` trên `dbo.SinhVien` và `SELECT` trên `dbo.Lop`).

---

## 2. Thứ Tự Chạy Script SQL (Trong SSMS hoặc sqlcmd)

Chạy các file script trong thư mục `sql/` theo đúng thứ tự:

1. **`sql/01-quan-ly-sinh-vien.sql`**: Khởi tạo Database `QuanLySinhVienDB` và bảng `dbo.SinhVien` (Khóa chính `maSV VARCHAR(5)`).
2. **`sql/02-seed.sql`**: Nạp dữ liệu mẫu ban đầu (`SV001`, `SV002`) với tiền tố `N'...'` Unicode và kiểm tra tránh ghi đè dữ liệu.
3. **`sql/03-app-login.sql`**: Tạo tài khoản `sv_app` ở cấp Server và User `sv_app` ở cấp Database, chỉ cấp quyền `SELECT` và `INSERT`.
4. **`sql/04-lop-va-quan-he.sql`** *(Mục 20 Mở rộng)*: Tạo bảng `dbo.Lop`, đồng bộ các mã lớp hiện có từ `SinhVien`, tạo khóa ngoại `FK_SinhVien_Lop`, và cấp quyền `SELECT` bảng `Lop` cho `sv_app`.

---

## 3. Cấu Hình Biến Môi Trường (.env)

Tạo file `.env` ở thư mục gốc (cùng cấp `package.json`):

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=1433
DB_NAME=QuanLySinhVienDB
DB_USER=sv_app
DB_PASSWORD="MAT_KHAU_LOCAL_CUA_BAN"
DB_ENCRYPT=true
DB_TRUST_CERT=true
```

> **Lưu ý**: File `.env` chứa mật khẩu nhạy cảm và đã được đưa vào `.gitignore`. Khi nộp bài hoặc push code lên Git, chỉ chia sẻ file `.env.example`.

---

## 4. Các Lệnh Thực Thi (pnpm)

Chạy tại thư mục `backend-quan-ly-sinh-vien`:

```bash
# Cài đặt các phụ thuộc
pnpm install

# Kiểm tra kết nối độc lập tới Database SQL Server
pnpm check:db

# Biên dịch TypeScript sang JavaScript ESM
pnpm build

# Chạy ở chế độ phát triển (hot reload qua tsx)
pnpm dev

# Chạy bản build sản phẩm
pnpm start
```

---

## 5. Quy Trình Kiểm Thử API & Bằng Chứng Chức Năng

Bộ sưu tập Postman đã sẵn sàng tại: [`postman_collection_buoi4.json`](./postman_collection_buoi4.json).
Bạn có thể chạy tự động bộ test bằng lệnh:

```bash
node test-api.mjs
```

### Các kịch bản kiểm thử trọng tâm:
1. **Kiểm tra trạng thái máy chủ**: `GET /` -> 200 OK.
2. **Đọc dữ liệu từ Database**: `GET /api/v1/sinh-vien` -> 200 OK (Danh sách lấy từ SQL Server).
3. **Tìm kiếm theo mã**: `GET /api/v1/sinh-vien/SV001` -> 200 OK.
4. **Mã không tồn tại**: `GET /api/v1/sinh-vien/SV999` -> 404 Not Found.
5. **Đường dẫn không tồn tại**: `GET /khong-co` -> 404 Not Found.
6. **Thêm mới thành công**: `POST /api/v1/sinh-vien` (SV003) -> 201 Created (Ghi trực tiếp vào SQL Server).
7. **Lưu bền vững (Persistence)**: Tắt server (`Ctrl+C`), khởi động lại (`pnpm dev` hoặc `pnpm start`), gọi `GET /api/v1/sinh-vien/SV003` -> Dữ liệu SV003 vẫn còn nguyên.
8. **Bảo vệ trùng mã**: `POST /api/v1/sinh-vien` lại SV003 -> 409 Conflict.
9. **Ma trận lỗi dữ liệu (Validation 400)**:
   - Thiếu trường bắt buộc hoặc chỉ chứa khoảng trắng -> 400 Bad Request.
   - Mã sinh viên sai định dạng (không khớp `^SV[0-9]{3}$`) -> 400 Bad Request.
   - Email sai định dạng -> 400 Bad Request.
   - Mã lớp không tồn tại trong bảng `Lop` (Mục 20) -> 400 Bad Request.
   - Chuỗi họ tên dài quá 150 ký tự -> 400 Bad Request.
   - Cú pháp JSON hỏng -> 400 Bad Request.

---

## 6. Trả Lời Câu Hỏi Tự Đánh Giá (Mục 22)

1. **DTO và Model khác nhau thế nào?**
   - **DTO (Data Transfer Object)**: Đại diện cho dữ liệu trao đổi giữa Client và Server qua giao thức HTTP (request/response). DTO quy định hình dạng dữ liệu đi vào/ra API và độc lập với công nghệ lưu trữ.
   - **Model (Sequelize Model)**: Đại diện cho cấu trúc lưu trữ và quy tắc của bảng trong cơ sở dữ liệu quan hệ (tên cột, kiểu dữ liệu SQL, khóa chính, khóa ngoại, ánh xạ quan hệ).

2. **Vì sao Controller cần `await` sau khi đổi Service?**
   - Khi chuyển sang SQL Server, các thao tác đọc/ghi dữ liệu là các tác vụ I/O mạng bất đồng bộ, trả về `Promise`. Controller bắt buộc phải dùng `await` để chờ CSDL xử lý và trả kết quả thực tế trước khi gửi response JSON về cho Client; nếu không `await`, client sẽ nhận về đối tượng `Promise` rỗng hoặc response bị trả về sớm trước khi dữ liệu được truy vấn.

3. **Vì sao restart không dùng để reset test nữa?**
   - Trước đây dữ liệu nằm trong mảng biến nhớ RAM của tiến trình Node.js, khi dừng server thì bộ nhớ bị giải phóng hoàn toàn. Hiện nay dữ liệu được lưu bền vững trên đĩa cứng bởi hệ quản trị cơ sở dữ liệu SQL Server. Dù server Node.js tắt hay mở lại thì dữ liệu trong CSDL vẫn tồn tại nguyên vẹn.

4. **Khóa chính (PK) bảo vệ trùng mã thế nào?**
   - CSDL SQL Server cài đặt chỉ mục Unique Clustered Index trên cột khóa chính `maSV`. Khi có request thêm mới trùng mã, tầng Database sẽ chặn lại ở cấp vật lý và phát sinh lỗi `UniqueConstraintError`. Nhờ đó loại bỏ hoàn toàn nguy cơ trùng lặp dữ liệu kể cả khi xảy ra tranh chấp ghi đồng thời (race conditions) từ nhiều tiến trình cùng lúc.

5. **Tại sao POST và GET phải đọc/ghi cùng nguồn?**
   - Đảm bảo tính nhất quán dữ liệu (Data Consistency). Nếu POST ghi vào một nơi (RAM) còn GET đọc từ nơi khác (SQL Server) thì client sau khi tạo mới thành công sẽ không thể xem hoặc tìm thấy dữ liệu mình vừa tạo, phá vỡ tính đúng đắn của toàn bộ hệ thống.
