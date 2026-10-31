# BẢNG KẾT QUẢ KIỂM THỬ THỰC TẾ CHƯƠNG 08
## PHÂN TRANG, TÌM KIẾM & XỬ LÝ LỖI TẬP TRUNG (SEQUELIZE · SQL SERVER · EXPRESS 5)

- **Backend Base URL:** `http://localhost:5000`
- **Database:** SQL Server Local (`QuanLySinhVienDB` - `dbo.SinhVien`)
- **Tài khoản test:**
  - Admin: `admin@example.com` / `Admin@123`
  - Student: `student@example.com` / `Student@123`

---

## 1. MA TRẬN KIỂM THỬ LAB 1: PAGINATION & SEARCH (P01 - P17)

| Mã | Request / Tình huống | Input | Expected HTTP + JSON | Actual HTTP + JSON | Kết quả | Minh chứng / Cách kiểm chứng |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **P01** | `GET /api/v1/sinh-vien` | Không query | `200 OK`<br>`data: []`<br>`pagination: {page: 1, limit: 10}` | `200 OK`<br>`data` chứa mảng SV, `pagination` mặc định `page=1, limit=10, totalItems=5, totalPages=1` | **PASS** | Kiểm tra cấu trúc JSON đúng hợp đồng, `data` là mảng, metadata `pagination` nằm ở root |
| **P02** | `GET ?page=1&limit=2` | `page=1`, `limit=2` | `200 OK`<br>Tối đa 2 bản ghi đầu theo `maSV ASC` | `200 OK`<br>Trả về 2 SV có `maSV` nhỏ nhất (SV001, SV002), `totalPages=3` | **PASS** | Đối chiếu SSMS: `OFFSET 0 ROWS FETCH NEXT 2 ROWS ONLY` |
| **P03** | `GET ?page=2&limit=2` | `page=2`, `limit=2` | `200 OK`<br>Tối đa 2 bản ghi tiếp theo, không trùng P02 | `200 OK`<br>Trả về 2 SV tiếp theo (SV003, SV004), không trùng với trang 1 | **PASS** | Đối chiếu SSMS: `OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY` |
| **P04** | `GET ?page=3&limit=2` | `page=3`, `limit=2` | `200 OK`<br>Trang cuối chứa phần dư (1 SV) | `200 OK`<br>Trả về 1 bản ghi cuối (SV005), `totalPages=3` | **PASS** | Đối chiếu SSMS: `OFFSET 4 ROWS FETCH NEXT 2 ROWS ONLY` |
| **P05** | `GET ?page=999&limit=2` | `page=999`, `limit=2` | `200 OK`<br>`data: []`<br>`totalItems` vẫn chính xác | `200 OK`<br>`data: []`, `pagination: {page: 999, limit: 2, totalItems: 5, totalPages: 3}` | **PASS** | Vượt quá số trang không bị 500, trả mảng rỗng đúng hợp đồng |
| **P06** | `GET ?page=-1` | `page=-1` | `400 Bad Request`<br>Thông báo page không hợp lệ | `400 Bad Request`<br>`{success: false, status: 400, message: "Tham số page phải là số nguyên dương", data: null}` | **PASS** | Zod validation chặn trước khi gửi query xuống SQL Server |
| **P07** | `GET ?page=0` | `page=0` | `400 Bad Request`<br>`page` phải >= 1 | `400 Bad Request`<br>`{success: false, status: 400, message: "Tham số page phải >= 1", data: null}` | **PASS** | Zod transform & refine kiểm tra `page >= 1` |
| **P08** | `GET ?page=1.5` | `page=1.5` | `400 Bad Request`<br>Không cho số thập phân | `400 Bad Request`<br>`{success: false, status: 400, message: "Tham số page phải là số nguyên dương", data: null}` | **PASS** | Regex `/^\d+$/` chặn số thực/thập phân |
| **P09** | `GET ?limit=abc` | `limit=abc` | `400 Bad Request`<br>Không thể là số nguyên | `400 Bad Request`<br>`{success: false, status: 400, message: "Tham số limit phải là số nguyên dương", data: null}` | **PASS** | Zod bắt lỗi không phải chuỗi chữ số nguyên, không ném 500 |
| **P10** | `GET ?limit=51` | `limit=51` | `400 Bad Request`<br>Chặn limit vượt 50 | `400 Bad Request`<br>`{success: false, status: 400, message: "Tham số limit phải trong khoảng 1–50", data: null}` | **PASS** | Zod rule giới hạn `1 <= limit <= 50` |
| **P11** | `GET ?search=Anh` | `search=Anh` | `200 OK`<br>Chỉ trả SV có họ tên chứa "Anh" | `200 OK`<br>Trả về các SV phù hợp (VD: Nguyễn Tuấn Anh, Trần Lan Anh) | **PASS** | `Op.like: '%Anh%'` lọc đúng cột `hoTen`, `maSV ASC` |
| **P12** | `GET ?search=Anh&page=2&limit=2` | `search=Anh`<br>`page=2, limit=2` | `200 OK`<br>`totalItems` là tổng KẾT QUẢ LỌC | `200 OK`<br>`totalItems` phản ánh đúng số lượng sinh viên chứa "Anh" thỏa WHERE | **PASS** | WHERE áp dụng trước COUNT và LIMIT/OFFSET trong Sequelize `findAndCountAll` |
| **P13** | `GET ?search=khongco` | `search=khongco` | `200 OK`<br>`data: []`<br>`totalItems=0, totalPages=0` | `200 OK`<br>`data: []`, `pagination: {page: 1, limit: 10, totalItems: 0, totalPages: 0}` | **PASS** | Không có bản ghi nào khớp trả mảng rỗng, `totalPages=0` |
| **P14** | `GET ?search=%20Anh%20` | `search="  Anh  "` | `200 OK`<br>Trim thành "Anh" | `200 OK`<br>Tự động trim khoảng trắng đầu cuối, tìm kiếm tương đương `search=Anh` | **PASS** | Zod transform `val.trim()` hoạt động chính xác |
| **P15** | `GET ?search=[81 ký tự]` | Chuỗi dài 81 ký tự | `400 Bad Request`<br>Chặn từ khóa > 80 ký tự | `400 Bad Request`<br>`{success: false, status: 400, message: "Từ khóa tìm kiếm không được vượt quá 80 ký tự", data: null}` | **PASS** | Zod refine `val.length <= 80` chặn từ khóa quá dài |
| **P16** | `GET ?page=2&limit=2` xem SQL log | `page=2, limit=2` | `200 OK`<br>SQL có `ORDER BY` + `OFFSET/FETCH` | `200 OK`<br>Sequelize query log sinh SQL: `ORDER BY [SinhVien].[maSV] ASC OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY` | **PASS** | Chứng minh phân trang thực hiện tại Database SQL Server, không dùng `.slice()` ở JS |
| **P17** | Kiểm tra hồi quy CRUD cũ | `GET /:maSV`<br>`POST`<br>`PUT`<br>`DELETE` | `200/201/400/404/409`<br>Hoạt động bình thường | `200/201/400/404/409`<br>CRUD đầy đủ, bảo vệ bởi JWT & RBAC Admin không bị ảnh hưởng | **PASS** | Kiểm tra toàn bộ endpoint quản lý sinh viên không bị phá vỡ |

