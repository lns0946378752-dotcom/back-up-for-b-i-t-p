# DỰ ÁN QUẢN LÝ SINH VIÊN - CHƯƠNG 09
## KIỂM THỬ TỰ ĐỘNG, BẢO MẬT & TRIỂN KHAI HỆ THỐNG BACKEND

Dự án phát triển hoàn thiện hệ thống Backend quản lý sinh viên với đầy đủ các chuẩn công nghệ hiện đại:
- **Ngôn ngữ & Runtime:** Node.js 22 LTS, TypeScript (ESM / NodeNext)
- **Web Framework:** Express 5
- **Cơ sở dữ liệu:** Microsoft SQL Server 2022 qua Sequelize 6 ORM
- **Xác thực & Phân quyền:** JWT Bearer Token, RBAC (Admin / Student), Bcrypt (salt cost 12)
- **Bảo mật:** Helmet Security Headers, Express Rate Limit (Brute-force protection 429)
- **Kiểm thử tự động:** Jest 29, ts-jest, Supertest (Unit Test & API Integration Test)
- **Đóng gói & Vận hành:** Dockerfile Multi-stage, Docker Compose với Named Volumes

---

## 1. CÀI ĐẶT VÀ CHẠY DỰ ÁN CỤC BỘ

### Yêu cầu môi trường:
- Node.js >= 20
- pnpm >= 9

### Các bước cài đặt:
```bash
# 1. Cài đặt các gói phụ thuộc
pnpm install

# 2. Cấu hình biến môi trường
cp .env.example .env
# Chỉnh sửa thông số kết nối SQL Server và JWT_SECRET trong .env

# 3. Biên dịch mã nguồn TypeScript
pnpm build

# 4. Chạy chế độ phát triển (Development)
pnpm dev

# 5. Khởi chạy chế độ Production
pnpm start
```

---

## 2. CHẠY BỘ KIỂM THỬ TỰ ĐỘNG (AUTOMATED TESTING)

```bash
# Chạy toàn bộ các bài Unit Test và API Test
pnpm test

# Chạy kiểm thử kèm báo cáo độ bao phủ mã nguồn (Code Coverage)
pnpm test:coverage
```

---

## 3. TRIỂN KHAI VỚI DOCKER & DOCKER COMPOSE

Hệ thống hỗ trợ chạy song song cả Backend và SQL Server 2022 trong container với dữ liệu bền vững qua Named Volumes:

```bash
# 1. Build image và khởi động toàn bộ services
docker compose up -d --build

# 2. Kiểm tra trạng thái các container
docker compose ps

# 3. Xem nhật ký log của Backend
docker compose logs -f backend

# 4. Dừng hệ thống nhưng BẢO TỒN dữ liệu CSDL (Không dùng cờ -v)
docker compose down

# 5. Khởi động lại (dữ liệu vẫn còn nguyên vẹn)
docker compose up -d
```

---

## 4. TÀI LIỆU VÀ ĐẶC TẢ HỆ THỐNG
- **Swagger UI:** `http://localhost:5000/api-docs`
- **Đặc tả OpenAPI 3.0:** `docs/openapi.yaml`
- **Báo cáo kết quả kiểm thử (T01-T05, A01-A07, S01-S07, D01-D09):** `docs/test-results.md`
- **Báo cáo đánh giá bảo mật API:** `docs/security-report.md`
- **Báo cáo đo lường & tối ưu hóa SQL:** `docs/sql-optimization.md`
- **Báo cáo triển khai Docker:** `docs/deployment-report.md`
- **Nhật ký prompt CTCO & phản biện AI:** `docs/prompt-log.md`
