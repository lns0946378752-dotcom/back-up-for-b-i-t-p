-- ============================================================================
-- File: sql/03-app-login.sql
-- Mục đích: Tạo SQL Server Login và Database User cho ứng dụng backend (sv_app)
-- Phân quyền: Chỉ cấp SELECT và INSERT trên dbo.SinhVien (Nguyên tắc đặc quyền tối thiểu).
-- Chú ý:
--   - Chạy script này bằng tài khoản SA hoặc tài khoản quản trị có quyền CREATE LOGIN.
--   - Mật khẩu mẫu bên dưới: App@Secure2026! (Bạn có thể đổi mật khẩu theo máy local của bạn).
-- ============================================================================

-- 1. Tạo Login sv_app ở cấp độ Server (Instance)
USE master;
GO

IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'sv_app')
BEGIN
    -- Tạo login sv_app với mật khẩu mạnh
    CREATE LOGIN sv_app WITH PASSWORD = N'App@Secure2026!', CHECK_POLICY = OFF;
    PRINT N'Đã tạo mới Login sv_app ở server.';
END
ELSE
BEGIN
    PRINT N'Login sv_app đã tồn tại trên server, giữ nguyên.';
END
GO

-- 2. Tạo User sv_app trong Database QuanLySinhVienDB và cấp quyền
USE QuanLySinhVienDB;
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'sv_app')
BEGIN
    CREATE USER sv_app FOR LOGIN sv_app;
    PRINT N'Đã tạo mới User sv_app trong QuanLySinhVienDB.';
END
ELSE
BEGIN
    PRINT N'User sv_app đã tồn tại trong QuanLySinhVienDB, giữ nguyên.';
END
GO

-- 3. Cấp quyền tối thiểu: chỉ SELECT và INSERT trên dbo.SinhVien
-- Không cấp quyền sysadmin, db_owner hay UPDATE/DELETE.
GRANT SELECT, INSERT ON dbo.SinhVien TO sv_app;
PRINT N'Đã cấp quyền SELECT và INSERT trên bảng dbo.SinhVien cho sv_app.';
GO

-- 4. Kiểm tra quyền của sv_app vừa được cấp
SELECT 
    pr.name AS TenUser,
    pe.permission_name AS Quyen,
    pe.state_desc AS TrangThai,
    OBJECT_NAME(pe.major_id) AS TenBang
FROM sys.database_permissions pe
JOIN sys.database_principals pr ON pe.grantee_principal_id = pr.principal_id
WHERE pr.name = 'sv_app';
GO
