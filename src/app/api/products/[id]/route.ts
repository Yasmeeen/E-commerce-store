import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/services/product.service';
import { productSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return NextResponse.json(product);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const PUT = withAuth(async (req, context) => {
  try {
    const params = await (context?.params ?? Promise.resolve({})) as Record<string, string>;
    const id = params.id ?? '';
    const body = await req.json();
    const input = productSchema.partial().parse(body);
    const product = await updateProduct(id, input);
    return NextResponse.json(product);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });

export const DELETE = withAuth(async (_req, context) => {
  try {
    const params = await (context?.params ?? Promise.resolve({})) as Record<string, string>;
    const id = params.id ?? '';
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
