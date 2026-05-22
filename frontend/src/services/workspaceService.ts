import type { ApiResponse } from '@/types/api';
import type {
  ActivityItem,
  Project,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceRole,
} from '@/types/workspace';
import { apiClient } from './apiClient';

export async function listWorkspaces(): Promise<Workspace[]> {
  const { data } = await apiClient.get<ApiResponse<{ workspaces: Workspace[] }>>('/workspaces');
  return data.data.workspaces;
}

export async function createWorkspace(input: {
  name: string;
  description?: string;
  iconColor?: string;
}): Promise<Workspace> {
  const { data } = await apiClient.post<ApiResponse<{ workspace: Workspace }>>('/workspaces', input);
  return data.data.workspace;
}

export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const { data } = await apiClient.get<ApiResponse<{ workspace: Workspace }>>(
    `/workspaces/${workspaceId}`,
  );
  return data.data.workspace;
}

export async function listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const { data } = await apiClient.get<ApiResponse<{ members: WorkspaceMember[] }>>(
    `/workspaces/${workspaceId}/members`,
  );
  return data.data.members;
}

export async function inviteMember(
  workspaceId: string,
  input: { email: string; role?: WorkspaceRole },
): Promise<{ invitationId: string; message: string; inviteUrl?: string }> {
  const { data } = await apiClient.post<
    ApiResponse<{ invitationId: string; message: string; inviteUrl?: string }>
  >(`/workspaces/${workspaceId}/invitations`, input);
  return data.data;
}

export async function listInvitations(workspaceId: string): Promise<WorkspaceInvitation[]> {
  const { data } = await apiClient.get<ApiResponse<{ invitations: WorkspaceInvitation[] }>>(
    `/workspaces/${workspaceId}/invitations`,
  );
  return data.data.invitations;
}

export async function revokeInvitation(
  workspaceId: string,
  invitationId: string,
): Promise<WorkspaceInvitation[]> {
  const { data } = await apiClient.delete<ApiResponse<{ invitations: WorkspaceInvitation[] }>>(
    `/workspaces/${workspaceId}/invitations/${invitationId}`,
  );
  return data.data.invitations;
}

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole,
): Promise<WorkspaceMember[]> {
  const { data } = await apiClient.patch<ApiResponse<{ members: WorkspaceMember[] }>>(
    `/workspaces/${workspaceId}/members/${memberId}`,
    { role },
  );
  return data.data.members;
}

export async function removeMember(
  workspaceId: string,
  memberId: string,
): Promise<WorkspaceMember[]> {
  const { data } = await apiClient.delete<ApiResponse<{ members: WorkspaceMember[] }>>(
    `/workspaces/${workspaceId}/members/${memberId}`,
  );
  return data.data.members;
}

export async function acceptInvitation(token: string): Promise<Workspace> {
  const { data } = await apiClient.post<ApiResponse<{ workspace: Workspace }>>(
    '/workspaces/invitations/accept',
    { token },
  );
  return data.data.workspace;
}

export async function listActivities(workspaceId: string): Promise<ActivityItem[]> {
  const { data } = await apiClient.get<ApiResponse<{ activities: ActivityItem[] }>>(
    `/workspaces/${workspaceId}/activities`,
  );
  return data.data.activities;
}

export async function listProjects(workspaceId: string): Promise<Project[]> {
  const { data } = await apiClient.get<ApiResponse<{ projects: Project[] }>>(
    `/workspaces/${workspaceId}/projects`,
  );
  return data.data.projects;
}

export async function createProject(
  workspaceId: string,
  input: { name: string; description?: string; status?: string; color?: string },
): Promise<Project> {
  const { data } = await apiClient.post<ApiResponse<{ project: Project }>>(
    `/workspaces/${workspaceId}/projects`,
    input,
  );
  return data.data.project;
}

export async function updateProject(
  workspaceId: string,
  projectId: string,
  input: Partial<Project>,
): Promise<Project> {
  const { data } = await apiClient.patch<ApiResponse<{ project: Project }>>(
    `/workspaces/${workspaceId}/projects/${projectId}`,
    input,
  );
  return data.data.project;
}

export async function deleteProject(workspaceId: string, projectId: string): Promise<void> {
  await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
}
