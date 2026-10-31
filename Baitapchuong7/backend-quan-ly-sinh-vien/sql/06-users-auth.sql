USE QuanLySinhVienDB;
GO

-- 1. Tao bang Users neu chua co
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fullName NVARCHAR(150) NOT NULL,
        email NVARCHAR(254) NOT NULL CONSTRAINT UQ_Users_Email UNIQUE,
        passwordHash NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL CONSTRAINT DF_Users_Role DEFAULT 'student'
    );
    PRINT N'Da tao bang dbo.Users thanh cong.';
END
ELSE
BEGIN
    PRINT N'Bang dbo.Users da ton tai.';
END
GO

-- 2. Cap quyen SELECT, INSERT, UPDATE, DELETE tren bang Users cho sv_app
GRANT SELECT, INSERT, UPDATE, DELETE ON dbo.Users TO sv_app;
GO
PRINT N'Da cap quyen SELECT, INSERT, UPDATE, DELETE tren dbo.Users cho sv_app.';
GO
