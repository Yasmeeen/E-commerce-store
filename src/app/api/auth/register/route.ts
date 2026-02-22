import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations';
import { register } from '@/services/auth.service';
import { handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = registerSchema.parse(body);
    const result = await register(input);
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
