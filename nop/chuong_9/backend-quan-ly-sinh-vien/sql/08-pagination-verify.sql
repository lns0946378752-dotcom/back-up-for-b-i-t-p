-- ============================================================================
-- CHƯƠNG 08: SCRIPT KIỂM CHỨNG PHÂN TRANG VÀ TÌM KIẾM TRÊN SQL SERVER
-- Mục đích: Kiểm tra dữ liệu thực tế, đối chiếu với API Sequelize findAndCountAll
-- Không dùng sync({force:true}), không xóa dữ liệu thật
-- ============================================================================

USE QuanLySinhVienDB;
GO

-- 1. Đếm tổng số sinh viên trong CSDL (tương ứng count của findAndCountAll khi không search)
SELECT COUNT(*) AS totalItems FROM dbo.SinhVien;
GO

-- 2. Xem toàn bộ danh sách sắp xếp tăng dần theo maSV (ORDER BY maSV ASC)
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV ASC;
GO

-- 3. Kiểm chứng Phân trang: Trang 1 (page=1, limit=2 => OFFSET 0 ROWS FETCH NEXT 2 ROWS ONLY)
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV ASC
OFFSET 0 ROWS
FETCH NEXT 2 ROWS ONLY;
GO

-- 4. Kiểm chứng Phân trang: Trang 2 (page=2, limit=2 => OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY)
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV ASC
OFFSET 2 ROWS
FETCH NEXT 2 ROWS ONLY;
GO

-- 5. Kiểm chứng Phân trang: Trang 3 (page=3, limit=2 => OFFSET 4 ROWS FETCH NEXT 2 ROWS ONLY)
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV ASC
OFFSET 4 ROWS
FETCH NEXT 2 ROWS ONLY;
GO

-- 6. Kiểm chứng Tìm kiếm theo họ tên (search='Anh')
SELECT COUNT(*) AS totalFilteredItems
FROM dbo.SinhVien
WHERE hoTen LIKE N'%Anh%';
GO

-- 7. Kiểm chứng Tìm kiếm kết hợp phân trang (search='Anh', page=1, limit=2)
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
WHERE hoTen LIKE N'%Anh%'
ORDER BY maSV ASC
OFFSET 0 ROWS
FETCH NEXT 2 ROWS ONLY;
GO

-- 8. Thống kê số lượng sinh viên theo từng lớp (Mở rộng Buổi 10)
SELECT maLop, COUNT(*) AS totalStudents
FROM dbo.SinhVien
GROUP BY maLop
ORDER BY maLop ASC;
GO
