import { env } from '../config/env.js';

/**
 * Email delivery stub — swap for SendGrid, Resend, SES, etc. in production.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  if (!env.isProduction || env.exposeResetTokenInDev) {
    console.log(`[email] Password reset for ${email}: ${resetUrl}`);
  }
  // Production: await resend.emails.send({ ... })
}
