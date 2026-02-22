import mongoose from 'mongoose';
import { Cart, Product } from '@/models';
import { connectDB } from '@/lib/db';
import { NotFoundError } from '@/lib/errors';

export async function getCart(sessionId: string) {
  await connectDB();
  let cart = await Cart.findOne({ sessionId }).lean();
  if (!cart) {
    cart = (await Cart.create({ sessionId, items: [] })).toObject();
  }
  return cart;
}

export async function addToCart(sessionId: string, productId: string, quantity: number) {
  await connectDB();
  if (!mongoose.isValidObjectId(productId)) throw new NotFoundError('Product not found');
  const product = await Product.findById(productId).lean();
  if (!product) throw new NotFoundError('Product not found');
  let cart = await Cart.findOne({ sessionId });
  if (!cart) cart = await Cart.create({ sessionId, items: [] });
  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    });
  }
  await cart.save();
  return cart.toObject();
}

export async function updateCartItem(sessionId: string, productId: string, quantity: number) {
  await connectDB();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) throw new NotFoundError('Cart not found');
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new NotFoundError('Item not in cart');
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  return cart.toObject();
}

export async function removeFromCart(sessionId: string, productId: string) {
  await connectDB();
  const cart = await Cart.findOne({ sessionId });
  if (!cart) throw new NotFoundError('Cart not found');
  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return cart.toObject();
}

export async function clearCart(sessionId: string) {
  await connectDB();
  await Cart.findOneAndUpdate({ sessionId }, { items: [] });
  return { success: true };
}
