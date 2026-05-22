import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import { extractBearerToken, verifyAccessToken, type JwtPayload } from '../utils/authHelpers.js';

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}
