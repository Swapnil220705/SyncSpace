import mongoose, { type Document, Schema, Types } from 'mongoose';
import type { WorkspaceRole } from './WorkspaceMember.js';

export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface IWorkspaceInvitation extends Document {
  workspaceId: Types.ObjectId;
  email: string;
  role: WorkspaceRole;
  token: string;
  invitedBy: Types.ObjectId;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IWorkspaceInvitation>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ['admin', 'member', 'guest'],
      default: 'member',
    },
    token: { type: String, required: true, unique: true, index: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'revoked', 'expired'],
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

invitationSchema.index({ workspaceId: 1, email: 1, status: 1 });

export const WorkspaceInvitation = mongoose.model<IWorkspaceInvitation>(
  'WorkspaceInvitation',
  invitationSchema,
);
