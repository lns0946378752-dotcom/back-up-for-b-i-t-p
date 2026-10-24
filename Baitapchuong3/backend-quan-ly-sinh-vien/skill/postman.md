# Bài 10 - Hướng dẫn kiểm thử bằng Postman

Hướng dẫn này dành cho người mới. Postman gửi HTTP request tới server; mục **Scripts > Post-response** chạy các khẳng định sau khi response về.

## 1. Khởi động server

Mở terminal ở thư mục có `package.json`, rồi chạy:

```powershell
pnpm build
pnpm dev
```

Để terminal server chạy trong lúc kiểm thử. Server lưu dữ liệu trong RAM; khởi động lại server sẽ khôi phục danh sách mẫu SV001 và SV002.

## 2. Tạo environment trong Postman

1. Mở Postman.
2. Chọn **Environments** ở thanh bên, sau đó chọn **Create Environment**.
3. Đặt tên `Backend Sinh Vien Local`.
4. Thêm biến:
   - Variable: `baseUrl`
   - Initial value: `http://localhost:5000`
   - Current value: `http://localhost:5000`
5. Lưu environment và chọn nó trong danh sách environment đang hoạt động.

Trong URL request, `{{baseUrl}}` sẽ được thay bằng địa chỉ server local.

## 3. Tạo collection và request

1. Chọn **Collections > Create new collection**, đặt tên `Backend Quan Ly Sinh Vien`.
2. Tạo các request bên dưới trong collection. Chọn đúng method, URL và body.
3. Với request POST, chọn **Body > raw > JSON** rồi nhập JSON được chỉ định.
4. Mở **Scripts > Post-response**, dán script tương ứng của request đó.
5. Chọn **Send**; xem status/body ở phần response và kết quả `PASS`/`FAIL` trong **Test Results**.

Tạo các request theo thứ tự sau. Không chạy T06 trước T05.

## T01 - Kiểm tra server

- Method: `GET`
- URL: `{{baseUrl}}/`
- Body: không có
- Kỳ vọng: HTTP 200 và thông báo server đang hoạt động.

```javascript
pm.test("Tra ve HTTP 200", function () {
    pm.response.to.have.status(200);
});
pm.test("Thong bao server dung", function () {
    const body = pm.response.json();
    pm.expect(body.success).to.eql(true);
    pm.expect(body.message).to.eql("Backend quản lý sinh viên đang hoạt động");
});
```

## T02 - Xem danh sách ban đầu

- Method: `GET`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body: không có
- Kỳ vọng: HTTP 200; danh sách ban đầu có SV001 và SV002.

```javascript
pm.test("Tra ve HTTP 200 va danh sach co hai sinh vien", function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(true);
    pm.expect(body.data).to.be.an("array").with.lengthOf(2);
    pm.expect(body.data.map((sv) => sv.maSV)).to.eql(["SV001", "SV002"]);
});
```

## T03 - Tìm sinh viên tồn tại

- Method: `GET`
- URL: `{{baseUrl}}/api/v1/sinh-vien/SV001`
- Body: không có
- Kỳ vọng: HTTP 200; dữ liệu là sinh viên Minh Nhật.

```javascript
pm.test("Tim thay SV001", function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(true);
    pm.expect(body.data.maSV).to.eql("SV001");
    pm.expect(body.data.hoTen).to.eql("Minh Nhật");
});
```

## T04 - Tìm sinh viên không tồn tại

- Method: `GET`
- URL: `{{baseUrl}}/api/v1/sinh-vien/SV999`
- Body: không có
- Kỳ vọng: HTTP 404 và thông báo không tìm thấy.

```javascript
pm.test("Khong tim thay ma khong ton tai", function () {
    pm.response.to.have.status(404);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.eql("Không tìm thấy sinh viên");
});
```

## T05 - Thêm SV003 thành công

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body > raw > JSON:

```json
{
  "maSV": "SV003",
  "hoTen": "Ngọc Mai",
  "email": "ngocmai@example.com",
  "maLop": "25CT114"
}
```

- Kỳ vọng: HTTP 201 và `success: true`.

```javascript
pm.test("Tao moi sinh vien thanh cong", function () {
    pm.response.to.have.status(201);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(true);
    pm.expect(body.data.maSV).to.eql("SV003");
    pm.expect(body.data.hoTen).to.eql("Ngọc Mai");
});
```

## T06 - Từ chối thêm trùng SV003

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body: gửi lại chính xác body SV003 của T05 khi chưa restart server.
- Kỳ vọng: HTTP 409, `success: false`, thông báo không rỗng.

```javascript
pm.test("Tu choi ma sinh vien bi trung", function () {
    pm.response.to.have.status(409);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.be.a("string").and.not.empty;
    pm.expect(body.message).to.eql("Mã sinh viên đã tồn tại");
});
```

