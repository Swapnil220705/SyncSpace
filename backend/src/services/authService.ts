import path from 'path';
import { ApiError } from '../utils/apiError.js';
import {
  generateSecureToken,
  getPasswordResetExpiry,
  getRefreshTokenExpiry,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/authHelpers.js';
import { User, type IUser, type UserRole } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { sendPasswordResetEmail } from './emailService.js';
import { env } from '../config/env.js';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface AuthTokensResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

export interface SessionMeta {
  userAgent?: string;
  ipAddress?: string;
}

function toPublicUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

async function issueTokenPair(
  user: IUser,
  meta: SessionMeta = {},
): Promise<AuthTokensResponse> {
  const jti = generateSecureToken(16);
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken({ userId: user._id.toString(), jti });

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpiry(),
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken,
  };
}

export async function registerUser(
  input: { name: string; email: string; password: string },
  meta?: SessionMeta,
): Promise<AuthTokensResponse> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ ...input, role: 'user' });
  return issueTokenPair(user, meta);
}

export async function loginUser(
  input: { email: string; password: string },
  meta?: SessionMeta,
): Promise<AuthTokensResponse> {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await user.comparePassword(input.password);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return issueTokenPair(user, meta);
}

export async function refreshSession(
  refreshToken: string,
  meta?: SessionMeta,
): Promise<AuthTokensResponse> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({ tokenHash, userId: payload.userId });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  stored.revokedAt = new Date();
  await stored.save();

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  const result = await issueTokenPair(user, meta);
  stored.replacedByToken = hashToken(result.refreshToken);
  await stored.save();

  return result;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export async function logoutAllSessions(userId: string): Promise<void> {
  await RefreshToken.updateMany(
    { userId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  input: { name?: string; email?: string },
): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (input.email && input.email !== user.email) {
    const taken = await User.findOne({ email: input.email });
    if (taken) {
      throw new ApiError(409, 'Email already in use');
    }
    user.email = input.email;
  }

  if (input.name) {
    user.name = input.name;
  }

  await user.save();
  return toPublicUser(user);
}

export async function updateAvatar(userId: string, filename: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const avatarUrl = `/uploads/avatars/${filename}`;
  user.avatarUrl = avatarUrl;
  await user.save();
  return toPublicUser(user);
}

export async function requestPasswordReset(email: string): Promise<{ message: string; resetUrl?: string }> {
  const user = await User.findOne({ email }).select('+passwordResetToken +passwordResetExpires');
  const message = 'If an account exists for that email, a reset link has been sent.';

  if (!user) {
    return { message };
  }

  const rawToken = generateSecureToken(32);
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = getPasswordResetExpiry();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.appUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
  await sendPasswordResetEmail(email, resetUrl);

  if (!env.isProduction || env.exposeResetTokenInDev) {
    return { message, resetUrl };
  }

  return { message };
}

export async function resetPassword(input: {
  email: string;
  token: string;
  password: string;
}): Promise<void> {
  const user = await User.findOne({ email: input.email }).select(
    '+password +passwordResetToken +passwordResetExpires',
  );

  if (!user?.passwordResetToken || !user.passwordResetExpires) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  if (user.passwordResetExpires < new Date()) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  const tokenHash = hashToken(input.token);
  if (user.passwordResetToken !== tokenHash) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = input.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await logoutAllSessions(user._id.toString());
}

export async function changePassword(
  userId: string,
  input: { currentPassword: string; newPassword: string },
): Promise<void> {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const valid = await user.comparePassword(input.currentPassword);
  if (!valid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = input.newPassword;
  await user.save();
  await logoutAllSessions(userId);
}
