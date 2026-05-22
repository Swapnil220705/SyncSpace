import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { env } from '../config/env.js';

const avatarsDir = path.join(env.uploadDir, 'avatars');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
    const userId = req.auth?.userId ?? 'anon';
    cb(null, `${userId}-${Date.now()}${safeExt}`);
  },
});

const maxBytes = env.maxAvatarSizeMb * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: maxBytes },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WebP, or GIF images are allowed'));
    }
    cb(null, true);
  },
});

export const uploadAvatar = upload.single('avatar');
