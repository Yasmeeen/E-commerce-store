import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import type { TokenPayload } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { handleApiError } from '@/lib/errors';

export type AuthenticatedRequest = NextRequest & { auth?: TokenPayload };

export function withAuth(
  handler: (req: AuthenticatedRequest, context?: { params?: Promise<Record<string, string>> }) => Promise<NextResponse>,
  options?: { adminOnly?: boolean }
) {
  return async (req: AuthenticatedRequest, context?: { params?: Promise<Record<string, string>> }) => {
    try {
      const token = getTokenFromRequest(req);
      if (!token) throw new UnauthorizedError('Authentication required');
      const payload = verifyToken(token);
      if (!payload) throw new UnauthorizedError('Invalid or expired token');
      (req as AuthenticatedRequest).auth = payload;
      if (options?.adminOnly && payload.role !== 'admin') {
        throw new ForbiddenError('Admin access required');
      }
      return handler(req, context);
    } catch (error) {
      const { status, body } = handleApiError(error);
      return NextResponse.json(body, { status });
    }
  };
}
