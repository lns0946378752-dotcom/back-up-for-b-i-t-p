# NHẬT KÝ THAO TÁC VÀ HƯỚNG DẪN THỰC HÀNH CHƯƠNG 3
## MÔN: LẬP TRÌNH BACKEND - BUỔI 4: KẾT NỐI SQL SERVER & SEQUELIZE ORM

> **Tài liệu tham chiếu:**
> - `Bài thực hành chương 3 KẾT NỐI SQL SERVER & SEQUELIZE ORM.pdf`
> - `Chương 3 KẾT NỐI SQL SERVER & SEQUELIZE ORM.pdf`
>
> **Kết quả đạt được:**
> - Chuyển đổi thành công 100% backend quản lý sinh viên từ RAM sang SQL Server qua Sequelize 6 & driver Tedious.
> - Đầy đủ 4 script SQL trong thư mục `sql/` đã chạy và xác thực trên Microsoft SQL Server local.
> - Đạt 13/13 test cases tự động (Hợp đồng HTTP, Lưu bền vững, Bắt trùng 409, Ma trận Validation 400).
> - Hoàn thành mục 20 mở rộng: Thiết lập quan hệ 1-N giữa bảng `dbo.Lop` và `dbo.SinhVien`, bắt lỗi ràng buộc khóa ngoại `maLop` trả về 400.

---

## 📌 PHẦN DÀNH CHO BẠN (NHỮNG THAO TÁC CẦN LÀM / XÁC NHẬN)

1. **Vị trí thư mục dự án**:
   - Thư mục làm việc: `D:\Backend\back up for bài tập\Baitapchuong3\backend-quan-ly-sinh-vien`
   - Khi mở VS Code hoặc CMD / PowerShell, chuyển vào đúng thư mục này:
     ```cmd
     cd /d "D:\Backend\back up for bài tập\Baitapchuong3\backend-quan-ly-sinh-vien"
     ```

2. **Các lệnh kiểm tra nhanh có sẵn**:
   - **Kiểm tra kết nối CSDL**:
     ```bash
     pnpm check:db
     ```
     *(Kết quả in ra: `DB connected: QuanLySinhVienDB`)*
   - **Kiểm tra quan hệ 1-N (Sequelize include Lớp - Sinh viên)**:
     ```bash
     npx tsx src/scripts/check-association.ts
     ```
   - **Chạy toàn bộ 13 test cases tự động**:
     ```bash
     node test-api.mjs
     ```
     *(Kết quả in ra: `TỔNG KẾT: 13/13 TEST CASES ĐẠT THÀNH CÔNG!`)*

3. **Chạy server Backend**:
   - Chế độ phát triển (auto reload):
     ```bash
     pnpm dev
     ```
   - Chế độ chạy bản build chính thức:
     ```bash
     pnpm build
     pnpm start
     ```

4. **Sử dụng Postman**:
   - Mở Postman -> Chọn **Import** -> Chọn file:
     `D:\Backend\back up for bài tập\Baitapchuong3\backend-quan-ly-sinh-vien\postman_collection_buoi4.json`
   - Collection đã cấu hình sẵn biến `baseUrl = http://localhost:5000` và toàn bộ các test script tự động kiểm tra HTTP Status cùng cấu trúc phản hồi JSON.

5. **Xác nhận dữ liệu trực tiếp trong SSMS (SQL Server Management Studio)**:
   - Kết nối vào server: `localhost,1433` (hoặc `127.0.0.1,1433`).
   - Mở New Query và chạy:
     ```sql
     USE QuanLySinhVienDB;
     SELECT * FROM dbo.Lop;
     SELECT maSV, hoTen, email, maLop FROM dbo.SinhVien ORDER BY maSV;
     ```

---

## 📋 TIẾN ĐỘ THỰC HIỆN CỦA AGENT (AI)

