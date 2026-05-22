import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: requireEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/syncspace'),
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
  jwtAccessSecret: requireEnv('JWT_ACCESS_SECRET', process.env.JWT_SECRET ?? 'dev-access-secret'),
  jwtRefreshSecret: requireEnv(
    'JWT_REFRESH_SECRET',
    process.env.JWT_SECRET ?? 'dev-refresh-secret-change-me',
  ),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  passwordResetExpiresIn: process.env.PASSWORD_RESET_EXPIRES_IN ?? '1h',
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
  uploadDir: path.resolve(process.env.UPLOAD_DIR ?? path.join(__dirname, '../../uploads')),
  maxAvatarSizeMb: Number(process.env.MAX_AVATAR_SIZE_MB ?? 2),
  isProduction: process.env.NODE_ENV === 'production',
  exposeResetTokenInDev: process.env.EXPOSE_RESET_TOKEN_IN_DEV === 'true',
} as const;
