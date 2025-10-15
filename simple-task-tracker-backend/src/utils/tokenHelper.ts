import { Request } from 'express';

/**
 * Extract Bearer token from Authorization header
 * @param req Express request object
 * @returns Extracted token or empty string
 */
export function extractToken(req: Request): string {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}
