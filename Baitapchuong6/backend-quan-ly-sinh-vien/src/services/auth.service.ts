import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/jwt.js';
import { RegisterInput, LoginInput } from '../validations/auth.schema.js';

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await User.findOne({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) {
      throw new AppError(409, 'Email này đã được sử dụng');
    }

    // Hash password cost 12 theo đúng yêu cầu đề bài
    const passwordHash = await bcrypt.hash(data.password, 12);

    const newUser = await User.create({
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: 'student', // Bắt buộc mặc định student, không cho phép gán role từ client
    });

    return {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async login(data: LoginInput) {
    const user = await User.findOne({ where: { email: data.email.toLowerCase().trim() } });
    if (!user) {
      // Thông báo chung để không lộ thông tin email có tồn tại hay không
      throw new AppError(401, 'Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, 'Email hoặc mật khẩu không chính xác');
    }

    const accessToken = generateToken({ id: user.id, role: user.role });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }

  async getProfile(userId: string | number) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError(404, 'Không tìm thấy thông tin tài khoản');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}

export const authService = new AuthService();
