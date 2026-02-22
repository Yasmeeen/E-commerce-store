import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/services/category.service';
import { categorySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const input = categorySchema.parse(body);
    const category = await createCategory(input);
    return NextResponse.json(category);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