Script T06 chỉ kiểm tra response của POST. Để xác minh dữ liệu không bị thêm trùng, chạy thêm request GET kiểm tra danh sách ngay sau T06.

### T06b - Xác minh chỉ có một SV003

- Method: `GET`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body: không có

```javascript
pm.test("Danh sach chi co mot SV003 sau request trung", function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    const soLuongSV003 = body.data.filter((sv) => sv.maSV === "SV003").length;
    pm.expect(soLuongSV003).to.eql(1);
});
```

## T07 - Từ chối thiếu họ tên

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body:

```json
{
  "maSV": "SV004",
  "email": "a@ex.com",
  "maLop": "25CT114"
}
```

- Kỳ vọng: HTTP 400; dữ liệu SV004 không được thêm.

```javascript
pm.test("Tu choi request thieu ho ten", function () {
    pm.response.to.have.status(400);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.be.a("string").and.not.empty;
});
```

Sau T07, tạo/chạy request xác minh:

- Method: `GET`
- URL: `{{baseUrl}}/api/v1/sinh-vien/SV004`
- Kỳ vọng: HTTP 404; SV004 không bị lưu.

```javascript
pm.test("SV004 khong bi luu khi request khong hop le", function () {
    pm.response.to.have.status(404);
    pm.expect(pm.response.json().success).to.eql(false);
});
```

## T08 - Từ chối email sai định dạng

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body:

```json
{
  "maSV": "SV004",
  "hoTen": "Minh",
  "email": "khong-phai-email",
  "maLop": "25CT114"
}
```

- Kỳ vọng: HTTP 400 và lỗi email; sau đó GET SV004 vẫn phải trả 404.

```javascript
pm.test("Tu choi email sai dinh dang", function () {
    pm.response.to.have.status(400);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.eql("Email không đúng định dạng");
});
```

## T09 - Từ chối mã sinh viên kiểu số

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Body:

```json
{
  "maSV": 4,
  "hoTen": "Minh",
  "email": "a@ex.com",
  "maLop": "25CT114"
}
```

- Kỳ vọng: HTTP 400; API không tự đổi số `4` thành chuỗi `"4"`.

```javascript
pm.test("Tu choi ma sinh vien khong phai chuoi", function () {
    pm.response.to.have.status(400);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.include("đều phải là chuỗi");
});
```

## T10 - Từ chối JSON sai cú pháp

- Method: `POST`
- URL: `{{baseUrl}}/api/v1/sinh-vien`
- Chọn **Body > raw > JSON**, nhập cố ý nội dung JSON thiếu dấu `}`:

```text
{"maSV":"SV004"
```

- Kỳ vọng: HTTP 400 và response JSON có `success: false`, không phải trang lỗi HTML.

```javascript
pm.test("JSON sai cu phap duoc tra ve loi JSON 400", function () {
    pm.response.to.have.status(400);
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.eql("Dữ liệu JSON trong body sai cú pháp");
});
```

## T11 - Đường dẫn không tồn tại

- Method: `GET`
- URL: `{{baseUrl}}/khong-co`
- Body: không có
- Kỳ vọng: HTTP 404 và response JSON theo định dạng của ứng dụng.

```javascript
pm.test("Duong dan khong ton tai tra 404 JSON", function () {
    pm.response.to.have.status(404);
    const body = pm.response.json();
    pm.expect(body.success).to.eql(false);
    pm.expect(body.message).to.eql("Không tìm thấy đường dẫn");
});
```

## Cách đọc kết quả

- `PASS`: response đáp ứng điều kiện trong `pm.test`.
- `FAIL`: mở test bị lỗi để xem kỳ vọng nào không khớp; ghi lại status và response body thực tế, không sửa kỳ vọng chỉ để biến test thành PASS.
- T06 và T06b kiểm tra hai điều khác nhau: T06 kiểm tra lỗi trùng mã, T06b gọi GET để kiểm tra trạng thái danh sách sau lỗi.
- Muốn chạy lại từ đầu, dừng server bằng `Ctrl+C`, khởi động lại `pnpm dev`, rồi chạy lại thứ tự trên. Dữ liệu ở RAM mất khi server dừng.

## Lưu hoặc nộp collection

Collection được lưu trong Postman khi tạo và lưu request. Prompt trong tài liệu hiện có không nêu rằng phải export/nộp collection hoặc ảnh chụp. Chỉ export collection hay chuẩn bị ảnh nếu giảng viên/LMS yêu cầu cụ thể; theo dõi yêu cầu đó trong [`../SUBMIT_C2.md`](../SUBMIT_C2.md).
