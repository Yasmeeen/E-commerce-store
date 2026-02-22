import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { login } from '@/services/auth.service';
import { handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = loginSchema.parse(body);
    const result = await login(input);
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = handleApiError(error);
    return NextResponse.json(body, { status });
  }
}
