import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);
