import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/services/order.service';
import { handleApiError } from '@/lib/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const order = await getOrderByNumber(decodeURIComponent(orderNumber));
    return NextResponse.json(order);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