| Bước | Nội dung | Trạng thái | Chi tiết thực hiện |
| :---: | :--- | :---: | :--- |
| **01** | Khởi tạo dự án Chương 3 từ Chương 2 | ✅ Hoàn thành | Sao chép sang `Baitapchuong3/backend-quan-ly-sinh-vien`, giữ nguyên vẹn bản Chương 2. |
| **02** | Cấu hình SQL Server TCP/IP cổng 1433 | ✅ Hoàn thành | Bật TCP/IP, xóa Dynamic Ports, cấu hình IPAll port 1433, Mixed Mode, restart service `MSSQL$SQLEXPRESS`. |
| **03** | Viết file `sql/01-quan-ly-sinh-vien.sql` | ✅ Hoàn thành | Tạo Database `QuanLySinhVienDB` và bảng `dbo.SinhVien` với khóa chính `maSV VARCHAR(5)`. |
| **04** | Viết file `sql/02-seed.sql` | ✅ Hoàn thành | Seed dữ liệu mẫu `SV001`, `SV002` với chuỗi Unicode `N'...'` và kiểm tra chống trùng lặp. |
| **05** | Viết file `sql/03-app-login.sql` | ✅ Hoàn thành | Tạo Login & User `sv_app`, cấp đặc quyền tối thiểu `SELECT, INSERT` trên `dbo.SinhVien`. |
| **06** | Thực thi script SQL vào SQL Server local | ✅ Hoàn thành | Chạy thành công bằng `sqlcmd -S "localhost,1433" -E`. |
| **07** | Cài đặt thư viện `sequelize@6` và `tedious` | ✅ Hoàn thành | Cài đặt qua `pnpm add sequelize@6 tedious`. Cập nhật `pnpm-lock.yaml`. |
| **08** | Cấu hình `.env` và `.env.example` | ✅ Hoàn thành | Cấu hình cổng Express 5000, DB host 127.0.0.1, DB port 1433, user `sv_app`. |
| **09** | Viết module kết nối `src/config/database.ts` | ✅ Hoàn thành | Khởi tạo Sequelize 6, cấu hình dialect `mssql`, driver `tedious`, pool tối ưu duy trì kết nối bền vững. |
| **10** | Viết script kiểm tra `src/scripts/check-db.ts` | ✅ Hoàn thành | Thêm script `"check:db": "tsx src/scripts/check-db.ts"`. Xác thực DB kết nối thành công. |
| **11** | Xây dựng Model `src/models/SinhVien.ts` | ✅ Hoàn thành | Kế thừa `Model`, dùng `declare` thuộc tính, ánh xạ 4 cột, `timestamps: false`, schema `dbo`. |
| **12** | Nâng cấp Service sang SQL Server | ✅ Hoàn thành | Chuyển `layDanhSachSinhVien`, `timSinhVienTheoMa`, `themSinhVien` sang async/await. Bắt trùng 409 qua `UniqueConstraintError`. Bổ sung giới hạn độ dài `hoTen<=150`, `email<=254`, `maLop<=50`. |
| **13** | Nâng cấp Controller | ✅ Hoàn thành | Thêm `await` trước Service, gom lỗi đẩy về `next(error)`. |
| **14** | Cập nhật khởi động trong `src/server.ts` | ✅ Hoàn thành | `await sequelize.authenticate()` trước khi mở cổng HTTP lắng nghe. |
| **15** | Kiểm tra kiểm thử lưu bền vững (Persistence) | ✅ Hoàn thành | POST SV003 -> Restart Server -> GET SV003 dữ liệu vẫn còn nguyên vẹn trong CSDL. |
| **16** | Mở rộng Quan hệ Lớp 1-N Sinh viên (Mục 20) | ✅ Hoàn thành | Tạo `sql/04-lop-va-quan-he.sql`, Model `Lop.ts`, `models/index.ts` (`hasMany` / `belongsTo`), kiểm tra mã lớp tồn tại khi POST, bắt `ForeignKeyConstraintError` trả về 400. |
| **17** | Xây dựng bộ test tự động và Postman Collection | ✅ Hoàn thành | Viết `test-api.mjs` (13/13 tests PASS), xuất `postman_collection_buoi4.json` và tài liệu `README.md`. |

---

## 🔍 BẢNG KẾT QUẢ KIỂM THỬ THỰC TẾ

| Mã Test | Ca kiểm thử | Method & Endpoint | Dữ liệu đầu vào | Kết quả kỳ vọng | Kết quả thực tế | Trạng thái |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: |
| **T01** | Kiểm tra server hoạt động | `GET /` | Không | 200 OK | 200 OK | ✅ PASS |
| **T02** | Đọc danh sách từ SQL Server | `GET /api/v1/sinh-vien` | Không | 200 OK (Chứa SV001, SV002) | 200 OK (Mảng SV) | ✅ PASS |
| **T03** | Tìm sinh viên theo mã | `GET /api/v1/sinh-vien/SV001` | `maSV=SV001` | 200 OK (Thông tin Minh Nhật) | 200 OK | ✅ PASS |
| **T04** | Sinh viên không tồn tại | `GET /api/v1/sinh-vien/SV999` | `maSV=SV999` | 404 Không tìm thấy sinh viên | 404 Not Found | ✅ PASS |
| **T05** | Sai đường dẫn | `GET /khong-co` | Không | 404 Không tìm thấy đường dẫn | 404 Not Found | ✅ PASS |
| **T06** | Thêm mới sinh viên vào CSDL | `POST /api/v1/sinh-vien` | `SV003`, Ngọc Mai, `25CT114` | 201 Created | 201 Created | ✅ PASS |
| **T07** | Kiểm tra lưu bền vững sau restart | `GET /api/v1/sinh-vien/SV003` | Sau khi tắt & bật lại server | 200 OK (Vẫn còn SV003) | 200 OK | ✅ PASS |
| **T08** | Gửi lại mã trùng lặp | `POST /api/v1/sinh-vien` | Trùng mã `SV003` | 409 Mã sinh viên đã tồn tại | 409 Conflict | ✅ PASS |
| **T09** | Validation: Họ tên chỉ khoảng trắng | `POST /api/v1/sinh-vien` | `hoTen = "   "` | 400 Bad Request | 400 Bad Request | ✅ PASS |
| **T10** | Validation: Mã SV sai format | `POST /api/v1/sinh-vien` | `maSV = "ABC004"` | 400 Bad Request | 400 Bad Request | ✅ PASS |
| **T11** | Validation: Email sai định dạng | `POST /api/v1/sinh-vien` | `email = "khong-phai-email"` | 400 Bad Request | 400 Bad Request | ✅ PASS |
| **T12** | Validation: Mã lớp không có trong DB | `POST /api/v1/sinh-vien` | `maLop = "LOP_AO"` | 400 Mã lớp không tồn tại | 400 Bad Request | ✅ PASS |
| **T13** | Validation: Họ tên > 150 ký tự | `POST /api/v1/sinh-vien` | `hoTen` dài 151 ký tự | 400 Bad Request | 400 Bad Request | ✅ PASS |
| **T14** | Validation: Body JSON hỏng | `POST /api/v1/sinh-vien` | `{"maSV": "SV099", ...` | 400 Dữ liệu JSON sai cú pháp | 400 Bad Request | ✅ PASS |

