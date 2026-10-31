-- ============================================================================
-- File: sql/01-quan-ly-sinh-vien.sql
-- Mục đích: Khởi tạo Database QuanLySinhVienDB và bảng dbo.SinhVien
-- Quy tắc: Không DROP dữ liệu, dùng GO phân tách batch của SSMS/sqlcmd.
-- ============================================================================

-- 1. Tạo Database nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'QuanLySinhVienDB')
BEGIN
    CREATE DATABASE QuanLySinhVienDB;
    PRINT N'Đã tạo mới Database QuanLySinhVienDB thành công.';
END
ELSE
BEGIN
    PRINT N'Database QuanLySinhVienDB đã tồn tại sẵn, giữ nguyên.';
END
GO

-- 2. Chuyển ngữ cảnh sang QuanLySinhVienDB
USE QuanLySinhVienDB;
GO

-- 3. Tạo bảng dbo.SinhVien nếu chưa tồn tại
-- Ràng buộc:
--   - maSV: VARCHAR(5) PRIMARY KEY NOT NULL (Khóa chính dạng chuỗi, không tự tăng)
--   - hoTen: NVARCHAR(150) NOT NULL (Lưu tên tiếng Việt Unicode)
--   - email: NVARCHAR(254) NOT NULL (Độ dài chuẩn email RFC)
--   - maLop: NVARCHAR(50) NOT NULL
-- Không thêm cột id số, không thêm timestamps, không đặt UNIQUE email.
IF NOT EXISTS (
    SELECT 1 
    FROM sys.tables t 
    JOIN sys.schemas s ON t.schema_id = s.schema_id 
    WHERE t.name = N'SinhVien' AND s.name = N'dbo'
)
BEGIN
    CREATE TABLE dbo.SinhVien (
        maSV VARCHAR(5) NOT NULL,
        hoTen NVARCHAR(150) NOT NULL,
        email NVARCHAR(254) NOT NULL,
        maLop NVARCHAR(50) NOT NULL,
        CONSTRAINT PK_SinhVien PRIMARY KEY (maSV)
    );
    PRINT N'Đã tạo mới bảng dbo.SinhVien với khóa chính maSV.';
END
ELSE
BEGIN
    PRINT N'Bảng dbo.SinhVien đã tồn tại sẵn, giữ nguyên schema.';
END
GO
