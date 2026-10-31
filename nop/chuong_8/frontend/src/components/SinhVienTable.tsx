import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { ApiResponse, SinhVienItem, UserProfile } from '../types';

interface SinhVienTableProps {
  currentUser: UserProfile | null;
  token: string | null;
}

export const SinhVienTable: React.FC<SinhVienTableProps> = ({ currentUser, token }) => {
  const [list, setList] = useState<SinhVienItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const fetchSinhVien = async () => {
    setLoading(true);
    setError(null);
    try {
      // API Public theo quy dinh
      const res = await apiClient.get<ApiResponse<SinhVienItem[]>>('/api/v1/sinh-vien');
      setList(res.data.data || []);
    } catch (err: any) {
      if (err.response) {
        setError(`Lỗi máy chủ (${err.response.status}): ${err.response.data?.message || 'Không thể tải danh sách'}`);
      } else {
        setError('Không thể kết nối máy chủ Backend. Vui lòng kiểm tra cổng 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinhVien();
  }, []);

  const handleDelete = async (maSV: string) => {
    if (!currentUser || currentUser.role !== 'admin' || !token) {
      setActionMsg({
        type: 'error',
        text: 'Thao tác bị từ chối: Chỉ quản trị viên (Admin) mới có quyền xóa sinh viên.',
      });
      return;
    }

    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa sinh viên mã [${maSV}] không?`);
    if (!confirmDelete) return;

    try {
      const res = await apiClient.delete<ApiResponse<any>>(`/api/v1/sinh-vien/${maSV}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActionMsg({ type: 'success', text: res.data.message || `Đã xóa thành công ${maSV}` });
      fetchSinhVien(); // Tự động làm mới danh sách sau khi xóa
    } catch (err: any) {
      if (err.response) {
        setActionMsg({
          type: 'error',
          text: err.response.data?.message || `Xóa thất bại: Mã ${err.response.status}`,
        });
      } else {
        setActionMsg({ type: 'error', text: 'Lỗi mạng khi thực hiện xóa sinh viên.' });
      }
    }
  };

  return (
    <div className="card table-card">
      <div className="table-header">
        <h3>📋 Danh Sách Sinh Viên (Dữ Liệu Thật Từ SQL Server)</h3>
        <button onClick={fetchSinhVien} className="btn btn-secondary" disabled={loading}>
          {loading ? 'Đang tải...' : '🔄 Làm mới danh sách'}
        </button>
      </div>

      {actionMsg && <div className={`alert alert-${actionMsg.type}`}>{actionMsg.text}</div>}
      {error && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button onClick={fetchSinhVien} className="btn btn-secondary btn-sm">
            Thử lại
          </button>
        </div>
      )}

      {loading && <div className="loading-state">⏳ Đang tải dữ liệu từ API /api/v1/sinh-vien...</div>}

      {!loading && !error && list.length === 0 && (
        <div className="empty-state">Hiện chưa có sinh viên nào trong cơ sở dữ liệu.</div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Mã Lớp</th>
                {currentUser?.role === 'admin' && <th>Thao Tác (Admin)</th>}
              </tr>
            </thead>
            <tbody>
              {list.map((sv) => (
                <tr key={sv.maSV}>
                  <td><strong>{sv.maSV}</strong></td>
                  <td>{sv.hoTen}</td>
                  <td>{sv.email}</td>
                  <td><span className="badge">{sv.maLop}</span></td>
                  {currentUser?.role === 'admin' && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(sv.maSV)}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
