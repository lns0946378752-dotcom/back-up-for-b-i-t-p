# Theo dõi việc cần làm và yêu cầu nộp - Chương 2

File này phân biệt các bước bạn cần tự thao tác với yêu cầu nộp chính thức. Không đánh dấu đã kiểm tra hoặc đã nộp nếu bạn chưa tự xác nhận.

## Lưu ý quan trọng về thư mục terminal

`pnpm build` cần chạy tại thư mục dự án có `package.json`. Thư mục `D:\Backend\back up for bài tập` là thư mục cha, vì vậy chạy lệnh ở đó gây lỗi `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`.

Trong Command Prompt, chuyển vào đúng dự án bằng:

```cmd
cd /d "D:\Backend\back up for bài tập\Baitapchuong2\backend-quan-ly-sinh-vien"
```

Xác nhận dấu nhắc kết thúc bằng `\backend-quan-ly-sinh-vien>` rồi mới chạy lệnh pnpm.

## Các bước bạn cần tự thực hiện

### Bài 3 - Khởi tạo server

1. Mở thư mục `backend-quan-ly-sinh-vien` trong VS Code.
2. Chọn **Terminal > New Terminal**.
3. Nếu terminal không ở thư mục dự án, chạy lệnh `cd /d` phía trên.
4. Chạy `pnpm build`; mong đợi TypeScript biên dịch thành công.
5. Chạy `pnpm dev`, mở `http://localhost:5000/` trong trình duyệt và kiểm tra JSON.
6. Dừng server bằng `Ctrl+C`.

### Bài 4 đến Bài 8 - API sinh viên

1. Trong VS Code, mở từng file `src` được liệt kê trong phần thay đổi của câu trả lời.
2. Đọc chú thích và lần theo luồng `Route -> Controller -> Service`.
3. Chạy `pnpm build` từ thư mục dự án.
4. Chạy `pnpm dev`, giữ terminal server mở.
5. Tự gửi các request T01-T11 theo hướng dẫn trong [`skill/postman.md`](./skill/postman.md).
6. Đối chiếu status, JSON và các kết quả kiểm tra; sau cùng dừng server bằng `Ctrl+C`.

### Bài 9 - Clean Architecture

Đọc [`skill/clean-architecture.md`](./skill/clean-architecture.md). Bài này yêu cầu phân tích và đề xuất cách tách trách nhiệm, không yêu cầu refactor hoặc kết nối database.

### Bài 10 - Kiểm thử Postman

1. Cài/mở Postman nếu chưa có.
2. Tạo environment có `baseUrl` và collection theo từng bước trong [`skill/postman.md`](./skill/postman.md).
3. Gửi request đúng thứ tự để mảng RAM bắt đầu chỉ có SV001 và SV002.
4. Kiểm tra tab **Test Results** và gửi GET danh sách sau lần POST trùng để xác nhận chỉ có một SV003.
5. Trước khi kết luận đã kiểm tra hết, xác minh từng ảnh/bằng chứng thể hiện đúng method, URL, body, status và test script của test case đó.

### Đối chiếu ảnh Postman người học gửi ngày 2026-10-24

- T01-T07, T10 và T11 có ảnh thể hiện đúng response cơ bản theo từng yêu cầu.
- Ảnh `08_Test request xác minh.png` gửi GET `/api/v1/sinh-vien/SV004`, response 404 là đúng kết quả xác minh dữ liệu không hợp lệ không bị lưu. Tuy nhiên script trong ảnh đang mong đợi status 400 và thông báo lỗi email. Cần đổi script GET này thành kiểm tra status 404 và `success: false`; việc kiểm tra email 400 phải đặt ở request POST T08.
- Ảnh `09_Từ chối mã sinh viên kiểu số.png` đang là GET danh sách, URL `/api/v1/sinh-vien`, response 200. Ảnh này không chứng minh T09. Cần gửi lại T09 bằng POST `/api/v1/sinh-vien`, Body > raw > JSON với `maSV` là số `4`, rồi xác nhận response 400 và test PASS.
- Ảnh chụp response chưa nhất thiết chứng minh test script đã PASS. Mở **Test Results** cho từng request cần có test; lưu/đính kèm ảnh bổ sung nếu giảng viên yêu cầu bằng chứng.

Trạng thái hiện tại: cần sửa hoặc chụp lại bằng chứng cho request GET xác minh T08 và request T09 trước khi đánh dấu toàn bộ test case đã đối chiếu.