---

## 💡 GIẢI ĐÁP BÀI HỌC VÀ CÂU HỎI TỰ TRẢ LỜI (MỤC 22)

### 1. DTO và Model khác nhau thế nào?
- **DTO (Data Transfer Object)**: Là giao ước dữ liệu truyền tải giữa Client và Server (ở tầng API HTTP). DTO chỉ quan tâm đến dữ liệu đầu vào cần nhận và dữ liệu trả ra cho người dùng (ví dụ: bốn trường chuỗi `maSV`, `hoTen`, `email`, `maLop`).
- **Model (Sequelize Model)**: Là lớp ánh xạ thực thể giữa ứng dụng Node.js và cấu trúc bảng vật lý trong SQL Server (`dbo.SinhVien`, `dbo.Lop`). Model chứa các quy tắc CSDL như khóa chính (`primaryKey`), kiểu dữ liệu SQL (`DataTypes.STRING`), tên bảng (`tableName`), schema (`dbo`), các mối liên kết quan hệ (`hasMany`, `belongsTo`).

### 2. Vì sao Controller cần `await` sau khi đổi Service?
- Các hàm Service khi thao tác với mảng RAM chạy đồng bộ tức thì. Nhưng khi chuyển sang SQL Server, mọi truy vấn I/O đều là bất đồng bộ và trả về đối tượng `Promise`.
- Nếu Controller không `await`, mã lệnh sẽ chạy tiếp ngay lập tức và gửi phản hồi trước khi CSDL hoàn tất truy vấn, dẫn đến Client nhận `data: {}` (Promise rỗng) thay vì dữ liệu thật. Do đó Controller bắt buộc phải `await` để đồng bộ kết quả.

### 3. Vì sao restart không dùng để reset test nữa?
- Trước đây dữ liệu được lưu tạm trong RAM tiến trình, việc restart tiến trình sẽ xóa sạch dữ liệu và khởi tạo lại mảng mẫu ban đầu.
- Khi đã kết nối SQL Server, dữ liệu được ghi bền vững vào tệp tin cơ sở dữ liệu trên ổ đĩa. Tiến trình Node.js khởi động lại không ảnh hưởng đến dữ liệu trong SQL Server. Do đó, việc reset test phải được quản lý thông qua script CSDL hoặc dùng các mã định danh mới cho mỗi ca test.

### 4. Khóa chính (PK) bảo vệ trùng mã thế nào?
- SQL Server tự động tạo một chỉ mục duy nhất (Unique Clustered Index) cho cột khóa chính `maSV`. Bất kể ứng dụng có kiểm tra logic trước hay không, nếu có 2 bản ghi cùng `maSV` được ghi xuống CSDL, SQL Server sẽ từ chối bản ghi thứ hai ở cấp độ phần cứng/hệ thống quản trị CSDL, đảm bảo toàn vẹn dữ liệu ngay cả khi có nhiều tiến trình chạy song song (race condition).

### 5. Tại sao POST và GET phải đọc/ghi cùng nguồn?
- Nguyên tắc cốt lõi của tính nhất quán dữ liệu (Data Consistency): Người dùng tạo mới một bản ghi (POST) luôn kỳ vọng sẽ lập tức nhìn thấy bản ghi đó khi truy vấn danh sách hoặc chi tiết (GET). Nếu POST ghi vào một nơi (ví dụ ghi vào RAM) còn GET đọc từ nơi khác (SQL Server), hệ thống sẽ ở trạng thái phân mảnh và không nhất quán.
