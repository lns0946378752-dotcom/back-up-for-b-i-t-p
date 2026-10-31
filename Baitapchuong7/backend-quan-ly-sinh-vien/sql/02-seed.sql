-- ============================================================================
-- File: sql/02-seed.sql
-- Mục đích: Nạp dữ liệu mẫu ban đầu cho dbo.SinhVien
-- Quy tắc:
--   - Dùng tiền tố N'...' cho chuỗi Unicode tiếng Việt.
--   - Chỉ INSERT mã sinh viên chưa tồn tại, an toàn khi chạy lặp lại.
--   - Không UPDATE ghi đè dữ liệu đã thay đổi.
--   - Có SELECT cuối file ORDER BY maSV.
-- ============================================================================

USE QuanLySinhVienDB;
GO

-- Nạp sinh viên 1: SV001
IF NOT EXISTS (SELECT 1 FROM dbo.SinhVien WHERE maSV = 'SV001')
BEGIN
    INSERT INTO dbo.SinhVien (maSV, hoTen, email, maLop)
    VALUES ('SV001', N'Minh Nhật', N'minhnhat@example.com', N'25CT114');
    PRINT N'Đã thêm bản ghi mẫu SV001.';
END
ELSE
BEGIN
    PRINT N'Bản ghi SV001 đã tồn tại, không ghi đè.';
END
GO

-- Nạp sinh viên 2: SV002
IF NOT EXISTS (SELECT 1 FROM dbo.SinhVien WHERE maSV = 'SV002')
BEGIN
    INSERT INTO dbo.SinhVien (maSV, hoTen, email, maLop)
    VALUES ('SV002', N'Lan Anh', N'lananh@example.com', N'25CT114');
    PRINT N'Đã thêm bản ghi mẫu SV002.';
END
ELSE
BEGIN
    PRINT N'Bản ghi SV002 đã tồn tại, không ghi đè.';
END
GO

-- Truy vấn kiểm tra dữ liệu sau khi nạp
SELECT maSV, hoTen, email, maLop
FROM dbo.SinhVien
ORDER BY maSV ASC;
GO
