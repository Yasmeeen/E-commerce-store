import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/services/order.service';
import { orderStatusSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    return NextResponse.json(order);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const PATCH = withAuth(async (req, context) => {
  try {
    const params = await (context?.params ?? Promise.resolve({})) as Record<string, string>;
    const id = params.id ?? '';
    const body = await req.json();
    const status = orderStatusSchema.parse(body.status);
    const order = await updateOrderStatus(id, status);
    return NextResponse.json(order);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
