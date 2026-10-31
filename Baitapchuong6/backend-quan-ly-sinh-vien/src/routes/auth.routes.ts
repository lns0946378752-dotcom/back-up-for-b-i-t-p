import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.schema.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();

// 1. Dang ky tai khoan (Public, mac dinh role=student, bcrypt hash)
router.post('/register', validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

// 2. Dang nhap (Public, tra accessToken)
router.post('/login', validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

// 3. Xem ho so tai khoan dang dang nhap (Yeu cau isAuth)
router.get('/profile', isAuth, (req, res, next) => {
  authController.getProfile(req, res, next);
});

export default router;
