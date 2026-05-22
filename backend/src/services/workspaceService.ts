import { ApiError } from '../utils/apiError.js';
import { generateSecureToken, hashToken } from '../utils/authHelpers.js';
import { uniqueSlug } from '../utils/slugify.js';
import { Workspace } from '../models/Workspace.js';
import { WorkspaceMember, type WorkspaceRole } from '../models/WorkspaceMember.js';
import { WorkspaceInvitation } from '../models/WorkspaceInvitation.js';
import { User } from '../models/User.js';
import { logActivity } from './activityService.js';
import { sendWorkspaceInviteEmail } from './emailService.js';
import { env } from '../config/env.js';

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const ICON_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconColor: string;
  role: WorkspaceRole;
  memberCount: number;
  projectCount?: number;
  createdAt: Date;
}

function pickIconColor(): string {
  return ICON_COLORS[Math.floor(Math.random() * ICON_COLORS.length)]!;
}

export async function createWorkspace(
  userId: string,
  input: { name: string; description?: string; iconColor?: string },
): Promise<WorkspaceSummary> {
  const slug = await uniqueSlug(input.name, async (s) => Boolean(await Workspace.findOne({ slug: s })));

  const workspace = await Workspace.create({
    name: input.name,
    slug,
    description: input.description,
    iconColor: input.iconColor ?? pickIconColor(),
    ownerId: userId,
  });

  await WorkspaceMember.create({
    workspaceId: workspace._id,
    userId,
    role: 'owner',
  });

  await logActivity({
    workspaceId: workspace._id,
    userId,
    type: 'workspace.created',
    message: `created workspace "${workspace.name}"`,
  });

  return {
    id: workspace._id.toString(),
    name: workspace.name,
    slug: workspace.slug,
    description: workspace.description,
    iconColor: workspace.iconColor,
    role: 'owner',
    memberCount: 1,
    createdAt: workspace.createdAt,
  };
}

export async function listUserWorkspaces(userId: string): Promise<WorkspaceSummary[]> {
  const memberships = await WorkspaceMember.find({ userId }).populate('workspaceId');

  const results: WorkspaceSummary[] = [];
  for (const m of memberships) {
    const ws = m.workspaceId as unknown as InstanceType<typeof Workspace>;
    if (!ws?._id) continue;

    const memberCount = await WorkspaceMember.countDocuments({ workspaceId: ws._id });
    results.push({
      id: ws._id.toString(),
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      iconColor: ws.iconColor,
      role: m.role,
      memberCount,
      createdAt: ws.createdAt,
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getWorkspace(
  workspaceId: string,
  userId: string,
): Promise<WorkspaceSummary> {
  const membership = await WorkspaceMember.findOne({ workspaceId, userId });
  if (!membership) {
    throw new ApiError(403, 'Not a workspace member');
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(404, 'Workspace not found');
  }

  const memberCount = await WorkspaceMember.countDocuments({ workspaceId });

  return {
    id: workspace._id.toString(),
    name: workspace.name,
    slug: workspace.slug,
    description: workspace.description,
    iconColor: workspace.iconColor,
    role: membership.role,
    memberCount,
    createdAt: workspace.createdAt,
  };
}

export async function updateWorkspace(
  workspaceId: string,
  userId: string,
  input: { name?: string; description?: string; iconColor?: string },
): Promise<WorkspaceSummary> {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(404, 'Workspace not found');
  }

  if (input.name) workspace.name = input.name;
  if (input.description !== undefined) workspace.description = input.description;
  if (input.iconColor) workspace.iconColor = input.iconColor;

  await workspace.save();

  const actor = await User.findById(userId);
  await logActivity({
    workspaceId,
    userId,
    type: 'workspace.updated',
    message: `updated workspace settings`,
    metadata: { actorName: actor?.name },
  });

  return getWorkspace(workspaceId, userId);
}

export async function listMembers(workspaceId: string) {
  const members = await WorkspaceMember.find({ workspaceId })
    .populate('userId', 'name email avatarUrl')
    .sort({ role: -1, joinedAt: 1 });

  return members.map((m) => {
    const user = m.userId as unknown as {
      _id: { toString(): string };
      name: string;
      email: string;
      avatarUrl?: string;
    };
    return {
      id: m._id.toString(),
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: m.role,
      joinedAt: m.joinedAt,
    };
  });
}

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  role: WorkspaceRole,
  actorId: string,
): Promise<void> {
  const member = await WorkspaceMember.findOne({ _id: memberId, workspaceId });
  if (!member) {
    throw new ApiError(404, 'Member not found');
  }
  if (member.role === 'owner') {
    throw new ApiError(400, 'Cannot change owner role');
  }
  if (role === 'owner') {
    throw new ApiError(400, 'Cannot assign owner role');
  }

  const previousRole = member.role;
  member.role = role;
  await member.save();

  const actor = await User.findById(actorId);
  await logActivity({
    workspaceId,
    userId: actorId,
    type: 'member.role_changed',
    message: `changed a member role from ${previousRole} to ${role}`,
    metadata: { memberId, previousRole, newRole: role, actorName: actor?.name },
  });
}

export async function removeMember(
  workspaceId: string,
  memberId: string,
  actorId: string,
): Promise<void> {
  const member = await WorkspaceMember.findOne({ _id: memberId, workspaceId });
  if (!member) {
    throw new ApiError(404, 'Member not found');
  }
  if (member.role === 'owner') {
    throw new ApiError(400, 'Cannot remove workspace owner');
  }

  await member.deleteOne();

  const actor = await User.findById(actorId);
  await logActivity({
    workspaceId,
    userId: actorId,
    type: 'member.removed',
    message: 'removed a member from the workspace',
    metadata: { memberId, actorName: actor?.name },
  });
}

export async function inviteMember(
  workspaceId: string,
  input: { email: string; role?: WorkspaceRole },
  inviterId: string,
): Promise<{ invitationId: string; message: string; inviteUrl?: string }> {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new ApiError(404, 'Workspace not found');
  }

  const inviter = await User.findById(inviterId);
  if (!inviter) {
    throw new ApiError(404, 'Inviter not found');
  }

  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    const alreadyMember = await WorkspaceMember.findOne({
      workspaceId,
      userId: existingUser._id,
    });
    if (alreadyMember) {
      throw new ApiError(409, 'User is already a workspace member');
    }
  }

  const pending = await WorkspaceInvitation.findOne({
    workspaceId,
    email: input.email,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  });
  if (pending) {
    throw new ApiError(409, 'An invitation is already pending for this email');
  }

  const rawToken = generateSecureToken(24);
  const invitation = await WorkspaceInvitation.create({
    workspaceId,
    email: input.email,
    role: input.role ?? 'member',
    token: hashToken(rawToken),
    invitedBy: inviterId,
    expiresAt: new Date(Date.now() + INVITE_EXPIRY_MS),
  });

  const inviteUrl = `${env.appUrl}/invite?token=${rawToken}`;
  await sendWorkspaceInviteEmail(input.email, workspace.name, inviteUrl, inviter.name);

  await logActivity({
    workspaceId,
    userId: inviterId,
    type: 'member.invited',
    message: `invited ${input.email} as ${input.role ?? 'member'}`,
    metadata: { email: input.email, role: input.role ?? 'member' },
  });

  const message = 'Invitation sent successfully';
  if (!env.isProduction || env.exposeResetTokenInDev) {
    return { invitationId: invitation._id.toString(), message, inviteUrl };
  }
  return { invitationId: invitation._id.toString(), message };
}

