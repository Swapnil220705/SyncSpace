import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as projectService from '../services/projectService.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.listProjects(req.workspaceId!);
  res.json({ success: true, data: { projects } });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(
    req.workspaceId!,
    req.auth!.userId,
    req.body,
  );
  res.status(201).json({ success: true, data: { project } });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(
    req.params.projectId!,
    req.workspaceId!,
    req.auth!.userId,
    req.body,
  );
  res.json({ success: true, data: { project } });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await projectService.deleteProject(
    req.params.projectId!,
    req.workspaceId!,
    req.auth!.userId,
  );
  res.json({ success: true, data: { message: 'Project deleted' } });
});
