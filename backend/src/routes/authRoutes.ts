import { Router, type NextFunction, type Request, type Response } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { ApiError } from '../utils/apiError.js';
import {
  changePasswordValidation,
  forgotPasswordValidation,
  loginValidation,
  refreshValidation,
  registerValidation,
  resetPasswordValidation,
  updateProfileValidation,
} from '../utils/validators.js';

const router = Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh', validate(refreshValidation), authController.refresh);
router.post('/logout', authController.logout);
router.post('/forgot-password', validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), authController.resetPassword);

router.get('/me', authenticate, authController.me);
router.patch('/profile', authenticate, validate(updateProfileValidation), authController.updateProfile);
function handleAvatarUpload(req: Request, res: Response, next: NextFunction): void {
  uploadAvatar(req, res, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      return next(new ApiError(400, message));
    }
    next();
  });
}

router.post('/avatar', authenticate, handleAvatarUpload, authController.uploadAvatar);
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordValidation),
  authController.changePassword,
);
router.post('/logout-all', authenticate, authController.logoutAll);

router.get(
  '/admin/ping',
  authenticate,
  authorize('admin', 'owner'),
  (_req, res) => {
    res.json({ success: true, data: { message: 'Admin access granted' } });
  },
);

export default router;
