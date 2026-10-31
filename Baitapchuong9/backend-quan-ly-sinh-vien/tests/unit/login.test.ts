import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../src/models/User.js';
import { AuthService } from '../../src/services/auth.service.js';
import { AppError } from '../../src/utils/AppError.js';
import { loginSchema } from '../../src/validations/auth.schema.js';

describe('Unit Tests: Logic Đăng nhập AuthService (T01 - T05)', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecretkey1234567890';
    authService = new AuthService();
  });

  // T01: Tài khoản có, mật khẩu đúng
  test('T01 - Đăng nhập thành công khi email tồn tại và mật khẩu đúng', async () => {
    // Arrange: Mock User.findOne trả về user giả lập, bcrypt.compare trả về true
    const mockUser = {
      id: 'usr-001',
      email: 'student@example.com',
      passwordHash: '$2b$12$hashedpasswordexample',
      role: 'student',
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue('mocked.jwt.token' as any);

    // Act
    const result = await authService.login({
      email: 'student@example.com',
      password: 'CorrectPassword@123',
    });

    // Assert
    expect(result).toBeDefined();
    expect(result.accessToken).toBe('mocked.jwt.token');
    expect(result.tokenType).toBe('Bearer');
    expect(result.expiresIn).toBe(3600);
    expect(signSpy).toHaveBeenCalledTimes(1);
  });

  // T02: Tài khoản có, mật khẩu sai
  test('T02 - Từ chối và ném AppError(401) khi nhập sai mật khẩu, không cấp JWT', async () => {
    // Arrange: User tồn tại nhưng bcrypt.compare trả về false
    const mockUser = {
      id: 'usr-002',
      email: 'student@example.com',
      passwordHash: '$2b$12$hashedpasswordexample',
      role: 'student',
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
    const signSpy = jest.spyOn(jwt, 'sign');

    // Act & Assert
    await expect(
      authService.login({
        email: 'student@example.com',
        password: 'WrongPassword@999',
      })
    ).rejects.toThrow(AppError);

    await expect(
      authService.login({
        email: 'student@example.com',
        password: 'WrongPassword@999',
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Email hoặc mật khẩu không chính xác',
    });

    // Bắt buộc: không được gọi hàm sinh Token
    expect(signSpy).not.toHaveBeenCalled();
  });

  // T03: Tài khoản không tồn tại
  test('T03 - Từ chối và ném AppError(401) khi email không tồn tại trong hệ thống', async () => {
    // Arrange: User.findOne trả về null
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const signSpy = jest.spyOn(jwt, 'sign');

    // Act & Assert
    await expect(
      authService.login({
        email: 'nonexistent@example.com',
        password: 'Password@123',
      })
    ).rejects.toThrow(AppError);

    await expect(
      authService.login({
        email: 'nonexistent@example.com',
        password: 'Password@123',
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Email hoặc mật khẩu không chính xác',
    });

    expect(signSpy).not.toHaveBeenCalled();
  });

  // T04: Kiểm tra định dạng đầu vào không hợp lệ
  test('T04 - Kiểm tra Zod schema loginSchema từ chối khi thiếu trường hoặc sai email', () => {
    // Thiếu password
    const result1 = loginSchema.safeParse({ email: 'valid@example.com' });
    expect(result1.success).toBe(false);

    // Email sai định dạng
    const result2 = loginSchema.safeParse({ email: 'not-an-email', password: '123' });
    expect(result2.success).toBe(false);
  });

  // T05: Lỗi Database trong quá trình truy vấn được ném ra ngoài an toàn
  test('T05 - Lỗi Database (SQL Server timeout/disconnect) được truyền lên an toàn', async () => {
    // Arrange: User.findOne ném lỗi Database Error
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Connection timeout SQL Server'));
    const signSpy = jest.spyOn(jwt, 'sign');

    // Act & Assert
    await expect(
      authService.login({
        email: 'student@example.com',
        password: 'Password@123',
      })
    ).rejects.toThrow('Connection timeout SQL Server');

    // Không lộ Token khi gặp sự cố CSDL
    expect(signSpy).not.toHaveBeenCalled();
  });
});
