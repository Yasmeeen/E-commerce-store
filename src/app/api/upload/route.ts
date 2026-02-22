import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { image } = body;
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ message: 'Base64 image required' }, { status: 400 });
    }
    const result = await uploadImage(image);
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
