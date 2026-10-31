import request from 'supertest';
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import { User } from '../../src/models/User.js';

describe('API Tests: Xác thực & Bảo mật HTTP bằng Supertest (A01 - A07)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecretkey1234567890';
  });

  // A01: Login hợp lệ -> HTTP 200, Token được cấp
  test('A01 - POST /api/auth/login hợp lệ trả HTTP 200 và cấp Bearer Token', async () => {
    const mockUser = {
      id: 'usr-admin-1',
      email: 'admin@example.com',
      passwordHash: '$2b$12$samplehashedadminpassword',
      role: 'admin',
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'AdminPassword@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.tokenType).toBe('Bearer');
  });

  // A02: Sai mật khẩu -> HTTP 401, không có JWT
  test('A02 - POST /api/auth/login sai mật khẩu trả HTTP 401 và không có Token', async () => {
    const mockUser = {
      id: 'usr-student-2',
      email: 'student@example.com',
      passwordHash: '$2b$12$samplehashedpassword',
      role: 'student',
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser as any);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@example.com', password: 'WrongPassword@999' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(401);
    expect(res.body.data).toBeNull();
  });

  // A03: User không tồn tại -> HTTP 401, không có JWT
  test('A03 - POST /api/auth/login email không tồn tại trả HTTP 401', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'AnyPassword@123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(401);
    expect(res.body.data).toBeNull();
  });

  // A04: Thiếu trường bắt buộc -> HTTP 400 Validation
  test('A04 - POST /api/auth/login thiếu email hoặc password trả HTTP 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'onlyemail@example.com' }); // Thiếu password

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Dữ liệu đầu vào không hợp lệ');
  });

  // A05: GET Profile không có JWT -> HTTP 401 bị chặn bởi isAuth
  test('A05 - GET /api/auth/profile không gửi Authorization header trả HTTP 401', async () => {
    const res = await request(app).get('/api/auth/profile');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(401);
    expect(res.body.message).toMatch(/không tìm thấy token/i);
  });

  // A06: GET Profile có JWT hợp lệ -> HTTP 200 trả đúng dữ liệu
  test('A06 - GET /api/auth/profile có JWT hợp lệ trả HTTP 200 và thông tin cá nhân', async () => {
    const mockUser = {
      id: 'usr-student-01',
      fullName: 'Nguyễn Văn An',
      email: 'an.nguyen@example.com',
      role: 'student',
      avatarUrl: '/uploads/avatar-sample.png',
    };

    jest.spyOn(jwt, 'verify').mockReturnValue({
      sub: 'usr-student-01',
      role: 'student',
    } as any);
    jest.spyOn(User, 'findByPk').mockResolvedValue(mockUser as any);

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer valid.jwt.token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('usr-student-01');
    expect(res.body.data.fullName).toBe('Nguyễn Văn An');
    expect(res.body.data.email).toBe('an.nguyen@example.com');
  });

  // A07: Đường dẫn không tồn tại / 404 Fallback
  test('A07 - GET đường dẫn không tồn tại trả HTTP 404 JSON chuẩn hóa', async () => {
    const res = await request(app).get('/api/duong-dan-khong-ton-tai');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(404);
    expect(res.body.message).toBe('Không tìm thấy đường dẫn');
    expect(res.body.data).toBeNull();
  });
});
