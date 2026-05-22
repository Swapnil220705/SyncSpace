import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as workspaceService from '../services/workspaceService.js';
import { getWorkspaceActivities } from '../services/activityService.js';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createWorkspace(req.auth!.userId, req.body);
  res.status(201).json({ success: true, data: { workspace } });
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const workspaces = await workspaceService.listUserWorkspaces(req.auth!.userId);
  res.json({ success: true, data: { workspaces } });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await workspaceService.getWorkspace(
    req.params.workspaceId!,
    req.auth!.userId,
  );
  res.json({ success: true, data: { workspace } });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await workspaceService.updateWorkspace(
    req.workspaceId!,
    req.auth!.userId,
    req.body,
  );
  res.json({ success: true, data: { workspace } });
});

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await workspaceService.listMembers(req.workspaceId!);
  res.json({ success: true, data: { members } });
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  await workspaceService.updateMemberRole(
    req.workspaceId!,
    req.params.memberId!,
    req.body.role,
    req.auth!.userId,
  );
  const members = await workspaceService.listMembers(req.workspaceId!);
  res.json({ success: true, data: { members } });
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  await workspaceService.removeMember(
    req.workspaceId!,
    req.params.memberId!,
    req.auth!.userId,
  );
  const members = await workspaceService.listMembers(req.workspaceId!);
  res.json({ success: true, data: { members } });
});

export const invite = asyncHandler(async (req: Request, res: Response) => {
  const result = await workspaceService.inviteMember(
    req.workspaceId!,
    req.body,
    req.auth!.userId,
  );
  res.status(201).json({ success: true, data: result });
});

export const listInvitations = asyncHandler(async (req: Request, res: Response) => {
  const invitations = await workspaceService.listInvitations(req.workspaceId!);
  res.json({ success: true, data: { invitations } });
});

export const revokeInvitation = asyncHandler(async (req: Request, res: Response) => {
  await workspaceService.revokeInvitation(req.workspaceId!, req.params.invitationId!);
  const invitations = await workspaceService.listInvitations(req.workspaceId!);
  res.json({ success: true, data: { invitations } });
});

export const acceptInvite = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await workspaceService.acceptInvitation(
    req.body.token,
    req.auth!.userId,
  );
  res.json({ success: true, data: { workspace } });
});

export const activities = asyncHandler(async (req: Request, res: Response) => {
  const activities = await getWorkspaceActivities(req.workspaceId!);
  res.json({ success: true, data: { activities } });
});
