import mongoose from 'mongoose';
import { Product, Category } from '@/models';
import { connectDB } from '@/lib/db';
import { NotFoundError, ValidationError } from '@/lib/errors';
import type { ProductInput } from '@/lib/validations';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters?.category) query.category = new mongoose.Types.ObjectId(filters.category);
  if (filters?.minPrice != null || filters?.maxPrice != null) {
    query.price = {};
    if (filters?.minPrice != null) (query.price as Record<string, number>).$gte = filters.minPrice;
    if (filters?.maxPrice != null) (query.price as Record<string, number>).$lte = filters.maxPrice;
  }
  if (filters?.featured) query.featured = true;
  if (filters?.search) query.$or = [{ name: new RegExp(filters.search, 'i') }, { description: new RegExp(filters.search, 'i') }];
  const products = await Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 }).lean();
  return products;
}

export async function getProductById(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Product not found');
  const product = await Product.findById(id).populate('category', 'name slug').lean();
  if (!product) throw new NotFoundError('Product not found');
  return product;
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug }).populate('category', 'name slug').lean();
  if (!product) throw new NotFoundError('Product not found');
  return product;
}

export async function createProduct(input: ProductInput) {
  await connectDB();
  const slug = input.slug || slugify(input.name);
  const existing = await Product.findOne({ slug });
  if (existing) throw new ValidationError('Product with this slug already exists');
  const categoryId = input.category && mongoose.isValidObjectId(input.category) ? input.category : undefined;
  const product = await Product.create({
    ...input,
    slug,
    category: categoryId,
  });
  return product.toObject();
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Product not found');
  const update: Record<string, unknown> = { ...input };
  if (input.name && !input.slug) update.slug = slugify(input.name);
  if (input.category !== undefined) update.category = input.category && mongoose.isValidObjectId(input.category) ? input.category : null;
  const product = await Product.findByIdAndUpdate(id, update, { new: true }).populate('category', 'name slug').lean();
  if (!product) throw new NotFoundError('Product not found');
  return product;
}

export async function deleteProduct(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Product not found');
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError('Product not found');
  return { success: true };
}
