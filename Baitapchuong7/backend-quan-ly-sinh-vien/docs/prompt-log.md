# NHẬT KÝ PROMPT VÀ PHẢN BIỆN BẢO MẬT CHƯƠNG 07 (MULTER, VITE, AXIOS, CORS)

Dự án: **Quản lý sinh viên - Upload Avatar (Multer) & Kết nối Frontend React Vite**

---

## 1. PHẢN BIỆN BẢO MẬT ĐOẠN CODE AI NGUY HIỂM (MỤC 18 ĐỀ BÀI)

Đoạn code AI tạo ra có chứa nhiều lỗ hổng nghiêm trọng:
```typescript
// ĐOẠN CODE SAI - CHỈ ĐỌC ĐỂ REVIEW
app.use(cors());
router.post("/me/avatar", upload.single("avatar"), async (req, res) => {
  const fileName = req.file?.originalname;
  await User.update({ avatarUrl: fileName }, { where: { id: req.body.userId } });
  res.json({ success: true });
});
```

### Bảng phân tích lỗ hổng và giải pháp khắc phục:
1. **Lỗ hổng 1: Bỏ qua `isAuth` trước `upload.single("avatar")`**
   - *Nguy cơ:* Bất kỳ kẻ tấn công nào cũng có thể gửi file rác làm tràn ổ đĩa server mà không cần đăng nhập.
   - *Cách sửa:* Bắt buộc đặt middleware `isAuth` trước `upload.single("avatar")`. Chưa xác thực token thì không bao giờ tiếp nhận luồng xử lý file.
2. **Lỗ hổng 2: Tin tưởng `req.body.userId` từ Client**
   - *Nguy cơ (IDOR - Insecure Direct Object References):* Kẻ tấn công có thể truyền `userId` của người khác để thay đổi ảnh đại diện của nạn nhân tùy ý.
   - *Cách sửa:* Tuyệt đối không dùng `req.body.userId`. Chỉ lấy `userId = req.user.sub` đã được giải mã và chứng thực từ chữ ký số JWT.
3. **Lỗ hổng 3: Dùng nguyên `originalname` để lưu và làm đường dẫn**
   - *Nguy cơ:* Trùng tên file ghi đè dữ liệu của nhau, hoặc chứa ký tự đặc biệt nguy hiểm (Path Traversal như `../../malicious.exe`).
   - *Cách sửa:* Đổi tên file ngẫu nhiên an toàn bằng `crypto.randomUUID()` hoặc timestamp, lưu đường dẫn tương đối `/uploads/<filename>`.
4. **Lỗ hổng 4: Không giới hạn dung lượng và kiểm tra nội dung file thực**
   - *Nguy cơ:* Bị tấn công từ chối dịch vụ (DoS) bằng file cực lớn; hoặc đổi đuôi mã độc PHP/HTML/EXE thành `.png` để vượt qua kiểm tra đuôi mở rộng.
   - *Cách sửa:* Cấu hình `limits: { fileSize: 2 * 1024 * 1024 }` (bắt mã 413), đồng thời đọc kiểm tra Magic Bytes nhị phân (PNG: `89 50 4E 47`, JPEG: `FF D8 FF`).

---

## 2. TRẢ LỜI 12 CÂU HỎI BẢO VỆ CHƯƠNG 07 (THEO MỤC 21 ĐỀ BÀI)

1. **`application/json` khác `multipart/form-data` ở điểm nào? Vì sao `express.json()` không đủ cho file?**  
   *Trả lời:* `application/json` dùng để truyền chuỗi ký tự có cấu trúc JSON dạng text thuần túy. Khi truyền file nhị phân (hình ảnh, video), định dạng `multipart/form-data` chia nội dung thành nhiều khối (part) ngăn cách bằng boundary. `express.json()` chỉ có thể parse text JSON, không thể đọc và ghi các stream nhị phân của file vào ổ đĩa. Vì vậy cần Multer để giải mã multipart stream.

2. **Điều gì xảy ra khi FormData dùng `photo` nhưng Multer cấu hình `single("avatar")`?**  
   *Trả lời:* Multer sẽ phát hiện field name không khớp với cấu hình, ném ra lỗi `MulterError: Unexpected field` (code `LIMIT_UNEXPECTED_FILE`). Middleware sẽ chặn lại và trả về mã lỗi `400 Bad Request`.

3. **`req.file` và `req.body` nằm ở đâu sau Multer? `req.user` xuất hiện ở bước nào?**  
   *Trả lời:* `req.file` chứa đối tượng metadata của file ảnh vừa lưu (path, size, filename,...). `req.body` chứa các trường text khác gửi kèm trong form-data. Cả hai được Multer tạo ra. Trong khi đó, `req.user` xuất hiện từ trước đó do middleware `isAuth` gán vào sau khi giải mã JWT Bearer token thành công.

