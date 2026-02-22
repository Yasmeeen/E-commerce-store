import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getDashboardStats } from '@/services/order.service';
import { checkoutSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = checkoutSchema.parse(body);
    const items = body.items as { productId: string; quantity: number }[];
    if (!Array.isArray(items) || !items.length) return NextResponse.json({ message: 'Items required' }, { status: 400 });
    const sessionId = req.headers.get('x-cart-session') ?? req.cookies.get('cart-session')?.value ?? '';
    const order = await createOrder(input, items, sessionId);
    return NextResponse.json(order);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? undefined;
    const orders = await getOrders({ status: status as 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' });
    return NextResponse.json(orders);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
