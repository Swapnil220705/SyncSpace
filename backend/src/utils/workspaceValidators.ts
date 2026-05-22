import { body, param } from 'express-validator';

export const createWorkspaceValidation = [
  body('name').trim().notEmpty().withMessage('Workspace name is required').isLength({ max: 80 }),
  body('description').optional().trim().isLength({ max: 280 }),
  body('iconColor').optional().isHexColor().withMessage('Invalid color'),
];

export const updateWorkspaceValidation = [
  body('name').optional().trim().notEmpty().isLength({ max: 80 }),
  body('description').optional().trim().isLength({ max: 280 }),
  body('iconColor').optional().isHexColor(),
];

export const inviteValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('role').optional().isIn(['admin', 'member', 'guest']).withMessage('Invalid role'),
];

export const updateMemberRoleValidation = [
  param('memberId').isMongoId().withMessage('Invalid member ID'),
  body('role').isIn(['admin', 'member', 'guest']).withMessage('Invalid role'),
];

export const createProjectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required').isLength({ max: 120 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['planning', 'active', 'paused', 'completed', 'archived']),
  body('color').optional().isHexColor(),
];

export const updateProjectValidation = [
  param('projectId').isMongoId(),
  body('name').optional().trim().notEmpty().isLength({ max: 120 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['planning', 'active', 'paused', 'completed', 'archived']),
  body('color').optional().isHexColor(),
  body('progress').optional().isInt({ min: 0, max: 100 }),
];

export const acceptInviteValidation = [
  body('token').notEmpty().withMessage('Invite token is required'),
];
