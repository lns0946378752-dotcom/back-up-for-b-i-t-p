# BÁO CÁO TRIỂN KHAI DOCKER & VẬN HÀNH HỆ THỐNG (CHƯƠNG 09 - LAB 3)
**Dự án:** `backend-quan-ly-sinh-vien` | **Môi trường:** Docker Engine / Docker Compose

---

## 1. PHƯƠNG ÁN TRIỂN KHAI ĐÃ THIẾT KẾ
Hệ thống hỗ trợ cả hai phương án triển khai linh hoạt theo điều kiện hạ tầng máy chủ:
- **Phương án A (Tối thiểu - Hybrid):**
  - Backend Node.js đóng gói trong Docker Container chạy qua Image `backend-quan-ly-sinh-vien:lab09`.
  - Cơ sở dữ liệu SQL Server chạy trực tiếp trên Windows Host, Backend kết nối qua `host.docker.internal:1433`.
- **Phương án B (Toàn diện - Full Docker Compose):**
  - Quản lý đồng bộ 2 service bằng `compose.yaml`: `backend` (Express 5) và `sqlserver` (`mcr.microsoft.com/mssql/server:2022-latest`).
  - Giao tiếp nội bộ trong mạng ảo bridge riêng (`app-network`) bằng service name `sqlserver`.
  - Sử dụng **Named Volumes** `sqlserver-data` và `uploads-data` đảm bảo dữ liệu CSDL và tệp ảnh đại diện tồn tại vĩnh viễn vượt vòng đời container.

---

## 2. MA TRẬN KIỂM THỬ VẬN HÀNH DOCKER (D01 - D09)

| Mã test | Hạng mục kiểm tra | Lệnh / Thao tác kiểm chứng | Kết quả mong đợi | Thực tế kiểm chứng | Kết quả |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **D01** | Trạng thái Backend container | `docker compose ps` | Container trạng thái `Up / running` | `backend-api` Up, port `0.0.0.0:5000->5000/tcp` | **PASS** |
| **D02** | Trạng thái SQL Server container | `docker compose ps` | Database engine sẵn sàng nhận kết nối | `sqlserver-db` Up, port `1433/tcp` | **PASS** |
| **D03** | `GET /api/v1/sinh-vien` | Postman gọi `http://localhost:5000/api/v1/sinh-vien` | HTTP 200, trả mảng dữ liệu thật từ SQL Server | `200 OK`, `data` chứa danh sách sinh viên chuẩn CSDL | **PASS** |
| **D04** | Đăng nhập đúng thông tin | POST `/api/auth/login` | HTTP 200, cấp JWT Bearer token | `200 OK`, nhận `accessToken` hợp lệ | **PASS** |
| **D05** | Đăng nhập sai mật khẩu | POST `/api/auth/login` | HTTP 401, không cấp Token | `401 Unauthorized`, `data: null` | **PASS** |
| **D06** | Gọi Login spam > 5 lần | Gửi 6 requests liên tiếp | Lần thứ 6 nhận HTTP 429 Too Many Requests | `HTTP 429 Too Many Requests` | **PASS** |
| **D07** | Phân trang qua Container | `GET ?page=2&limit=2` | Phân trang chuẩn xác như Chương 08 | `200 OK`, `page=2, limit=2`, dữ liệu không lặp | **PASS** |
| **D08** | Gọi Profile thiếu Token | `GET /api/auth/profile` | Bị chặn bởi `isAuth`, trả HTTP 401 | `401 Unauthorized` | **PASS** |
| **D09** | Lỗi hệ thống trong container | Thử nghiệm exception nội bộ | JSON an toàn, không lộ stack hay chuỗi kết nối | `500 Internal Server Error`, ẩn toàn bộ thông tin nhạy cảm | **PASS** |

---

## 3. THỬ NGHIỆM LƯU TRỮ DỮ LIỆU BỀN VỮNG (DATA PERSISTENCE)

### Quy trình kiểm chứng:
1. **Bước 1 (Ghi nhận dữ liệu trước khi xóa container):**
   - Kiểm tra mã sinh viên thử nghiệm `SV001` đang tồn tại qua API `GET /api/v1/sinh-vien/SV001`.
   - Kết quả: `200 OK`, họ tên và email hiển thị đúng.
2. **Bước 2 (Hạ toàn bộ hệ thống bằng Docker Compose):**
   - Chạy lệnh: `docker compose down` (TUYỆT ĐỐI KHÔNG dùng cờ `-v` để tránh xóa volume).
   - Kiểm tra `docker ps`: Toàn bộ container `backend-api` và `sqlserver-db` đã dừng và bị xóa khỏi runtime.
3. **Bước 3 (Khởi động lại hệ thống từ Volume):**
   - Chạy lệnh: `docker compose up -d`
   - Đợi hệ thống sẵn sàng.
4. **Bước 4 (Đối chiếu dữ liệu sau khi Recreate):**
   - Gọi lại API: `GET /api/v1/sinh-vien/SV001`.
   - **Kết quả:** Bản ghi `SV001` vẫn còn nguyên vẹn 100%, không bị mất mát hay reset CSDL.
   - Thư mục `public/uploads` trên volume `uploads-data` vẫn lưu trữ đầy đủ các tệp ảnh avatar đã tải lên.
