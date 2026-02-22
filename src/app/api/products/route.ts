import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/services/product.service';
import { productSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') ?? undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search') ?? undefined;
    const products = await getProducts({
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      featured: featured || undefined,
      search,
    });
    return NextResponse.json(products);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const input = productSchema.parse(body);
    const product = await createProduct(input);
    return NextResponse.json(product);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
