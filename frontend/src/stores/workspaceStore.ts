import { create } from 'zustand';
import * as workspaceService from '@/services/workspaceService';
import type {
  ActivityItem,
  Project,
  Workspace,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceRole,
} from '@/types/workspace';
import {
  clearStoredWorkspaceId,
  getStoredWorkspaceId,
  setStoredWorkspaceId,
} from '@/utils/storage';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  members: WorkspaceMember[];
  invitations: WorkspaceInvitation[];
  projects: Project[];
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  selectWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (input: { name: string; description?: string }) => Promise<Workspace>;
  refreshCurrent: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchInvitations: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  inviteMember: (email: string, role: WorkspaceRole) => Promise<{ inviteUrl?: string }>;
  revokeInvitation: (invitationId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: WorkspaceRole) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  createProject: (input: { name: string; description?: string }) => Promise<Project>;
  deleteProject: (projectId: string) => Promise<void>;
  acceptInvite: (token: string) => Promise<Workspace>;
  clearError: () => void;
  canManageTeam: () => boolean;
  canCreateProject: () => boolean;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  members: [],
  invitations: [],
  projects: [],
  activities: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  canManageTeam: () => {
    const role = get().currentWorkspace?.role;
    return role === 'owner' || role === 'admin';
  },

  canCreateProject: () => {
    const role = get().currentWorkspace?.role;
    return role === 'owner' || role === 'admin' || role === 'member';
  },

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const workspaces = await workspaceService.listWorkspaces();
      set({ workspaces, isLoading: false });

      const storedId = getStoredWorkspaceId();
      const target =
        workspaces.find((w) => w.id === storedId) ?? workspaces[0] ?? null;

      if (target) {
        await get().selectWorkspace(target.id);
      } else {
        set({ currentWorkspace: null });
        clearStoredWorkspaceId();
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  selectWorkspace: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      setStoredWorkspaceId(workspaceId);
      const [workspace, members, projects, activities] = await Promise.all([
        workspaceService.getWorkspace(workspaceId),
        workspaceService.listMembers(workspaceId),
        workspaceService.listProjects(workspaceId),
        workspaceService.listActivities(workspaceId),
      ]);

      let invitations: WorkspaceInvitation[] = [];
      if (workspace.role === 'owner' || workspace.role === 'admin') {
        invitations = await workspaceService.listInvitations(workspaceId);
      }

      set({
        currentWorkspace: workspace,
        members,
        projects,
        activities,
        invitations,
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  createWorkspace: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const workspace = await workspaceService.createWorkspace(input);
      const workspaces = [...get().workspaces, workspace];
      set({ workspaces, isLoading: false });
      await get().selectWorkspace(workspace.id);
      return workspace;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  refreshCurrent: async () => {
    const id = get().currentWorkspace?.id;
    if (id) await get().selectWorkspace(id);
  },

  fetchMembers: async () => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const members = await workspaceService.listMembers(id);
    set({ members });
  },

  fetchInvitations: async () => {
    const id = get().currentWorkspace?.id;
    if (!id || !get().canManageTeam()) return;
    const invitations = await workspaceService.listInvitations(id);
    set({ invitations });
  },

  fetchProjects: async () => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const projects = await workspaceService.listProjects(id);
    set({ projects });
  },

  fetchActivities: async () => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const activities = await workspaceService.listActivities(id);
    set({ activities });
  },

  inviteMember: async (email, role) => {
    const id = get().currentWorkspace?.id;
    if (!id) throw new Error('No workspace selected');
    set({ isLoading: true, error: null });
    try {
      const result = await workspaceService.inviteMember(id, { email, role });
      await get().fetchInvitations();
      await get().fetchActivities();
      set({ isLoading: false });
      return { inviteUrl: result.inviteUrl };
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  revokeInvitation: async (invitationId) => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const invitations = await workspaceService.revokeInvitation(id, invitationId);
    set({ invitations });
  },

  updateMemberRole: async (memberId, role) => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const members = await workspaceService.updateMemberRole(id, memberId, role);
    set({ members });
    await get().fetchActivities();
  },

  removeMember: async (memberId) => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    const members = await workspaceService.removeMember(id, memberId);
    set({ members });
    await get().fetchActivities();
  },

  createProject: async (input) => {
    const id = get().currentWorkspace?.id;
    if (!id) throw new Error('No workspace selected');
    set({ isLoading: true, error: null });
    try {
      const project = await workspaceService.createProject(id, input);
      set({
        projects: [project, ...get().projects],
        isLoading: false,
      });
      await get().fetchActivities();
      return project;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteProject: async (projectId) => {
    const id = get().currentWorkspace?.id;
    if (!id) return;
    await workspaceService.deleteProject(id, projectId);
    set({ projects: get().projects.filter((p) => p.id !== projectId) });
    await get().fetchActivities();
  },

  acceptInvite: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const workspace = await workspaceService.acceptInvitation(token);
      await get().fetchWorkspaces();
      await get().selectWorkspace(workspace.id);
      set({ isLoading: false });
      return workspace;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },
}));
