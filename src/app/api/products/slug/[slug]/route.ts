import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/services/product.service';
import { handleApiError } from '@/lib/errors';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    return NextResponse.json(product);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
