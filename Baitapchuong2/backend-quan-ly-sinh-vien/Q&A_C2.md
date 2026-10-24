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

## Q&A 5 - Làm gì sau khi chạy `pnpm build`

**Câu hỏi/yêu cầu của người học:**  
Người học chạy `pnpm build` trong đúng thư mục dự án và thấy lệnh gọi `tsc` nhưng không có thông báo lỗi. Hỏi bước tiếp theo cần làm.

**Phản hồi của AI:**  
Nếu lệnh đã kết thúc và dấu nhắc terminal quay lại mà không có lỗi, TypeScript build thành công. Tiếp theo chạy `pnpm dev`, giữ terminal đó mở, kiểm tra `http://localhost:5000/`, rồi tự làm các request theo thứ tự trong `skill/postman.md`. Dừng server bằng `Ctrl+C` sau khi kiểm tra xong.

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Vì sao cần giữ terminal đang chạy `pnpm dev` mở trong khi gửi request từ trình duyệt hoặc Postman?

## Q&A 6 - Việc cần làm sau khi hoàn tất Postman

**Câu hỏi/yêu cầu của người học:**  
Sau khi hoàn tất các request Postman, người học muốn biết cần làm gì tiếp theo để hoàn thành Chương 2.

**Phản hồi của AI:**  
Đối chiếu đủ 11 test case T01-T11 theo status, response body và các bước GET xác minh dữ liệu; xác nhận T06 trả 409 và GET danh sách chỉ có một SV003. Sau đó dừng server bằng `Ctrl+C`, đọc và chuẩn bị trả lời sáu câu hỏi vấn đáp cuối tài liệu để giải thích luồng Route–Controller–Service, POST/body, ý nghĩa test 409, GET xác minh, dữ liệu RAM khi restart, và cách kiểm chứng yêu cầu. Bài 9 chỉ yêu cầu hiểu hướng Clean Architecture, không yêu cầu triển khai database. Các prompt đã xem không nêu định dạng hoặc nơi nộp bài, nên chỉ chuẩn bị/nộp thêm khi giảng viên hoặc LMS đưa yêu cầu cụ thể.

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Trong sáu câu hỏi vấn đáp cuối tài liệu, câu nào bạn thấy khó giải thích nhất?

## Q&A 7 - Hoàn tất Postman và thời điểm nộp bài

**Câu hỏi/yêu cầu của người học:**  
Người học báo đã làm xong Postman và hỏi cần làm gì tiếp, đã đến bước nộp bài chưa. Người học gửi ảnh chụp các request và response kiểm thử.

**Phản hồi của AI:**  
Ảnh cho thấy phần lớn response phù hợp, nhưng cần sửa/đối chiếu hai mục trước khi xem Postman hoàn tất:

1. Ảnh GET xác minh SV004 sau khi gửi dữ liệu email sai cho thấy status 404, đây là kết quả đúng vì dữ liệu không được lưu. Tuy nhiên script trong ảnh lại mong đợi status 400 và thông báo lỗi email. Đặt kiểm tra email 400 ở POST T08; đổi script của GET xác minh thành kiểm tra 404 và `success: false`.
2. Ảnh T09 hiện là GET danh sách với response 200, nên chưa kiểm thử việc từ chối mã sinh viên kiểu số. Tạo/gửi lại POST `/api/v1/sinh-vien` với Body raw JSON có `"maSV": 4`, rồi kiểm tra status 400 và `success: false`.

**Đính chính:** Ban đầu AI kết luận nhầm là tài liệu không nêu yêu cầu nộp vì đã không kiểm tra trang cuối. Sau khi đối chiếu trang 31 của PDF, tài liệu yêu cầu chuẩn bị mã nguồn/configuration gồm `src`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `.env.example`, `.gitignore`; Postman Collection JSON; bảng kết quả T01-T11 và ảnh ít nhất một ca thành công cùng hai ca bị từ chối; nhật ký prompt tạo chức năng và prompt sửa lỗi nếu có. Tài liệu nêu rõ không nộp `node_modules`, `dist` hoặc `.env` thật.

Người học nhắc thầy yêu cầu gửi link Git repository công khai. Ghi nhận public repository link theo lời dặn này; trước khi push cần kiểm tra repository không theo dõi `.env` hoặc credential. Hai mục Postman cần sửa/chạy lại vẫn được theo dõi trong `SUBMIT_C2.md`.

**Câu hỏi củng cố của AI — chưa có câu trả lời:**  
Trong Postman, vì sao GET `/api/v1/sinh-vien/SV004` sau một POST thất bại phải mong đợi 404, không phải 400?

## Q&A 8 - Làm rõ yêu cầu nộp và không vội sang bài khác

**Câu hỏi/yêu cầu của người học:**  
Người học nhắc AI không hướng dẫn sang bài tiếp theo quá sớm, vì đang kiểm tra yêu cầu của giảng viên; người học nhớ phải nộp link Git repository công khai và loại trừ `.env` cùng một số file khác.

**Phản hồi của AI:**  
Đã xin lỗi vì kết luận trước đó sai và xác nhận trang 31 của tài liệu có mục nộp bài. Các mục cần chuẩn bị và danh sách loại trừ đã được ghi chính xác trong `SUBMIT_C2.md`. Yêu cầu repository public được ghi theo lời người học nhớ về hướng dẫn của thầy. AI chưa tạo hoặc đẩy repository lên Git và sẽ chờ người học xác nhận đã kiểm tra xong yêu cầu trước khi hướng dẫn thao tác public/push.

## Ghi chú cập nhật

Khi có câu hỏi mới trong quá trình học, hãy thêm mục tiếp theo theo cấu trúc: câu hỏi/yêu cầu, câu trả lời của người học (nếu có), phản hồi của AI, và trạng thái nếu còn nội dung đang chờ trả lời.
