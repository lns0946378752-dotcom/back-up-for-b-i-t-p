# Tổng hợp tiến độ bài tập Backend

**Khoảng thời gian:** Từ sáng 23/10/2026 đến 24/10/2026  
**Trạng thái:** Đến thời điểm ghi nhận, các công việc dưới đây là bài tập Chương 2/Chương 3 và kiểm kê file. **Chưa bắt đầu làm báo cáo chiều nay.** File này chỉ tổng hợp tiến độ bài tập, không phải báo cáo nộp.
**Thông tin riêng cho công việc sắp tới:** Người học cho biết thời hạn báo cáo là khoảng 14:25–14:45 ngày 24/10/2026. Chưa có đề bài, mẫu báo cáo hoặc nội dung báo cáo được cung cấp trong cuộc trò chuyện.

## 1. Bài 2 — Backend quản lý sinh viên

### Đã làm

- Khởi tạo dự án bằng pnpm và cài nhóm thư viện runtime (`express`, `dotenv`, `cors`, `helmet`) cùng nhóm công cụ phát triển (`typescript`, `tsx`, các gói `@types`).
- Xác định nguyên nhân lệnh cài thư viện đầu tiên thất bại: lệnh bị dính thành `helmet@8pnpm`; chạy lại lệnh pnpm đúng và xác nhận cài đặt/lockfile.
- Thiết lập ESM, TypeScript NodeNext, lệnh chạy phát triển/build/start và server Express cổng 5000.
- Xây dựng các tầng DTO, Service, Controller, Route; thêm middleware logger và error handling; triển khai GET danh sách, GET theo mã, POST sinh viên và validation.
- Thêm chú thích tiếng Việt giải thích công dụng và luồng chính trong các file TypeScript.
- Tạo hướng dẫn Postman, giải thích Clean Architecture, nhật ký Q&A và checklist submit.
- Build và kiểm thử API ở môi trường làm việc này đã từng được chạy; báo cáo trước ghi nhận các ca API chính đạt, bao gồm trường hợp dữ liệu không hợp lệ không được lưu.

### Điểm cần đối chiếu

- Người học đã gửi ảnh Postman. Phần lớn ảnh cho thấy response phù hợp, nhưng:
  - Ảnh GET xác minh SV004 sau POST lỗi email trả 404 đúng, nhưng script trong ảnh lại mong đợi 400. GET cần kiểm tra 404; lỗi email 400 phải kiểm tra trên POST.
  - Ảnh gắn với T09 đang là GET danh sách trả 200, chưa chứng minh request POST từ chối `maSV` kiểu số.
- Chưa xác nhận hai mục trên đã được sửa/chạy lại.
- Người học nhớ giảng viên yêu cầu nộp link Git repository public. Hướng dẫn Chương 2 cũng nêu không đưa `.env` thật, `node_modules` và `dist` vào bài nộp.
- Chưa xác nhận link/repository công khai hoặc nơi nộp chính thức.

## 2. Bài 3 — Kiểm kê project SQL Server/Sequelize

### Đã kiểm tra tĩnh

- Người học yêu cầu giữ nguyên Bài 2 và chỉ kiểm tra project hiện có trong `Baitapchuong3`.
- Kiểm kê cho thấy đã có cấu hình pnpm/NodeNext, mã nguồn Express/Sequelize, model SinhVien/Lop, association 1-N, bốn SQL scripts, Postman Collection, `test-api.mjs`, README và nhật ký thao tác.
- Tên biến môi trường trong `.env` và `.env.example` khớp nhau; giá trị `.env` không được đọc hoặc ghi vào bản tổng hợp này.
- `.gitignore` bỏ qua `.env`, `node_modules`, `dist`; trạng thái Git đã xác nhận `.env` chưa được track.
- Tạo file `Baitapchuong3/00_TONG_HOP_KIEM_TRA_CHUONG_3.md` để liệt kê những gì có và các mục cần xác minh.

### Các mục còn cần xem xét

