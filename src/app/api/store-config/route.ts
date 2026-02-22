import { NextRequest, NextResponse } from 'next/server';
import { getStoreConfig, updateStoreConfig } from '@/services/store-config.service';
import { storeConfigSchema } from '@/lib/validations';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/api-middleware';

export async function GET() {
  try {
    const config = await getStoreConfig();
    return NextResponse.json(config);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}

export const PUT = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const input = storeConfigSchema.parse(body);
    const config = await updateStoreConfig(input);
    return NextResponse.json(config);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
  }
, { adminOnly: true });
