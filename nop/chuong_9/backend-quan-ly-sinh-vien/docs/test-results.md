# BẢNG KẾT QUẢ KIỂM THỬ THỰC TẾ CHƯƠNG 09
## KIỂM THỬ TỰ ĐỘNG, BẢO MẬT & TRIỂN KHAI DOCKER (JEST · SUPERTEST · HELMET · SQL SERVER · DOCKER)

- **Backend Base URL:** `http://localhost:5000`
- **Testing Framework:** Jest 29 + ts-jest (ESM Mode) + Supertest
- **Test Runner Command:** `pnpm test`
- **Kết quả tổng quan:** `3 passed, 3 total test suites` | `13 passed, 13 total tests` (PASS 100%)

---

## 1. MA TRẬN UNIT TESTS VỚI JEST & MOCK (T01 - T05)

| Mã | Tình huống kiểm thử logic Login | Expected Result | Actual Result | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **T01** | Tài khoản tồn tại, mật khẩu đúng | Xác thực thành công, cấp Bearer Token (`expiresIn: 3600`) | Nhận `accessToken: "mocked.jwt.token"`, `tokenType: "Bearer"` | **PASS** |
| **T02** | Tài khoản tồn tại, mật khẩu sai | Từ chối với `AppError(401)`, tuyệt đối không cấp Token | Ném `AppError(401, "Email hoặc mật khẩu không chính xác")`, JWT không sinh | **PASS** |
| **T03** | Tài khoản email không tồn tại trong hệ thống | Từ chối với `AppError(401)`, không tiết lộ user vắng mặt | Ném `AppError(401, "Email hoặc mật khẩu không chính xác")`, JWT không sinh | **PASS** |
| **T04** | Kiểm tra validation schema (`loginSchema`) | Zod `safeParse` từ chối input thiếu password hoặc sai email | `result.success === false` cho cả 2 trường hợp thiếu trường | **PASS** |
| **T05** | Sự cố kết nối CSDL (SQL Server timeout) | Lỗi được truyền ra ngoài an toàn, không sinh token giả | Ném `Error("Connection timeout SQL Server")`, không cấp JWT | **PASS** |

---

## 2. MA TRẬN API TESTS VỚI SUPERTEST (A01 - A07)

| Mã | Endpoint & Tình huống | Expected HTTP & JSON | Actual HTTP & JSON | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **A01** | `POST /api/auth/login` hợp lệ | `HTTP 200 OK`<br>`data.accessToken` tồn tại | `HTTP 200 OK`<br>`{"success":true,"data":{"accessToken":"...","tokenType":"Bearer"}}` | **PASS** |
| **A02** | `POST /api/auth/login` sai mật khẩu | `HTTP 401 Unauthorized`<br>`data: null` | `HTTP 401 Unauthorized`<br>`{"success":false,"status":401,"message":"Email hoặc mật khẩu không chính xác","data":null}` | **PASS** |
| **A03** | `POST /api/auth/login` email không có | `HTTP 401 Unauthorized` | `HTTP 401 Unauthorized`<br>`{"success":false,"status":401,"data":null}` | **PASS** |
| **A04** | `POST /api/auth/login` thiếu password | `HTTP 400 Bad Request`<br>Validation Error | `HTTP 400 Bad Request`<br>`{"success":false,"message":"Dữ liệu đầu vào không hợp lệ",...}` | **PASS** |
| **A05** | `GET /api/auth/profile` thiếu JWT | `HTTP 401 Unauthorized`<br>Bị `isAuth` chặn | `HTTP 401 Unauthorized`<br>`{"success":false,"status":401,"message":"Thiếu header Authorization hoặc không tìm thấy token","data":null}` | **PASS** |
| **A06** | `GET /api/auth/profile` có Bearer JWT | `HTTP 200 OK`<br>Trả thông tin cá nhân | `HTTP 200 OK`<br>`{"success":true,"data":{"id":"usr-student-01","fullName":"Nguyễn Văn An",...}}` | **PASS** |
| **A07** | `GET /api/duong-dan-khong-ton-tai` | `HTTP 404 Not Found`<br>404 Fallback JSON | `HTTP 404 Not Found`<br>`{"success":false,"status":404,"message":"Không tìm thấy đường dẫn","data":null}` | **PASS** |

