import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentMethod = 'cod' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping?: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
