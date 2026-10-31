import React, { useState } from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse, UserProfile } from '../types';

interface LoginProps {
  onLoginSuccess: (token: string, profile: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin.lab@example.com');
  const [password, setPassword] = useState('Admin@Secure2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Goi POST /api/auth/login
      const loginRes = await apiClient.post<ApiResponse<{ accessToken: string }>>(
        '/api/auth/login',
        { email, password }
      );

      const token = loginRes.data.data.accessToken;

      // 2. Goi GET /api/auth/profile voi Bearer token
      const profileRes = await apiClient.get<ApiResponse<UserProfile>>('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      onLoginSuccess(token, profileRes.data.data);
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || `Lỗi ${err.response.status}`);
      } else {
        setError('Không thể kết nối đến máy chủ Backend (Port 5000)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login-card">
      <h2>🔐 Đăng Nhập Hệ Thống</h2>
      <p className="subtitle">Thử nghiệm tài khoản Sinh viên hoặc Quản trị viên (Admin)</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email tài khoản:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nhap.email@example.com"
          />
        </div>

        <div className="form-group">
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Mật khẩu"
          />
        </div>

        <div className="quick-fill-buttons">
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setEmail('admin.lab@example.com');
              setPassword('Admin@Secure2026!');
            }}
          >
            👉 Chọn nhanh Admin
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setEmail('an.lab@example.com');
              setPassword('SinhVien@123');
            }}
          >
            👉 Chọn nhanh Student
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
};