## Yêu cầu nộp theo tài liệu Chương 2

Trang 31 có mục **“Lưu kết quả và nộp bài”**. Hãy chuẩn bị các mục sau:

1. **Mã nguồn và cấu hình cần thiết:** thư mục `src`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.env.example` và `.gitignore`.
2. **Postman Collection đã export:** lưu dưới dạng file JSON; đặt tên request dễ hiểu và có ít nhất hai request chứa test script.
3. **Bảng kết quả T01-T11 và bằng chứng:** ghi kết quả thực tế từng ca; kèm ảnh thể hiện status và response của ít nhất một ca thành công và hai ca bị từ chối.
4. **Nhật ký prompt:** có prompt tạo chức năng và prompt sửa lỗi nếu có, kèm phần đã chỉnh sửa.
5. **Link repository Git công khai:** theo yêu cầu bạn nhớ từ lời dặn của thầy. Repository phải ở chế độ public để người chấm mở xem được. Phần tài liệu PDF được kiểm tra có danh sách nội dung cần nộp và quy định file loại trừ; yêu cầu public link được ghi nhận theo lời bạn nhắc về hướng dẫn của thầy.

### Tuyệt đối không đưa lên repository hoặc gói nộp

- `.env` thật.
- `node_modules/`.
- `dist/`.
- Mật khẩu, token, credential hoặc dữ liệu cá nhân.

`.env.example` là file mẫu được nộp; `.env` thật bị `.gitignore` loại trừ. Lưu ý `.gitignore` không tự bỏ theo dõi file đã được Git add/commit trước đó, nên phải kiểm tra trạng thái Git trước khi đẩy repository công khai.

### Các việc còn phải kiểm tra trước khi nộp

- [ ] Sửa script của request GET xác minh sau T08 để mong đợi status 404 và `success: false`; script kiểm tra email sai 400 phải nằm ở POST T08.
- [ ] Chạy lại T09 bằng POST với body có `"maSV": 4`; xác nhận status 400 và test PASS. Ảnh hiện có là GET danh sách nên chưa chứng minh T09.
- [ ] Đối chiếu Test Results T01-T11; sau T06 kiểm tra GET danh sách cho đúng một SV003.
- [ ] Lưu báo cáo kết quả thực tế, không ghi PASS nếu chưa chạy test.
- [ ] Export Collection thành JSON và xác nhận có ít nhất hai request chứa test script.
- [ ] Thu thập ảnh status/response cho ít nhất một ca thành công và hai ca bị từ chối.
- [ ] Chuẩn bị prompt tạo chức năng và prompt sửa lỗi (nếu có), kèm phần đã chỉnh sửa.
- [ ] Trước khi push lên repository public, xác nhận `.env`, `node_modules` và `dist` không được Git theo dõi.
- [ ] Mở link repository trong cửa sổ ẩn danh hoặc trình duyệt chưa đăng nhập để kiểm tra repository public thật sự xem được.
- [ ] Nộp link repository công khai cùng các mục khác theo đúng nơi/cách thầy hoặc LMS chỉ định.

**Trạng thái hiện tại:** Chưa xác nhận đã sửa/chạy lại hai mục Postman nêu trên; chưa tạo hoặc push repository; chưa xác nhận đã nộp. Không tự thực hiện push/public trước khi người học yêu cầu rõ và kiểm tra nội dung được công khai.

### Hướng dẫn export Postman Collection

1. Trong Postman, mở menu dấu ba chấm cạnh Collection.
2. Chọn **Export**.
3. Chọn Collection v2.1 nếu phiên bản Postman hiển thị tùy chọn đó.
4. Lưu file JSON trong thư mục nộp bài, rồi mở file kiểm tra có đủ request và script.
5. Không export Environment chứa thông tin riêng tư; Collection chỉ nên có URL local và nội dung kiểm thử.

### Hướng dẫn kiểm tra file trước khi push public

1. Mở terminal trong thư mục dự án.
2. Chạy `git status --short` để xem file Git sẽ đưa vào commit.
3. Chạy `git check-ignore .env`; kết quả cần xác nhận `.env` đang bị ignore.
4. Nếu `.env` đã từng được track, `.gitignore` không tự gỡ file đó khỏi Git; dừng lại và gỡ tracking trước khi public. Không push nếu chưa xác nhận repository không chứa file hoặc credential riêng tư.
5. Chỉ sau khi đã kiểm tra nội dung, tạo/push repository và cung cấp URL public theo hướng dẫn của thầy/LMS.
