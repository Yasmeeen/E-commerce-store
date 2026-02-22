import mongoose from 'mongoose';
import { Category } from '@/models';
import { connectDB } from '@/lib/db';
import { NotFoundError, ValidationError } from '@/lib/errors';
import type { CategoryInput } from '@/lib/validations';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function getCategories() {
  await connectDB();
  return Category.find().sort({ name: 1 }).lean();
}

export async function getCategoryById(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Category not found');
  const category = await Category.findById(id).lean();
  if (!category) throw new NotFoundError('Category not found');
  return category;
}

export async function createCategory(input: CategoryInput) {
  await connectDB();
  const slug = input.slug || slugify(input.name);
  const existing = await Category.findOne({ slug });
  if (existing) throw new ValidationError('Category with this slug already exists');
  const category = await Category.create({ ...input, slug });
  return category.toObject();
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Category not found');
  const update: Record<string, unknown> = { ...input };
  if (input.name && !input.slug) update.slug = slugify(input.name);
  const category = await Category.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!category) throw new NotFoundError('Category not found');
  return category;
}

export async function deleteCategory(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Category not found');
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new NotFoundError('Category not found');
  return { success: true };
}
