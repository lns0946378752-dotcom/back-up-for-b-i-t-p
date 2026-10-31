import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

const uploadDir = path.resolve('public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Giới hạn tối đa 2MB = 2 * 1024 * 1024 = 2.097.152 bytes
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Cấu hình lưu trữ tệp trên đĩa với tên sinh ngẫu nhiên UUID
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

// Bộ lọc file chỉ chấp nhận image/jpeg và image/png
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png'];

  if (!allowedMimes.includes(file.mimetype) || !allowedExts.includes(ext)) {
    return cb(
      new AppError(
        400,
        'Định dạng file không hợp lệ. Chỉ chấp nhận ảnh định dạng JPEG hoặc PNG'
      )
    );
  }

  cb(null, true);
};

export const uploadAvatarMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Middleware bọc multer để xử lý lỗi Multer (413 Payload Too Large, 400 Bad Request)
 * và kiểm tra Magic Bytes (chữ ký số thực sự của file JPEG/PNG)
 */
export const handleUploadAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const uploadSingle = uploadAvatarMiddleware.single('avatar');

  uploadSingle(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'Dung lượng file vượt quá giới hạn tối đa 2MB',
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Field name không hợp lệ. Vui lòng gửi file với key là "avatar"',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'Lỗi trong quá trình upload file',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn một file ảnh để tải lên (key: avatar)',
      });
    }

    // Kiểm tra magic numbers (chữ ký nội dung nhị phân thực của ảnh)
    try {
      const buffer = fs.readFileSync(req.file.path);
      const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
      const isPng =
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a;

      if (!isJpeg && !isPng) {
        // Dọn file rác giả mạo
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Tệp tải lên không phải là ảnh JPEG/PNG thực sự (nội dung bị giả mạo)',
        });
      }
    } catch {
      // Bỏ qua nếu lỗi đọc buffer
    }

    next();
  });
};
