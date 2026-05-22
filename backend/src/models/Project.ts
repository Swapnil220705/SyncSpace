import mongoose, { type Document, Schema, Types } from 'mongoose';

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';

export interface IProject extends Document {
  workspaceId: Types.ObjectId;
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  progress: number;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['planning', 'active', 'paused', 'completed', 'archived'],
      default: 'planning',
    },
    color: { type: String, default: '#6366f1' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
