import { env } from '../config/env.js';

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  if (!env.isProduction || env.exposeResetTokenInDev) {
    console.log(`[email] Password reset for ${email}: ${resetUrl}`);
  }
}

export async function sendWorkspaceInviteEmail(
  email: string,
  workspaceName: string,
  inviteUrl: string,
  inviterName: string,
): Promise<void> {
  if (!env.isProduction || env.exposeResetTokenInDev) {
    console.log(
      `[email] Workspace invite for ${email} to "${workspaceName}" from ${inviterName}: ${inviteUrl}`,
    );
  }
}