- `test-api.mjs` kỳ vọng SV003 tồn tại trước khi bắt đầu ca POST trùng mã; script seed ban đầu chỉ thêm SV001/SV002. Cần xác nhận cách chuẩn bị dữ liệu trước khi chạy test từ đầu.
- Postman Collection và test runner có 13 request/lời gọi, trong khi nhật ký có bảng T01–T14 nhưng ghi 13/13. Cần đối chiếu số lượng và phạm vi test.
- `sql/03-app-login.sql` chứa mật khẩu mẫu cố định và đang được Git theo dõi; cần đánh giá trước khi public repository, tuyệt đối không đưa mật khẩu thật lên Git.
- Chưa chạy lại build, check database, association, server hoặc test runner trong lần kiểm kê này; các kết quả ghi trong nhật ký là nội dung sẵn có, chưa được tái xác minh.
- Chưa xác nhận trạng thái public của repository.

## 3. Việc bài tập trên máy khác / backup đang chờ

- Người học cho biết AI trên máy khác đã làm backup.
- Repository dự kiến: `https://github.com/lns0946378752-dotcom/worker-management.git`.
- Người học xác nhận backup hiện chưa được push/cập nhật lên repository; chưa có branch hoặc commit mới để đọc.
- Chưa pull/clone repository và chưa tạo/chuyển branch. Chờ người học xác nhận máy kia đã push xong.
- Khi nhận xác nhận backup đã được push, có thể đọc nội dung liên quan để cập nhật tiến độ bài tập. Trước khi dùng repository public cần kiểm tra không có `.env`, credential, token hoặc dữ liệu riêng tư.

### Ghi chú branch (chỉ áp dụng nếu sau này cần làm việc với backup)

Branch là nhánh làm việc tách biệt; branch chỉ đồng bộ giữa hai máy sau khi được push lên GitHub. Chưa tạo branch vì backup chưa được cập nhật và hiện chưa bắt đầu báo cáo. Nếu sau này cần làm riêng trên backup:

1. Chưa tạo branch trước khi backup mới xuất hiện trên GitHub.
2. Khi máy kia báo đã push xong, xác nhận branch/commit mới nhất rồi mới đồng bộ nội dung cần thiết về máy này.
3. Chỉ tạo branch mới nếu thực sự cần chỉnh sửa; nếu chỉ đọc file thì không cần branch.
4. Nếu có tạo branch, đặt tên theo đúng nhiệm vụ thực tế. Chỉ đưa các file thuộc nhiệm vụ đó vào branch; không trộn sửa source code, file của Chương 2, `.env`, `node_modules` hoặc `dist`.
5. Kiểm tra `git status` và danh sách file trước khi commit. Nếu có thay đổi cũ không liên quan, để nguyên và không đưa vào commit.
6. Chỉ commit/push khi người học yêu cầu và đã kiểm tra nội dung; không tự public dữ liệu.

## 4. Tài liệu liên quan đang có

- Checklist Bài 2: `Baitapchuong2/backend-quan-ly-sinh-vien/SUBMIT_C2.md`
- Nhật ký Q&A Bài 2: `Baitapchuong2/backend-quan-ly-sinh-vien/Q&A_C2.md`
- Hướng dẫn Postman Bài 2: `Baitapchuong2/backend-quan-ly-sinh-vien/skill/postman.md`
- Tổng hợp kiểm kê Bài 3: `Baitapchuong3/00_TONG_HOP_KIEM_TRA_CHUONG_3.md`
- Nhật ký Chương 3: `Baitapchuong3/NHAT_KY_THAO_TAC_CHUONG_3.md`

## 5. Phân biệt tiến độ bài tập và báo cáo

- Nội dung từ sáng 23/10 đến hiện tại được ghi ở các mục Bài 2, Bài 3 và backup đang chờ; đây là tiến độ làm bài tập.
- Không có phần nào trong file này đại diện cho báo cáo đã viết hoặc đã hoàn thành.
- Báo cáo chiều nay **chưa bắt đầu**. Cần có đề bài/mẫu hoặc yêu cầu cụ thể trước khi triển khai.
- Khi bắt đầu báo cáo, cần tách yêu cầu của báo cáo khỏi phần tổng hợp tiến độ bài tập này và chỉ dùng dữ liệu đã được xác nhận.
- Trong lúc chờ, không public/push thêm, không sửa Bài 2, và không đụng tới `.env` hoặc credential nếu chưa có yêu cầu rõ.
