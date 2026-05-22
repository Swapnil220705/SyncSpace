import type { NextFunction, Request, Response } from 'express';
import { validationResult, type ValidationChain } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export function validate(chains: ValidationChain[]) {
  return [
    ...chains,
    (req: Request, _res: Response, next: NextFunction): void => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const message = errors
          .array()
          .map((e) => e.msg)
          .join(', ');
        return next(new ApiError(400, message));
      }
      next();
    },
  ];
}
