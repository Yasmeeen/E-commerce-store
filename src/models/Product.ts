import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
