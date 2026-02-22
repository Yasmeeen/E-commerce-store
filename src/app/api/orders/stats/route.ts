import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/services/order.service';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export const GET = withAuth(async () => {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });

