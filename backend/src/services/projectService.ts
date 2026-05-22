import { ApiError } from '../utils/apiError.js';
import { Project, type ProjectStatus } from '../models/Project.js';
import { logActivity } from './activityService.js';
import { User } from '../models/User.js';

export interface ProjectDto {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  color: string;
  progress: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

function toDto(p: InstanceType<typeof Project>): ProjectDto {
  return {
    id: p._id.toString(),
    workspaceId: p.workspaceId.toString(),
    name: p.name,
    description: p.description,
    status: p.status,
    color: p.color,
    progress: p.progress,
    createdBy: p.createdBy.toString(),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function listProjects(workspaceId: string): Promise<ProjectDto[]> {
  const projects = await Project.find({ workspaceId }).sort({ updatedAt: -1 });
  return projects.map(toDto);
}

export async function createProject(
  workspaceId: string,
  userId: string,
  input: {
    name: string;
    description?: string;
    status?: ProjectStatus;
    color?: string;
  },
): Promise<ProjectDto> {
  const project = await Project.create({
    workspaceId,
    name: input.name,
    description: input.description,
    status: input.status ?? 'planning',
    color: input.color ?? '#6366f1',
    createdBy: userId,
  });

  const user = await User.findById(userId);
  await logActivity({
    workspaceId,
    userId,
    type: 'project.created',
    message: `created project "${project.name}"`,
    metadata: { projectId: project._id.toString(), actorName: user?.name },
  });

  return toDto(project);
}

export async function updateProject(
  projectId: string,
  workspaceId: string,
  userId: string,
  input: Partial<{
    name: string;
    description: string;
    status: ProjectStatus;
    color: string;
    progress: number;
  }>,
): Promise<ProjectDto> {
  const project = await Project.findOne({ _id: projectId, workspaceId });
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (input.name) project.name = input.name;
  if (input.description !== undefined) project.description = input.description;
  if (input.status) project.status = input.status;
  if (input.color) project.color = input.color;
  if (input.progress !== undefined) project.progress = input.progress;

  await project.save();

  const user = await User.findById(userId);
  await logActivity({
    workspaceId,
    userId,
    type: 'project.updated',
    message: `updated project "${project.name}"`,
    metadata: { projectId, actorName: user?.name },
  });

  return toDto(project);
}

export async function deleteProject(
  projectId: string,
  workspaceId: string,
  userId: string,
): Promise<void> {
  const project = await Project.findOne({ _id: projectId, workspaceId });
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const name = project.name;
  await project.deleteOne();

  const user = await User.findById(userId);
  await logActivity({
    workspaceId,
    userId,
    type: 'project.deleted',
    message: `deleted project "${name}"`,
    metadata: { projectId, actorName: user?.name },
  });
}
