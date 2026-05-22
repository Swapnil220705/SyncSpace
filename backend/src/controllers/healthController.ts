import type { Request, Response } from 'express';

export function healthCheck(_req: Request, res: Response): void {
  res.json({
    success: true,
    data: {
      service: 'syncspace-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
