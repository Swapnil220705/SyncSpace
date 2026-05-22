import dotenv from 'dotenv';

dotenv.config();

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
  jwtSecret: requireEnv('JWT_SECRET', 'dev-secret-change-in-production'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((o) => o.trim()),
  isProduction: process.env.NODE_ENV === 'production',
} as const;