---

## 3. MA TRẬN KIỂM THỬ BẢO MẬT API (S01 - S07)

| Mã | Tình huống kiểm thử | Expected | Actual Result | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **S01** | Gửi 5 request Login trong 60 giây | Xử lý bình thường | Cả 5 request đều được định tuyến vào login handler | **PASS** |
| **S02** | Gửi request Login thứ 6 trong 60s | `HTTP 429 Too Many Requests` | `HTTP 429`<br>`{"success":false,"status":429,"message":"Bạn đã gửi quá nhiều yêu cầu..."}` | **PASS** |
| **S03** | Chờ hết 60 giây và gửi lại | Hạn mức được cấp lại | Request được xử lý bình thường | **PASS** |
| **S04** | Gọi `GET /api/v1/sinh-vien` liên tục | Không bị chặn bởi login limiter | Trả `200 OK` danh sách bình thường | **PASS** |
| **S05** | Kiểm tra Helmet Security Headers | Có các header bảo mật | Có `X-Content-Type-Options: nosniff`, `X-Frame-Options` | **PASS** |
| **S06** | Nhập sai pass liên tiếp | Trả 401, limiter vẫn đếm | Đếm đủ 5 lần thì lần 6 chuyển sang 429 | **PASS** |
| **S07** | Sinh viên ép gọi DELETE sinh viên | `HTTP 403 Forbidden` | Bị `isAdmin` chặn với `status: 403` | **PASS** |

---

## 4. MA TRẬN VẬN HÀNH DOCKER & COMPOSE (D01 - D09)

| Mã | Hạng mục kiểm tra | Expected | Actual Result | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **D01** | Khởi chạy Backend container | Container `backend-api` Up | `backend-api` chạy cổng `5000:5000` | **PASS** |
| **D02** | Khởi chạy SQL Server container | Container `sqlserver-db` Up | `sqlserver-db` lắng nghe cổng 1433 | **PASS** |
| **D03** | `GET /api/v1/sinh-vien` trong container | `200 OK`, đọc CSDL SQL thật | Đọc đầy đủ danh sách sinh viên CSDL | **PASS** |
| **D04** | Login đúng qua Docker | `200 OK` + JWT Bearer | Cấp JWT Token hợp lệ | **PASS** |
| **D05** | Login sai qua Docker | `401 Unauthorized` | Trả 401 an toàn | **PASS** |
| **D06** | Rate Limit trong container | Gọi spam trả HTTP 429 | `HTTP 429 Too Many Requests` | **PASS** |
| **D07** | Phân trang & Tìm kiếm qua Docker | `page=2&limit=2` hoạt động | Trả đúng trang 2, không lặp dữ liệu | **PASS** |
| **D08** | Profile thiếu JWT qua Docker | `401 Unauthorized` | Bị chặn bởi `isAuth` | **PASS** |
| **D09** | Recreate container bảo tồn CSDL | `docker compose down` rồi `up -d` | Dữ liệu `SV001` và avatar volume vẫn tồn tại 100% | **PASS** |

---

## 5. MA TRẬN HỒI QUY CHỨC NĂNG CŨ CHƯƠNG 08 (R01 - R05)

| Mã | Chức năng kiểm tra hồi quy | Expected | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **R01** | CRUD SinhVien (GET, POST, PUT, DELETE) | Đúng phân quyền Admin / Student | Hoạt động bình thường, bảo vệ bởi JWT & RBAC | **PASS** |
| **R02** | Pagination & Search | `page`, `limit`, `search` lọc tại SQL Server | Sequelize `findAndCountAll` trả đúng `data[]` + `pagination` | **PASS** |
| **R03** | Global Error Middleware | Trả cấu trúc JSON nhất quán | 400, 401, 403, 404, 500 đồng bộ `{success, status, message, data: null}` | **PASS** |
| **R04** | Avatar Upload với Multer | Giới hạn 2MB, magic bytes | Kiểm tra định dạng và lưu ảnh vào `public/uploads/` thành công | **PASS** |
| **R05** | Giao diện React Frontend | Kết nối Axios, Login, Table | Hoạt động trơn tru không lỗi | **PASS** |
