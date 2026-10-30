# Tổng hợp kiểm tra Chương 3

> Mục đích: giúp rà soát nhanh những gì đã có trong Chương 3 và những gì còn cần xác minh. Đây là kiểm kê tĩnh các file và nội dung cấu hình; chưa chạy build, SQL scripts, kết nối database, server hoặc test API trong lần kiểm tra này.

## Phạm vi và lưu ý

- Chỉ kiểm tra nội dung Chương 3 tại `Baitapchuong3`.
- Không sửa, di chuyển hoặc xóa bất kỳ file nào của Chương 2.
- Không đọc hoặc ghi giá trị trong `.env`; chỉ xác nhận file tồn tại và so sánh tên biến với `.env.example`.
- Một file ảnh trong `Baitapchuong2/picture_test_postman` đang có thay đổi Git chưa commit từ trước. Đã để nguyên file đó.
- Lần kiểm tra này chỉ tạo file tổng hợp này; các file dự án Chương 3 khác được giữ nguyên.

## Đã có

### Tài liệu Chương 3

- `Bài thực hành chương 3 KẾT NỐI SQL SERVER & SEQUELIZE ORM.pdf`
- `Chương 3 KẾT NỐI SQL SERVER & SEQUELIZE ORM.pdf`
- `NHAT_KY_THAO_TAC_CHUONG_3.md`

### Cấu hình dự án

Trong `Baitapchuong3/backend-quan-ly-sinh-vien` đã có:

- `package.json` và `pnpm-lock.yaml`; khai báo Express, Sequelize 6, Tedious, TypeScript, tsx, các lệnh `dev`, `build`, `start`, `check:db`.
- `tsconfig.json` cấu hình ESM/NodeNext, `rootDir: src`, `outDir: dist`, strict type checking.
- `.env`, `.env.example`, `.gitignore`.
- Các thư mục `node_modules` và `dist` hiện tồn tại trên máy.

Tên biến trong `.env` và `.env.example` đang khớp nhau: `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ENCRYPT`, `DB_TRUST_CERT`. Giá trị `.env` không được mở hoặc ghi lại trong báo cáo.

`.gitignore` có quy tắc bỏ qua `node_modules/`, `dist/`, `.env`. Theo trạng thái Git hiện tại, `.env` không được Git theo dõi.

### Mã nguồn backend

Đã có các thành phần sau:

- `src/server.ts`
- `src/config/database.ts`
- `src/dtos/sinhVien.dto.ts`
- `src/models/SinhVien.ts`
- `src/models/Lop.ts`
- `src/models/index.ts` thiết lập quan hệ `Lop`–`SinhVien`
- `src/services/sinhVien.service.ts`
- `src/controllers/sinhVien.controller.ts`
- `src/routes/sinhVien.routes.ts`
- `src/middlewares/logger.middleware.ts`
- `src/middlewares/error.middleware.ts`
- `src/utils/AppError.ts`
- `src/scripts/check-db.ts`
- `src/scripts/check-association.ts`

### SQL scripts

Trong `sql/` có đủ bốn file:

1. `01-quan-ly-sinh-vien.sql` — tạo database và bảng SinhVien.
2. `02-seed.sql` — thêm dữ liệu mẫu SV001, SV002.
3. `03-app-login.sql` — tạo login/user ứng dụng và cấp quyền.
4. `04-lop-va-quan-he.sql` — tạo bảng Lop, khóa ngoại và quyền SELECT cho tài khoản ứng dụng.

### Kiểm thử và tài liệu dự án

- `postman_collection_buoi4.json`: có 13 request; cả 13 request đều có test event.
- `test-api.mjs`: có 13 lời gọi `runTest`.
- `README.md`: hướng dẫn cấu hình SQL Server, lệnh chạy, kiểm thử API và các câu hỏi tự đánh giá.
- `NHAT_KY_THAO_TAC_CHUONG_3.md`: có tiến độ thao tác, bảng kết quả kiểm thử và phần tự đánh giá.

## Cần xem xét nhưng chưa tự ý chỉnh