4. **Vì sao gọi `isAuth` trước Multer? Có cần `isAdmin` để User đổi Avatar chính mình không?**  
   *Trả lời:* Gọi `isAuth` trước để chặn ngay những request nặc danh hoặc token giả mạo, ngăn không cho server tiêu tốn tài nguyên tiếp nhận và ghi file lên ổ đĩa. Đổi avatar là quyền cá nhân của chính tài khoản đang đăng nhập nên **không cần `isAdmin`**, chỉ cần `isAuth` là đủ.

5. **Vì sao không nhận `userId` trong body cho endpoint `/me/avatar`?**  
   *Trả lời:* Để phòng chống tấn công IDOR. Nếu nhận `userId` từ body, một sinh viên có thể truyền `userId` của Admin để sửa ảnh đại diện của Admin. Việc lấy trực tiếp từ `req.user` bảo đảm người dùng chỉ sửa được hồ sơ của chính mình.

6. **Ổ đĩa chứa dữ liệu nào, còn `dbo.Users.avatarUrl` chứa giá trị gì?**  
   *Trả lời:* Ổ đĩa máy chủ (thư mục `public/uploads/`) chứa file ảnh vật lý thực sự (dữ liệu nhị phân). Bảng `dbo.Users.avatarUrl` trong cơ sở dữ liệu chỉ chứa chuỗi đường dẫn URL tương đối (ví dụ: `/uploads/1730379200-uuid.png`).

7. **2MB tương ứng bao nhiêu byte? File 2.200.000 byte nên trả status nào?**  
   *Trả lời:* 2MB = $2 \times 1024 \times 1024 = 2.097.152$ bytes. File 2.200.000 bytes đã vượt quá giới hạn và phải trả về mã HTTP `413 Payload Too Large`.

8. **Chỉ kiểm mimetype và `.png` có đủ để khẳng định file là ảnh PNG hợp lệ không?**  
   *Trả lời:* Hoàn toàn không đủ, vì mimetype và đuôi mở rộng `.png` là các thông tin do Client gửi lên trong header HTTP, kẻ tấn công có thể dễ dàng sửa đổi một file mã độc `.exe` hoặc script `.php` thành tên `evil.png`. Để khẳng định ảnh hợp lệ, server cần kiểm tra Magic Bytes (chữ ký nhị phân 8 byte đầu của PNG: `89 50 4E 47 0D 0A 1A 0A`).

9. **CORS kiểm soát điều gì? Vì sao Postman gọi API được nhưng browser lại báo CORS?**  
   *Trả lời:* CORS (Cross-Origin Resource Sharing) là cơ chế bảo mật do **trình duyệt web (Browser)** thực thi nhằm ngăn chặn một trang web độc hại từ domain này gọi API sang domain khác mà không được phép. Postman là công cụ kiểm thử backend độc lập, không phải trình duyệt nên nó không bị ràng buộc bởi chính sách Same-Origin của trình duyệt, do đó Postman luôn gửi và nhận được response bình thường.

10. **Axios GET `/api/v1/sinh-vien` nên đọc mảng ở `response.data` hay `response.data.data`?**  
    *Trả lời:* Phải đọc ở `response.data.data`. Bởi vì Axios tự bọc JSON trả về vào trường `response.data`, và cấu trúc response chuẩn của Backend quản lý sinh viên là `{ success: true, message: "...", data: [...] }`.

11. **Vì sao Student bị ẩn nút Xóa vẫn phải bị chặn DELETE ở Backend?**  
    *Trả lời:* Ẩn nút trên giao diện chỉ là trải nghiệm người dùng (UX), không phải là bảo mật. Bất kỳ ai cũng có thể mở DevTools Console hoặc dùng Postman để gửi thẳng request `DELETE /api/v1/sinh-vien/:maSV` kèm token của Student. Nếu Backend không có middleware `isAdmin` kiểm tra thì dữ liệu sẽ bị xóa trái phép.

12. **Trình bày 3 bằng chứng cần có để chứng minh upload Avatar thật sự thành công:**  
    *Trả lời:*
    - **Bằng chứng 1 (HTTP Response):** Status `200 OK`, body trả về đúng cấu trúc `{ success: true, data: { avatarUrl: "/uploads/..." } }`.
    - **Bằng chứng 2 (Hệ thống tệp ổ đĩa):** Trong thư mục `public/uploads/` xuất hiện file ảnh mới với đúng tên ngẫu nhiên được sinh ra.
    - **Bằng chứng 3 (Cơ sở dữ liệu SQL Server):** Chạy truy vấn `SELECT avatarUrl FROM dbo.Users WHERE id = ...` thấy giá trị cột `avatarUrl` đã được cập nhật chuỗi đường dẫn mới, và mở URL đó trên trình duyệt xem được ảnh thật.
