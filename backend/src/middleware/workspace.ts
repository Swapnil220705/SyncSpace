import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError.js';
import { WorkspaceMember, type WorkspaceRole } from '../models/WorkspaceMember.js';

declare global {
  namespace Express {
    interface Request {
      workspaceId?: string;
      workspaceRole?: WorkspaceRole;
    }
  }
}

const roleRank: Record<WorkspaceRole, number> = {
  guest: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

export function resolveWorkspaceId(req: Request): string | null {
  return (
    (req.headers['x-workspace-id'] as string) ||
    req.params.workspaceId ||
    req.body?.workspaceId ||
    null
  );
}

export async function requireWorkspaceMember(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const workspaceId = resolveWorkspaceId(req);
    if (!workspaceId) {
      throw new ApiError(400, 'Workspace ID is required');
    }
    if (!req.auth?.userId) {
      throw new ApiError(401, 'Authentication required');
    }

    const membership = await WorkspaceMember.findOne({
      workspaceId,
      userId: req.auth.userId,
    });

    if (!membership) {
      throw new ApiError(403, 'You are not a member of this workspace');
    }

    req.workspaceId = workspaceId;
    req.workspaceRole = membership.role;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireWorkspaceRole(...allowed: WorkspaceRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.workspaceRole) {
      return next(new ApiError(403, 'Workspace access required'));
    }

    const userRank = roleRank[req.workspaceRole];
    const minRequired = Math.min(...allowed.map((r) => roleRank[r]));

    if (allowed.includes(req.workspaceRole) || userRank >= minRequired) {
      return next();
    }

    next(new ApiError(403, 'Insufficient workspace permissions'));
  };
}
