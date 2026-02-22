import bcrypt from 'bcryptjs';
import { User } from '@/models';
import { signToken } from '@/lib/auth';
import { UnauthorizedError, ValidationError } from '@/lib/errors';
import type { LoginInput, RegisterInput } from '@/lib/validations';
import { connectDB } from '@/lib/db';

export async function login(input: LoginInput): Promise<{ token: string; user: { id: string; email: string; name: string; role: string } }> {
  await connectDB();
  const user = await User.findOne({ email: input.email });
  if (!user) throw new UnauthorizedError('Invalid email or password');
  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new UnauthorizedError('Invalid email or password');
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as 'admin' | 'customer',
  });
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function register(input: RegisterInput): Promise<{ token: string; user: { id: string; email: string; name: string; role: string } }> {
  await connectDB();
  const existing = await User.findOne({ email: input.email });
  if (existing) throw new ValidationError('Email already registered');
  const hashed = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    email: input.email,
    password: hashed,
    name: input.name,
    role: input.role ?? 'customer',
  });
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as 'admin' | 'customer',
  });
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
