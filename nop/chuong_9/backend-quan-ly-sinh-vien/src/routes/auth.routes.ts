import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.schema.js';
import { isAuth } from '../middlewares/isAuth.js';
import { handleUploadAvatar } from '../middlewares/upload.middleware.js';
import { loginLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

// 1. Dang ky tai khoan (Public, mac dinh role=student, bcrypt hash)
router.post('/register', validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

// 2. Dang nhap (Co Rate Limit 5 req/phut, validate, tra accessToken)
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  (req, res, next) => {
    authController.login(req, res, next);
  }
);

// 3. Xem ho so tai khoan dang dang nhap (Yeu cau isAuth)
router.get('/profile', isAuth, (req, res, next) => {
  authController.getProfile(req, res, next);
});

// 4. Upload anh dai dien cho User dang dang nhap (Yeu cau isAuth -> handleUploadAvatar)
router.post('/me/avatar', isAuth, handleUploadAvatar, (req, res, next) => {
  authController.uploadAvatar(req, res, next);
});

export default router;
