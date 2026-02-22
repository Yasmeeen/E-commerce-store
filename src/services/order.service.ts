import mongoose from 'mongoose';
import { Order, Product, Cart } from '@/models';
import { connectDB } from '@/lib/db';
import { NotFoundError, ValidationError } from '@/lib/errors';
import type { CheckoutInput } from '@/lib/validations';
import type { OrderStatus } from '@/models';

function generateOrderNumber(): string {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function createOrder(input: CheckoutInput, items: { productId: string; quantity: number }[], sessionId: string) {
  await connectDB();
  if (!items.length) throw new ValidationError('Cart is empty');
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  if (products.length !== productIds.length) throw new ValidationError('Some products are invalid or no longer available');
  const orderItems = products.map((p) => {
    const item = items.find((i) => i.productId === p._id.toString());
    const qty = item?.quantity ?? 1;
    return {
      product: p._id,
      name: p.name,
      price: p.price,
      quantity: qty,
      image: p.images?.[0],
    };
  });
  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;
  const orderNumber = generateOrderNumber();
  const order = await Order.create({
    orderNumber,
    customer: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
    },
    items: orderItems,
    subtotal,
    shipping: 0,
    total,
    status: 'pending',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    notes: input.notes,
  });
  await Cart.findOneAndUpdate({ sessionId }, { items: [] });
  return order.toObject();
}

export async function getOrders(filters?: { status?: OrderStatus }) {
  await connectDB();
  const query = filters?.status ? { status: filters.status } : {};
  return Order.find(query).sort({ createdAt: -1 }).lean();
}

export async function getOrderById(id: string) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Order not found');
  const order = await Order.findById(id).populate('items.product').lean();
  if (!order) throw new NotFoundError('Order not found');
  return order;
}

export async function getOrderByNumber(orderNumber: string) {
  await connectDB();
  const order = await Order.findOne({ orderNumber }).populate('items.product').lean();
  if (!order) throw new NotFoundError('Order not found');
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) throw new NotFoundError('Order not found');
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!order) throw new NotFoundError('Order not found');
  return order;
}

export async function getDashboardStats() {
  await connectDB();
  const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments({ status: 'pending' }),
  ]);
  return {
    totalOrders,
    totalRevenue: totalRevenue[0]?.total ?? 0,
    pendingOrders,
  };
}
