import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart extends Document {
  sessionId: string;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart: Model<ICart> = mongoose.models.Cart ?? mongoose.model<ICart>('Cart', CartSchema);
