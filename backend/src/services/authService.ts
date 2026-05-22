import { ApiError } from '../utils/apiError.js';
import { signAccessToken } from '../utils/authHelpers.js';
import { User, type IUser } from '../models/User.js';

export interface AuthTokensResponse {
  user: PublicUser;
  token: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

function toPublicUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthTokensResponse> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create(input);
  const token = signAccessToken({ userId: user._id.toString(), email: user.email });

  return { user: toPublicUser(user), token };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthTokensResponse> {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const valid = await user.comparePassword(input.password);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signAccessToken({ userId: user._id.toString(), email: user.email });
  return { user: toPublicUser(user), token };
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return toPublicUser(user);
}
