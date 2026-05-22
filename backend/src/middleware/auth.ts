import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import {
  extractBearerToken,
  verifyAccessToken,
  type JwtPayload,
} from '../utils/authHelpers.js';
import type { UserRole } from '../models/User.js';

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

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return next(new ApiError(403, 'Insufficient permissions'));
    }

    next();
  };
}
