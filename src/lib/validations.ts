import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'customer']).optional().default('customer'),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').optional(),
  description: z.string().optional().default(''),
  price: z.number().positive('Price must be positive'),
  images: z.array(z.string().url()).optional().default([]),
  category: z.string().optional(),
  stock: z.number().int().min(0).optional().default(0),
  featured: z.boolean().optional().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').optional(),
  description: z.string().optional(),
});

export const checkoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  notes: z.string().optional(),
});

export const storeConfigSchema = z.object({
  storeName: z.string().min(1).optional(),
  logo: z.string().url().optional().nullable(),
  primaryColor: z.string().min(1).optional(),
  whatsappNumber: z.string().optional().nullable(),
  heroMediaType: z.enum(['image', 'video']).optional().nullable(),
  heroMediaUrl: z.string().optional().nullable(),
});

export const orderStatusSchema = z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type StoreConfigInput = z.infer<typeof storeConfigSchema>;
