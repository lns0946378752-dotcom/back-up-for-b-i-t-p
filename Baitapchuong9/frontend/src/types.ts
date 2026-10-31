export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  avatarUrl?: string | null;
}

export interface SinhVienItem {
  maSV: string;
  hoTen: string;
  email: string;
  maLop: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
