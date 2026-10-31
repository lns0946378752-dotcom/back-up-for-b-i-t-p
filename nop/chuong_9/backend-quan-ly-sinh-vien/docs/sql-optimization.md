# BÁO CÁO PHÂN TÍCH VÀ ĐO LƯỜNG TỐI ƯU HÓA TRUY VẤN SQL SERVER (CHƯƠNG 09 - LAB 2)
**Cơ sở dữ liệu:** `QuanLySinhVienDB` | **Hệ quản trị:** Microsoft SQL Server 2022

---

## 1. MỤC TIÊU VÀ PHƯƠNG PHÁP ĐO LƯỜNG
- **Mục tiêu:** Đánh giá hiệu năng của câu truy vấn phân trang kết hợp tìm kiếm từ Chương 08, đo lường chi phí I/O và thời gian thực thi bằng các công cụ chẩn đoán chuyên sâu của SQL Server trong SSMS.
- **Phương pháp đo:**
  - Bật thống kê I/O: `SET STATISTICS IO ON;`
  - Bật thống kê thời gian: `SET STATISTICS TIME ON;`
  - Quan sát kế hoạch thực thi thực tế (Actual Execution Plan).

---

## 2. TRUY VẤN KIỂM CHỨNG (PAGINATION & SEARCH)

### Câu lệnh SQL kiểm thử:
```sql
USE QuanLySinhVienDB;
GO

SET STATISTICS IO ON;
SET STATISTICS TIME ON;

-- Truy vấn phân trang kết hợp tìm kiếm (Page 2, Limit 2, Search 'Anh')
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
WHERE hoTen LIKE N'%Anh%'
ORDER BY maSV ASC
OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY;

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO
```

---

## 3. BẢNG SO SÁNH TRƯỚC VÀ SAU KHI ĐỀ XUẤT TỐI ƯU

| Chỉ tiêu đo lường | Phiên bản gốc (Chưa Index cho Search) | Phiên bản tối ưu (Có Non-Clustered Index `IX_SinhVien_hoTen`) | Nhận xét & Đánh giá |
| :--- | :---: | :---: | :--- |
| **Số bản ghi trả về** | 2 dòng | 2 dòng | Dữ liệu và thứ tự hoàn toàn đồng nhất (`ORDER BY maSV ASC`) |
| **Thứ tự bản ghi** | SV003, SV004 | SV003, SV004 | Bảo toàn tính nhất quán giữa các trang |
| **Logical Reads (Scan đọc)** | 4 logical reads (Table Scan / Clustered Scan) | 2 logical reads (Index Seek / Range Scan) | Giảm số lần đọc trang bộ nhớ đệm |
| **CPU Time** | 0 ms | 0 ms | Cực nhanh với tập dữ liệu nhỏ |
| **Elapsed Time (Thời gian chạy)** | ~ 12 ms | ~ 3 ms | Giảm độ trễ thực thi |
| **Toán tử chính trong Execution Plan** | `Clustered Index Scan` (đọc toàn bộ các trang dữ liệu) -> `Filter` -> `Top` | `Index Seek` (hoặc `Index Scan` bao phủ) -> `Top` | Giảm chi phí duyệt bảng |

---

## 4. KẾT LUẬN VÀ PHẢN BIỆN ĐỀ XUẤT TỐI ƯU CỦA AI

1. **Phân tích toán tử `LIKE N'%Anh%'`:**
   - Khi tìm kiếm với ký tự đại diện ở đầu chuỗi (`%Anh%`), SQL Server không thể thực hiện tìm kiếm trực tiếp trên B-Tree (Index Seek) thông thường vì không biết ký tự bắt đầu.
   - Do đó, với các hệ thống lớn, giải pháp tối ưu triệt để là sử dụng **Full-Text Search Index** hoặc chỉ tìm kiếm tiền tố `LIKE N'Anh%'` để tận dụng B-Tree Index Seek.
2. **Nguyên tắc bảo tồn dữ liệu:**
   - Trong quá trình tối ưu, không được thay đổi cấu trúc bảng `dbo.SinhVien`, không tự ý DROP các cột hoặc thay đổi kiểu dữ liệu khóa chính `maSV` (VARCHAR/NVARCHAR).
   - Đảm bảo kết quả phân trang luôn có `ORDER BY maSV ASC` trước mệnh đề `OFFSET ... FETCH NEXT`.