---

## 2. MA TRẬN KIỂM THỬ LAB 2: GLOBAL ERROR HANDLING (E01 - E10)

| Mã | Tình huống kiểm thử | HTTP Code | Expected JSON | Actual Status & Body | Kết quả | Minh chứng kiểm chứng |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **E01** | `GET /api/v1/sinh-vien?page=-5` | `400 Bad Request` | `success=false`<br>`status=400`<br>`message` rõ ràng<br>`data=null` | `400 Bad Request`<br>`{"success":false,"status":400,"message":"Tham số page phải là số nguyên dương","data":null}` | **PASS** | Định dạng lỗi chuẩn hóa thống nhất theo hợp đồng Chương 8 |
| **E02** | `GET /api/v1/sinh-vien?limit=abc` | `400 Bad Request` | `success=false`<br>`status=400`<br>`data=null` | `400 Bad Request`<br>`{"success":false,"status":400,"message":"Tham số limit phải là số nguyên dương","data":null}` | **PASS** | Validate query chặn ngay tầng controller/validation trước khi truy vấn DB |
| **E03** | `GET /api/v1/sinh-vien/SV999` | `404 Not Found` | `success=false`<br>`status=404`<br>`message="Không tìm thấy sinh viên"`<br>`data=null` | `404 Not Found`<br>`{"success":false,"status":404,"message":"Không tìm thấy sinh viên","data":null}` | **PASS** | Ném `AppError(404)` từ controller/service, qua `errorMiddleware` trả JSON đồng bộ |
| **E04** | `GET /duong-dan-khong-co` | `404 Not Found` | `success=false`<br>`status=404`<br>`message="Không tìm thấy đường dẫn"`<br>`data=null` | `404 Not Found`<br>`{"success":false,"status":404,"message":"Không tìm thấy đường dẫn","data":null}` | **PASS** | Fallback route handler 404 đặt cuối server.ts trước error middleware |
| **E05** | Lỗi 500 mô phỏng trong development | `500 Internal Server Error` | `success=false`<br>`status=500`<br>`message="Lỗi hệ thống, vui lòng thử lại sau"`<br>`data=null` | `500 Internal Server Error`<br>`{"success":false,"status":500,"message":"Lỗi hệ thống, vui lòng thử lại sau","data":null}` | **PASS** | Che giấu toàn bộ message gốc của lỗi hệ thống, ghi log chi tiết phía server console |
| **E06** | `NODE_ENV=production`, test lỗi 500 | `500 Internal Server Error` | Tuyệt đối không lộ `stack`, không lộ SQL text hay secret | `500 Internal Server Error`<br>Response chỉ chứa `success, status, message, data: null`; không có trường `stack` | **PASS** | Kiểm tra điều kiện `process.env.NODE_ENV === 'development'` để ẩn stack ở production |
| **E07** | `NODE_ENV=development`, test lỗi 500 | `500 Internal Server Error` | Kèm trường `stack` phục vụ debug cục bộ | `500 Internal Server Error`<br>Có trường `stack: Error: ...` phục vụ lập trình viên debug | **PASS** | Trường `stack` chỉ xuất hiện khi chạy môi trường dev an toàn |
| **E08** | `GET /api/auth/profile` thiếu Authorization | `401 Unauthorized` | `success=false`<br>`status=401`<br>`message="Không tìm thấy token xác thực"` | `401 Unauthorized`<br>`{"success":false,"status":401,"message":"Không tìm thấy token xác thực","data":null}` | **PASS** | Middleware `isAuth` từ Chương 6-7 tiếp tục bảo vệ endpoint profile |
| **E09** | Student ép gọi `DELETE /api/v1/sinh-vien/:maSV` | `403 Forbidden` | `success=false`<br>`status=403`<br>`message="Bạn không có quyền thực hiện chức năng này"` | `403 Forbidden`<br>`{"success":false,"status":403,"message":"Bạn không có quyền thực hiện chức năng này","data":null}` | **PASS** | Middleware `isAdmin` chặn tài khoản role "Student", dữ liệu DB giữ nguyên |
| **E10** | Upload file avatar > 2MB / sai định dạng | `413 / 400` | Multer error chuyển thành JSON chuẩn | `413 Payload Too Large`<br>`{"success":false,"status":413,"message":"File tải lên vượt quá dung lượng cho phép (tối đa 2MB)","data":null}` | **PASS** | Bắt lỗi Multer file size và magic bytes, chuyển thành AppError trả JSON đúng mã HTTP |