- `sql/03-app-login.sql` đang chứa một mật khẩu mẫu cố định trong câu lệnh tạo login. File này hiện được Git theo dõi. Trước khi công khai repository, cần thay cách cấp mật khẩu bằng quy trình an toàn phù hợp hoặc ít nhất xác nhận đó chỉ là mật khẩu mẫu không được tái sử dụng. Không đưa mật khẩu thật vào Git.
- Trong thư mục Chương 3 đang có `Q&A_C2.md`, `SUBMIT_C2.md`, `skill/postman.md`, `skill/clean-architecture.md` mang nội dung/tên của Chương 2. Chúng đang tồn tại trong bản sao dự án Chương 3; hãy quyết định có cần giữ làm tài liệu tham khảo hay không. Báo cáo này không xóa chúng.
- `package.json` không khai báo script `test`; runner vẫn có thể gọi trực tiếp bằng `node test-api.mjs`. Chỉ cần thêm script nếu người học muốn dùng lệnh `pnpm test` và được yêu cầu.

## CÒN THIẾU / CHƯA XÁC MINH — đặt cuối file để dễ tìm

1. **Chưa chạy kiểm tra thực tế trong lần kiểm kê này.** Trạng thái “đã chạy thành công” trong nhật ký là nội dung được ghi sẵn, không phải kết quả được tái xác nhận lần này. Cần tự chạy `pnpm build`, `pnpm check:db`, kiểm tra association, server và API khi sẵn sàng.
2. **Điều kiện dữ liệu đầu vào của test runner cần làm rõ.** `sql/02-seed.sql` chỉ seed SV001 và SV002, nhưng `test-api.mjs` bắt đầu bằng GET SV003 kỳ vọng đã tồn tại rồi mới POST trùng SV003. Runner không tự tạo SV003 thành công trước đó. Vì vậy, trên database mới chỉ chạy seed, test runner không tự đủ điều kiện chạy lại từ đầu; cần xác nhận setup dữ liệu mong đợi hoặc bổ sung bước chuẩn bị riêng sau khi được cho phép sửa.
3. **Số lượng và phạm vi test không thống nhất giữa các tài liệu.** Postman Collection có 13 request và test runner có 13 lời gọi `runTest`, nhưng bảng nhật ký liệt kê T01–T14 và tuyên bố 13/13. Ngoài ra, nhật ký có ca `maLop = LOP_AO`, trong khi runner/collection dùng trường mã lớp rỗng hoặc khoảng trắng; cần đối chiếu xem có thiếu ca kiểm tra khóa ngoại hay không.
4. **Chưa xác nhận trạng thái SQL Server/database.** Các file cấu hình và script tồn tại, nhưng lần này không chạy service SQL Server, không chạy script SQL và không kết nối CSDL để tránh thay đổi dữ liệu hoặc trạng thái máy.
5. **Chưa xác nhận repository có public hay chưa và chưa có link public được kiểm tra.** Cấu hình Git local cho thấy thư mục cha có repository Git, nhưng trạng thái public phải kiểm tra trực tiếp trên nơi lưu trữ và thử mở link trong trình duyệt chưa đăng nhập.
6. **Chưa chuẩn bị bằng chứng nộp độc lập.** Có Collection JSON và nhật ký, nhưng chưa kiểm tra/export kết quả chạy mới, chưa đối chiếu ảnh bằng chứng, và chưa lập một báo cáo nộp hoàn chỉnh theo yêu cầu của giảng viên.
7. **Trước khi push công khai**, kiểm tra lại danh sách file được Git theo dõi để chắc chắn không có `.env`, `node_modules`, `dist`, mật khẩu thật, token hoặc thông tin cá nhân. `.env` hiện bị ignore và chưa được track; `sql/03-app-login.sql` vẫn cần xử lý/đánh giá riêng như ghi ở trên.

## Lệnh tham khảo để bạn tự chạy sau khi sẵn sàng

Mở terminal tại `Baitapchuong3/backend-quan-ly-sinh-vien`, rồi chạy từng lệnh theo hướng dẫn và trạng thái SQL Server của máy:

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm check:db
npx tsx src/scripts/check-association.ts
```

Chạy server bằng `pnpm dev` trong terminal riêng. Khi server đã sẵn sàng, chạy bộ kiểm thử:

```powershell
node test-api.mjs
```

Không chạy những lệnh này nếu chưa chuẩn bị SQL Server/database theo tài liệu hoặc chưa muốn thực hiện thao tác kết nối/kiểm thử.
