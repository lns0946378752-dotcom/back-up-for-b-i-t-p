-- ============================================================================
-- File: sql/05-cap-quyen-update-delete.sql
-- Mục đích: Cấp bổ sung quyền UPDATE và DELETE trên dbo.SinhVien cho sv_app
-- Bổ sung cho Buổi 5 (Chương 4) để thực hiện được các chức năng PUT và DELETE.
-- ============================================================================

USE QuanLySinhVienDB;
GO

GRANT UPDATE, DELETE ON dbo.SinhVien TO sv_app;
PRINT N'Đã cấp bổ sung quyền UPDATE và DELETE trên bảng dbo.SinhVien cho sv_app.';
GO

-- Kiểm tra lại toàn bộ quyền của sv_app
SELECT 
    pr.name AS TenUser,
    pe.permission_name AS Quyen,
    pe.state_desc AS TrangThai,
    OBJECT_NAME(pe.major_id) AS TenBang
FROM sys.database_permissions pe
JOIN sys.database_principals pr ON pe.grantee_principal_id = pr.principal_id
WHERE pr.name = 'sv_app';
GO
