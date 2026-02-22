import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');
  if (!orderNumber?.trim()) {
    return NextResponse.redirect(new URL('/orders', req.url));
  }
  return NextResponse.redirect(
    new URL(`/order-confirmation/${encodeURIComponent(orderNumber.trim())}`, req.url)
  );
}
