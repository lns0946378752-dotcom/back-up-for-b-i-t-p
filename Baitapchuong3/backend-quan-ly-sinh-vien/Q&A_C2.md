# Nhật ký Q&A - Chương 2

File này lưu các câu hỏi củng cố, câu trả lời của người học và phản hồi giải thích của AI. Những câu hỏi chưa được trả lời được đánh dấu riêng để tiếp tục cập nhật sau.

## Q&A 1 - `scripts.test` và `@types/express`

**Câu hỏi của AI:**  
`pnpm test` hiện chạy loại việc gì, và vì sao `@types/express` chưa đủ để chạy một ứng dụng Express?

**Câu trả lời của người học:**  
`pnpm test` tìm phần `scripts` có chứa `test` và thực hiện khai báo bên trong `package.json`. `@types/express` là tệp khai báo kiểu dữ liệu cho TypeScript nên chưa đủ điều kiện để chạy một ứng dụng Express.

**Phản hồi của AI:**  
Đúng. `pnpm test` chạy lệnh được khai báo ở script `test`; với nội dung hiện tại, lệnh chỉ in thông báo chưa có bài kiểm thử rồi thoát với trạng thái lỗi. `@types/express` giúp TypeScript kiểm tra kiểu, còn ứng dụng cần gói `express` để chạy.

## Q&A 2 - Lỗi khi cài thư viện Express

**Câu hỏi/yêu cầu của người học:**  
Lệnh cài thư viện bị báo `ERR_PNPM_NO_MATCHING_VERSION` cho `helmet@8pnpm`. Người học muốn biết nguyên nhân và cách sửa để các thư viện chạy ứng dụng Express có trong `package.json`.

**Phản hồi của AI:**  
Lệnh bị dính phần `pnpm add ...` thứ hai vào sau `helmet@8`, khiến pnpm hiểu `helmet@8pnpm` là tên/phiên bản gói không tồn tại. Cách sửa là chạy riêng lệnh:

```cmd
pnpm add express@5 dotenv@16 cors@2 helmet@8
```

Lệnh đã chạy thành công trong thư mục dự án. `express`, `dotenv`, `cors` và `helmet` được thêm vào `dependencies`; pnpm cũng cập nhật `pnpm-lock.yaml`. Kiểm tra bằng `pnpm install --frozen-lockfile` và `pnpm list --depth 0` cho kết quả thành công, hiển thị đủ các gói runtime và gói phát triển.

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Vì sao `@types/express` nằm trong `devDependencies`, còn `express` nằm trong `dependencies`?

## Q&A 3 - ESM, NodeNext và khởi động server

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Trong Bài 3, `type: "module"` trong `package.json` phối hợp với `module: "NodeNext"` trong `tsconfig.json` để làm gì?

## Q&A 4 - Chạy `pnpm build` trong đúng thư mục

**Câu hỏi/yêu cầu của người học:**  
Người học chạy `pnpm build` tại `D:\Backend\back up for bài tập` và nhận lỗi `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`. Muốn biết cách sửa và tiếp tục các bước còn lại trong chương.

**Phản hồi của AI:**  
Đây là thư mục cha, không chứa `package.json`. Lệnh cần chạy ở `D:\Backend\back up for bài tập\Baitapchuong2\backend-quan-ly-sinh-vien`. Trong Command Prompt, chuyển đến dự án bằng:

```cmd
cd /d "D:\Backend\back up for bài tập\Baitapchuong2\backend-quan-ly-sinh-vien"
```

Sau khi dấu nhắc hiển thị thư mục `backend-quan-ly-sinh-vien`, chạy `pnpm build`. Tiếp đó có thể chạy `pnpm dev` để mở server, hoặc làm theo các bước Postman trong `skill/postman.md`. Các file hướng dẫn nêu riêng phần người học cần tự thao tác và ghi rõ đề hiện chưa cung cấp yêu cầu nộp chính thức.

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Vì sao pnpm cần tìm thấy `package.json` trong thư mục hiện tại trước khi chạy `pnpm build`?

## Ghi chú cập nhật

Khi có câu hỏi mới trong quá trình học, hãy thêm mục tiếp theo theo cấu trúc: câu hỏi/yêu cầu, câu trả lời của người học (nếu có), phản hồi của AI, và trạng thái nếu còn nội dung đang chờ trả lời.
