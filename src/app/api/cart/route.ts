import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/services/cart.service';
import { handleApiError } from '@/lib/errors';

function getSessionId(req: NextRequest): string {
  const sessionId = req.headers.get('x-cart-session') ?? req.cookies.get('cart-session')?.value;
  if (!sessionId) {
    const newId = 'cart-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    return newId;
  }
  return sessionId;
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const cart = await getCart(sessionId);
    const res = NextResponse.json(cart);
    if (!req.cookies.get('cart-session')) {
      res.cookies.set('cart-session', sessionId, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
    }
    return res;
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const body = await req.json();
    const { productId, quantity = 1 } = body;
    if (!productId) return NextResponse.json({ message: 'productId required' }, { status: 400 });
    const cart = await addToCart(sessionId, productId, Number(quantity));
    const res = NextResponse.json(cart);
    if (!req.cookies.get('cart-session')) {
      res.cookies.set('cart-session', sessionId, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
    }
    return res;
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const body = await req.json();
    const { productId, quantity } = body;
    if (!productId || quantity === undefined) return NextResponse.json({ message: 'productId and quantity required' }, { status: 400 });
    const cart = await updateCartItem(sessionId, productId, Number(quantity));
    return NextResponse.json(cart);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = getSessionId(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (productId) {
      const cart = await removeFromCart(sessionId, productId);
      return NextResponse.json(cart);
    }
    await clearCart(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