export async function listInvitations(workspaceId: string) {
  const invites = await WorkspaceInvitation.find({
    workspaceId,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  })
    .populate('invitedBy', 'name email')
    .sort({ createdAt: -1 });

  return invites.map((inv) => {
    const inviter = inv.invitedBy as unknown as { name: string; email: string };
    return {
      id: inv._id.toString(),
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
      invitedBy: { name: inviter?.name, email: inviter?.email },
    };
  });
}

export async function revokeInvitation(
  workspaceId: string,
  invitationId: string,
): Promise<void> {
  const invite = await WorkspaceInvitation.findOne({
    _id: invitationId,
    workspaceId,
    status: 'pending',
  });
  if (!invite) {
    throw new ApiError(404, 'Invitation not found');
  }
  invite.status = 'revoked';
  await invite.save();
}

export async function acceptInvitation(
  token: string,
  userId: string,
): Promise<WorkspaceSummary> {
  const tokenHash = hashToken(token);
  const invite = await WorkspaceInvitation.findOne({
    token: tokenHash,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  });

  if (!invite) {
    throw new ApiError(400, 'Invalid or expired invitation');
  }

  const user = await User.findById(userId);
  if (!user || user.email.toLowerCase() !== invite.email.toLowerCase()) {
    throw new ApiError(403, 'Invitation email does not match your account');
  }

  const existing = await WorkspaceMember.findOne({
    workspaceId: invite.workspaceId,
    userId,
  });
  if (existing) {
    throw new ApiError(409, 'Already a member of this workspace');
  }

  await WorkspaceMember.create({
    workspaceId: invite.workspaceId,
    userId,
    role: invite.role,
  });

  invite.status = 'accepted';
  await invite.save();

  await logActivity({
    workspaceId: invite.workspaceId,
    userId,
    type: 'member.joined',
    message: `${user.name} joined the workspace`,
    metadata: { email: user.email },
  });

  return getWorkspace(invite.workspaceId.toString(), userId);
}
