USE QuanLySinhVienDB;
GO

-- 1. Kiem tra bang dbo.Users
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    THROW 50001, N'Chua co bang dbo.Users!', 1;
END
GO

-- 2. Bo sung cot avatarUrl neu chua co
IF COL_LENGTH('dbo.Users', 'avatarUrl') IS NULL
BEGIN
    ALTER TABLE dbo.Users
    ADD avatarUrl NVARCHAR(255) NULL;
    PRINT N'Da them cot avatarUrl vao dbo.Users thanh cong.';
END
ELSE
BEGIN
    PRINT N'Cot avatarUrl da ton tai trong dbo.Users.';
END
GO

-- 3. Kiem tra lai cau truc
SELECT TOP 5 id, fullName, email, role, avatarUrl FROM dbo.Users;
GO
