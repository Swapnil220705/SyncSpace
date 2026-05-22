import mongoose, { type Document, Schema, Types } from 'mongoose';

export type ActivityType =
  | 'workspace.created'
  | 'workspace.updated'
  | 'member.invited'
  | 'member.joined'
  | 'member.removed'
  | 'member.role_changed'
  | 'project.created'
  | 'project.updated'
  | 'project.deleted';

export interface IActivity extends Document {
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  type: ActivityType;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

activitySchema.index({ workspaceId: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
