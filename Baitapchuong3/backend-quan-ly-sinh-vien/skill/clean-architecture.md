# Bài 9 - Hiểu hướng mở rộng Clean Architecture

Bài này là bài giải thích kiến trúc, không phải yêu cầu thay code hiện tại, tạo database hay kết nối SQL Server.

## Phân biệt nghiệp vụ và nơi lưu dữ liệu

Trong `src/services/sinhVien.service.ts`, các kiểm tra định dạng mã sinh viên, email, tên và mã lớp là **quy tắc nghiệp vụ**. Chúng quyết định một sinh viên có hợp lệ để tạo trong ứng dụng hay không.

Các thao tác tìm trong `sinhVienList` và thêm vào `sinhVienList` là **truy xuất/lưu trữ dữ liệu**. Hiện mảng chỉ nằm trong RAM nên dữ liệu mất khi server dừng.

## Bốn khái niệm

- **Entity:** biểu diễn đối tượng cốt lõi trong nghiệp vụ, chẳng hạn `SinhVien`. Entity có thể bảo vệ các quy tắc không được vi phạm của sinh viên.
- **Use Case:** mô tả một việc người dùng muốn hệ thống thực hiện, như thêm sinh viên hoặc lấy danh sách. Use Case điều phối nghiệp vụ và repository.
- **Interface (hợp đồng):** mô tả các thao tác lưu trữ mà nghiệp vụ cần, ví dụ `list()`, `findByMaSV(maSV)` và `create(sinhVien)`, mà không nói dữ liệu được lưu bằng cách nào.
- **Repository (adapter):** hiện thực hợp đồng để đọc/ghi nơi lưu cụ thể. `MemorySinhVienRepository` có thể dùng mảng; một adapter SQL có thể được cân nhắc ở bài khác nếu yêu cầu.

## Hướng tách trách nhiệm nếu sau này được yêu cầu refactor

Một cấu trúc dự kiến, chưa được tạo trong bài này:

```text
src/
  domain/
    entities/SinhVien.ts
    repositories/ISinhVienRepository.ts
  use-cases/
    ThemSinhVienUseCase.ts
    LayDanhSachSinhVienUseCase.ts
  infrastructure/
    repositories/MemorySinhVienRepository.ts
```

Use Case nhận một repository thông qua constructor hoặc tham số. Khi đó có thể thay implementation bộ nhớ bằng một adapter khác mà không viết lại quy tắc nghiệp vụ. Tài liệu hướng dẫn gốc sử dụng tên phương thức `getAll`, `findByMaSV`, `save`; hãy giữ thống nhất một bộ tên khi thật sự bắt đầu refactor.

## Vì sao Service/Use Case không nên phụ thuộc Express hay mssql?

Express là chi tiết nhận request và gửi response HTTP; SQL driver là chi tiết kết nối một loại cơ sở dữ liệu. Nếu nghiệp vụ import chúng trực tiếp, logic bị ràng buộc với framework và cách lưu trữ. Giữ quy tắc nghiệp vụ độc lập giúp thay lớp giao tiếp hoặc adapter lưu trữ ít ảnh hưởng hơn.

## Phạm vi hiện tại

Bài 9 chỉ yêu cầu phân tích trách nhiệm và đề xuất file. Không tạo các file kiến trúc dự kiến ở trên, không thêm database và không đổi thiết kế của Bài 8.
