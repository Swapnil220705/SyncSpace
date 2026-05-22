import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';
import { ApiError } from '../utils/apiError.js';

function sessionMeta(req: Request): { userAgent?: string; ipAddress?: string } {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body, sessionMeta(req));
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body, sessionMeta(req));
  res.json({ success: true, data: result });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  const result = await authService.refreshSession(refreshToken, sessionMeta(req));
  res.json({ success: true, data: result });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken?: string };
  if (refreshToken) {
    await authService.logoutUser(refreshToken);
  }
  res.json({ success: true, data: { message: 'Logged out' } });
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutAllSessions(req.auth!.userId);
  res.json({ success: true, data: { message: 'All sessions revoked' } });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserById(req.auth!.userId);
  res.json({ success: true, data: { user } });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.updateProfile(req.auth!.userId, req.body);
  res.json({ success: true, data: { user } });
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Avatar file is required');
  }
  const user = await authService.updateAvatar(req.auth!.userId, req.file.filename);
  res.json({ success: true, data: { user } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.requestPasswordReset(req.body.email);
  res.json({ success: true, data: result });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);
  res.json({ success: true, data: { message: 'Password reset successful' } });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.auth!.userId, req.body);
  res.json({ success: true, data: { message: 'Password updated' } });
});
