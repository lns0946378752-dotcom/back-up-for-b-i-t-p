import { useState } from 'react';
import './App.css';
import { Login } from './components/Login';
import { AvatarUpload } from './components/AvatarUpload';
import { SinhVienTable } from './components/SinhVienTable';
import type { UserProfile } from './types';
import { API_BASE_URL } from './api/client';

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLoginSuccess = (newToken: string, profile: UserProfile) => {
    setToken(newToken);
    setUser(profile);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  const handleAvatarUpdate = (newUrl: string) => {
    if (user) {
      setUser({ ...user, avatarUrl: newUrl });
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎓 Hệ Thống Quản Lý Sinh Viên</h1>
          <p className="header-subtitle">
            Chương 07: Upload Hình Ảnh (Multer) & Kết Nối Frontend (Vite React) - Backend (Express JWT)
          </p>
        </div>

        {user && (
          <div className="user-badge">
            <div className="user-avatar-mini">
              {user.avatarUrl ? (
                <img src={`${API_BASE_URL}${user.avatarUrl}`} alt="Avatar" />
              ) : (
                <span>{user.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="user-info">
              <strong>{user.fullName}</strong>
              <span className={`role-pill role-${user.role}`}>
                {user.role === 'admin' ? '🛡️ Quản trị viên (Admin)' : '👤 Sinh viên (Student)'}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Đăng xuất
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!token || !user ? (
          <div className="grid-center">
            <Login onLoginSuccess={handleLoginSuccess} />
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="left-panel">
              <AvatarUpload
                token={token}
                currentAvatarUrl={user.avatarUrl}
                onUploadSuccess={handleAvatarUpdate}
              />
            </div>
            <div className="right-panel">
              <SinhVienTable currentUser={user} token={token} />
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>BÀI THỰC HÀNH CHƯƠNG 07 · KẾT NỐI API THỰC TẾ & BẢO VỆ PHÂN QUYỀN RBAC</p>
      </footer>
    </div>
  );
}

export default App;
