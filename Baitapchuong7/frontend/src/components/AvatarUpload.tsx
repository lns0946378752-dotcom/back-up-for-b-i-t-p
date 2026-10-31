import React, { useState } from 'react';
import { apiClient, API_BASE_URL } from '../api/client';
import type { ApiResponse } from '../types';

interface AvatarUploadProps {
  token: string;
  currentAvatarUrl?: string | null;
  onUploadSuccess: (newAvatarUrl: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  token,
  currentAvatarUrl,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const file = e.target.files[0];

    // Kiểm tra kích thước ở phía Client (tối đa 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'Dung lượng ảnh vượt quá 2MB. Vui lòng chọn ảnh nhỏ hơn.',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Kiểm tra loại file định dạng hình ảnh
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setMessage({
        type: 'error',
        text: 'Chỉ chấp nhận file ảnh định dạng PNG hoặc JPEG/JPG.',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Vui lòng chọn một tệp ảnh trước khi tải lên.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await apiClient.post<ApiResponse<{ avatarUrl: string }>>(
        '/api/auth/me/avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Trình duyệt tự thiết lập Content-Type kèm boundary
          },
        }
      );

      setMessage({ type: 'success', text: 'Tải lên ảnh đại diện thành công!' });
      onUploadSuccess(res.data.data.avatarUrl);
      setSelectedFile(null);
    } catch (err: any) {
      if (err.response) {
        setMessage({
          type: 'error',
          text: err.response.data?.message || `Lỗi tải lên: ${err.response.status}`,
        });
      } else {
        setMessage({ type: 'error', text: 'Lỗi mạng khi tải lên ảnh đại diện.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = previewUrl || (currentAvatarUrl ? `${API_BASE_URL}${currentAvatarUrl}` : null);

  return (
    <div className="card avatar-card">
      <h3>📷 Cập Nhật Ảnh Đại Diện (Avatar)</h3>
      <p className="subtitle">Hỗ trợ định dạng PNG, JPG, JPEG (Tối đa 2MB)</p>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="avatar-preview-container">
        {displayAvatar ? (
          <img src={displayAvatar} alt="Avatar" className="avatar-image" />
        ) : (
          <div className="avatar-placeholder">Chưa có Avatar</div>
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id="avatarInput"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="avatarInput" className="btn btn-secondary">
          Chọn file ảnh...
        </label>
        {selectedFile && <span className="file-name">{selectedFile.name}</span>}

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? 'Đang tải lên...' : 'Bấm Tải Lên'}
        </button>
      </div>
    </div>
  );
};
