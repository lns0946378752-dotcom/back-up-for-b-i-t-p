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

## Yêu cầu nộp chính thức

Các prompt Bài 3-Bài 10 hiện có trong tài liệu hướng dẫn không chỉ định định dạng hoặc nơi nộp (ví dụ: ảnh chụp, Postman collection export, báo cáo hay file ZIP). Do đó chưa có yêu cầu submit chính thức nào được xác nhận. Không tải hay gửi dữ liệu lên một hệ thống giả định.

Nếu giảng viên/LMS có yêu cầu cụ thể, hãy gửi nguyên văn yêu cầu hoặc ảnh chụp hướng dẫn. Khi đó bổ sung vào file này:

- Chính xác file hoặc bằng chứng cần nộp.
- Tên và vị trí lưu file.
- Cách tạo, kiểm tra, và tải lên đúng nơi.
- Trạng thái chưa làm/đã chuẩn bị/đã nộp (chỉ cập nhật trạng thái sau khi bạn xác nhận).

Lưu ý: các bước chạy build, server và Postman ở trên là việc bạn cần tự thao tác để học và kiểm tra; không tự động đồng nghĩa với việc phải nộp ảnh chụp.
