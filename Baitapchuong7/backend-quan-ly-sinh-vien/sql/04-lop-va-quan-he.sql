-- ============================================================================
-- File: sql/04-lop-va-quan-he.sql
-- Mục đích: (Mở rộng Mục 20) Tạo bảng dbo.Lop và thiết lập khóa ngoại FK 1-N với dbo.SinhVien
-- Quy tắc:
--   - Tạo bản ghi Lop cho các maLop DISTINCT đang có trong SinhVien trước khi tạo FK.
--   - Không cascade delete để bảo toàn tính toàn vẹn dữ liệu.
--   - Cấp quyền SELECT trên dbo.Lop cho user sv_app.
-- ============================================================================

USE QuanLySinhVienDB;
GO

-- 1. Tạo bảng dbo.Lop nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.tables t 
    JOIN sys.schemas s ON t.schema_id = s.schema_id 
    WHERE t.name = N'Lop' AND s.name = N'dbo'
)
BEGIN
    CREATE TABLE dbo.Lop (
        maLop NVARCHAR(50) NOT NULL,
        tenLop NVARCHAR(150) NOT NULL,
        CONSTRAINT PK_Lop PRIMARY KEY (maLop)
    );
    PRINT N'Đã tạo bảng dbo.Lop với khóa chính maLop.';
END
ELSE
BEGIN
    PRINT N'Bảng dbo.Lop đã tồn tại sẵn, giữ nguyên.';
END
GO

-- 2. Đồng bộ các maLop đang có trong bảng SinhVien vào bảng Lop trước khi tạo FK
INSERT INTO dbo.Lop (maLop, tenLop)
SELECT DISTINCT sv.maLop, sv.maLop
FROM dbo.SinhVien sv
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Lop l WHERE l.maLop = sv.maLop
);
PRINT N'Đã đồng bộ các mã lớp hiện có từ bảng SinhVien sang bảng Lop.';
GO

-- 3. Tạo Foreign Key từ SinhVien.maLop -> Lop.maLop nếu chưa có
IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE name = N'FK_SinhVien_Lop'
)
BEGIN
    ALTER TABLE dbo.SinhVien
    ADD CONSTRAINT FK_SinhVien_Lop 
    FOREIGN KEY (maLop) REFERENCES dbo.Lop(maLop);
    PRINT N'Đã thêm khóa ngoại FK_SinhVien_Lop thành công.';
END
ELSE
BEGIN
    PRINT N'Khóa ngoại FK_SinhVien_Lop đã tồn tại sẵn.';
END
GO

-- 4. Cấp quyền SELECT trên dbo.Lop cho sv_app
GRANT SELECT ON dbo.Lop TO sv_app;
PRINT N'Đã cấp quyền SELECT trên dbo.Lop cho sv_app.';
GO

-- 5. Xem kiểm tra dữ liệu hai bảng
SELECT * FROM dbo.Lop;
SELECT maSV, hoTen, email, maLop FROM dbo.SinhVien;
GO
