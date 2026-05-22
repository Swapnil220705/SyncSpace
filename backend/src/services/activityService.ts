import { Activity, type ActivityType } from '../models/Activity.js';
import type { Types } from 'mongoose';

export async function logActivity(input: {
  workspaceId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await Activity.create({
    workspaceId: input.workspaceId,
    userId: input.userId,
    type: input.type,
    message: input.message,
    metadata: input.metadata,
  });
}

export async function getWorkspaceActivities(
  workspaceId: string,
  limit = 30,
): Promise<
  Array<{
    id: string;
    type: ActivityType;
    message: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    user: { id: string; name: string; email: string; avatarUrl?: string };
  }>
> {
  const activities = await Activity.find({ workspaceId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email avatarUrl');

  return activities.map((a) => {
    const user = a.userId as unknown as {
      _id: { toString(): string };
      name: string;
      email: string;
      avatarUrl?: string;
    };
    return {
      id: a._id.toString(),
      type: a.type,
      message: a.message,
      metadata: a.metadata as Record<string, unknown> | undefined,
      createdAt: a.createdAt,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };
  });
}
