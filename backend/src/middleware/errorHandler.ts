import type { NextFunction, Request, Response } from 'express';
import { ApiError, isApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (isApiError(err)) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Error && err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof Error && (err as { code?: string }).code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ success: false, message: 'File too large' });
    return;
  }

  console.error('[error]', err);
  res.status(500).json({
    success: false,
    message: env.isProduction ? 'Internal server error' : (err as Error)?.message ?? 'Unknown error',
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Route not found' });
}
