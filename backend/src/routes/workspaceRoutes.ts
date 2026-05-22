import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireWorkspaceMember, requireWorkspaceRole } from '../middleware/workspace.js';
import { validate } from '../middleware/validate.js';
import * as workspaceController from '../controllers/workspaceController.js';
import * as projectController from '../controllers/projectController.js';
import {
  acceptInviteValidation,
  createProjectValidation,
  createWorkspaceValidation,
  inviteValidation,
  updateMemberRoleValidation,
  updateProjectValidation,
  updateWorkspaceValidation,
} from '../utils/workspaceValidators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createWorkspaceValidation), workspaceController.create);
router.get('/', workspaceController.list);
router.post('/invitations/accept', validate(acceptInviteValidation), workspaceController.acceptInvite);

const workspaceRouter = Router({ mergeParams: true });

workspaceRouter.use(requireWorkspaceMember);

workspaceRouter.get('/', workspaceController.getOne);
workspaceRouter.patch(
  '/',
  requireWorkspaceRole('admin', 'owner'),
  validate(updateWorkspaceValidation),
  workspaceController.update,
);

workspaceRouter.get('/members', workspaceController.listMembers);
workspaceRouter.patch(
  '/members/:memberId',
  requireWorkspaceRole('admin', 'owner'),
  validate(updateMemberRoleValidation),
  workspaceController.updateMember,
);
workspaceRouter.delete(
  '/members/:memberId',
  requireWorkspaceRole('admin', 'owner'),
  workspaceController.removeMember,
);

workspaceRouter.get('/invitations', requireWorkspaceRole('admin', 'owner'), workspaceController.listInvitations);
workspaceRouter.post(
  '/invitations',
  requireWorkspaceRole('admin', 'owner'),
  validate(inviteValidation),
  workspaceController.invite,
);
workspaceRouter.delete(
  '/invitations/:invitationId',
  requireWorkspaceRole('admin', 'owner'),
  workspaceController.revokeInvitation,
);

workspaceRouter.get('/activities', workspaceController.activities);

workspaceRouter.get('/projects', projectController.list);
workspaceRouter.post(
  '/projects',
  requireWorkspaceRole('member', 'admin', 'owner'),
  validate(createProjectValidation),
  projectController.create,
);
workspaceRouter.patch(
  '/projects/:projectId',
  requireWorkspaceRole('member', 'admin', 'owner'),
  validate(updateProjectValidation),
  projectController.update,
);
workspaceRouter.delete(
  '/projects/:projectId',
  requireWorkspaceRole('admin', 'owner'),
  validate(updateProjectValidation),
  projectController.remove,
);

router.use('/:workspaceId', workspaceRouter);

export default router;
