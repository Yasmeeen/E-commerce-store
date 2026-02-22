import dotenv from 'dotenv';
import path from 'path';

// Load .env.local (Next.js convention) or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';

const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_ADMIN = {
  email: 'cto.innovate@gmail.com',
  password: 'asdasd123A!',
  name: 'innovation Store',
  role: 'admin' as const,
};

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI. Set it in .env.local or .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('An admin user already exists:', existingAdmin.email);
      await mongoose.disconnect();
      process.exit(0);
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    await User.create({
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    });

    console.log('Default admin user created:', DEFAULT_ADMIN.email);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
