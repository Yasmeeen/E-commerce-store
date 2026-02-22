import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/services/category.service';
import { categorySchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategoryById(id);
    return NextResponse.json(category);
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
    const input = categorySchema.partial().parse(body);
    const category = await updateCategory(id, input);
    return NextResponse.json(category);
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
    await deleteCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
