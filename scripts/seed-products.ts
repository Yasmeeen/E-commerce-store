import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import { Category } from '../src/models/Category';

const MONGODB_URI = process.env.MONGODB_URI;

const DUMMY_PRODUCTS = [
  {
    name: 'Classic White T-Shirt',
    slug: 'classic-white-tshirt',
    description: '100% cotton, soft and breathable white t-shirt for everyday wear.',
    price: 15.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1602810315850-8d7be5f5c2f0?auto=format&fit=crop&w=500&q=60',
    stock: 50,
  },
  {
    name: 'Blue Denim Jeans',
    slug: 'blue-denim-jeans',
    description: 'Classic straight fit blue denim jeans for men and women.',
    price: 39.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1589820296150-36db582c5752?auto=format&fit=crop&w=500&q=60',
    stock: 40,
  },
  {
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    description: 'Lightweight and comfortable running sneakers for daily workouts.',
    price: 65.0,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1595950650541-798d25a2d2d7?auto=format&fit=crop&w=500&q=60',
    stock: 25,
  },
  {
    name: 'Leather Boots',
    slug: 'leather-boots',
    description: 'Premium leather boots, durable and stylish.',
    price: 85.0,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1600185362142-fc6f0a6a52b0?auto=format&fit=crop&w=500&q=60',
    stock: 15,
  },
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'High-quality sound, noise-canceling, long battery life.',
    price: 49.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1580894894513-52a3b912b2e5?auto=format&fit=crop&w=500&q=60',
    stock: 30,
  },
  {
    name: 'Smart Watch',
    slug: 'smart-watch',
    description: 'Track your fitness, notifications, and health with a sleek smartwatch.',
    price: 99.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=60',
    stock: 20,
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description: '350ml ceramic mug, perfect for hot beverages.',
    price: 8.5,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1590080872886-3d1c26b42a4c?auto=format&fit=crop&w=500&q=60',
    stock: 100,
  },
  {
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: '500ml reusable bottle, keeps drinks hot or cold for hours.',
    price: 12.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1591581113055-ade7d810d45b?auto=format&fit=crop&w=500&q=60',
    stock: 70,
  },
  {
    name: 'Desk Lamp LED',
    slug: 'desk-lamp-led',
    description: 'Adjustable LED desk lamp, perfect for work and study.',
    price: 22.5,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1582719478193-d8561c4db338?auto=format&fit=crop&w=500&q=60',
    stock: 40,
  },
  {
    name: 'Gaming Mouse',
    slug: 'gaming-mouse',
    description: 'Ergonomic gaming mouse with adjustable DPI and RGB lights.',
    price: 35.0,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1611599535229-37fd7d11c8ef?auto=format&fit=crop&w=500&q=60',
    stock: 25,
  },
  {
    name: 'Office Chair',
    slug: 'office-chair',
    description: 'Comfortable ergonomic chair for home office and study.',
    price: 120.0,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1588894381685-9e1ad702d9da?auto=format&fit=crop&w=500&q=60',
    stock: 10,
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'UV protection sunglasses, stylish and lightweight.',
    price: 20.0,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1593032457867-4f7f7b6fef4d?auto=format&fit=crop&w=500&q=60',
    stock: 60,
  },
  {
    name: 'Notebook',
    slug: 'notebook',
    description: 'Hardcover notebook, 200 pages, perfect for school or work.',
    price: 7.5,
    category: 'Home & Office',
    image: 'https://images.unsplash.com/photo-1598300053467-6a2d045e1c0f?auto=format&fit=crop&w=500&q=60',
    stock: 80,
  },
  {
    name: 'Backpack',
    slug: 'backpack',
    description: 'Durable backpack, fits laptops up to 15 inches.',
    price: 45.0,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1599669474053-67bdfae2d9e3?auto=format&fit=crop&w=500&q=60',
    stock: 35,
  },
  {
    name: 'Waterproof Jacket',
    slug: 'waterproof-jacket',
    description: 'Keep dry in rain, breathable and lightweight waterproof jacket.',
    price: 59.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1589927986089-358123788d67?auto=format&fit=crop&w=500&q=60',
    stock: 20,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function seedProducts() {
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI. Set it in .env.local or .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const categoryNames = Array.from(new Set(DUMMY_PRODUCTS.map((p) => p.category)));
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};

    for (const name of categoryNames) {
      const slug = slugify(name);
      let category = await Category.findOne({ slug });
      if (!category) {
        category = await Category.create({ name, slug });
        console.log('Created category:', name);
      }
      categoryMap[name] = category._id as mongoose.Types.ObjectId;
    }

    let created = 0;
    let skipped = 0;

    for (const item of DUMMY_PRODUCTS) {
      const existing = await Product.findOne({ slug: item.slug });
      if (existing) {
        skipped++;
        continue;
      }
      await Product.create({
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        images: item.image ? [item.image] : [],
        category: categoryMap[item.category],
        stock: item.stock,
        featured: false,
      });
      created++;
      console.log('Created product:', item.name);
    }

    console.log(`Done. Created ${created} products, skipped ${skipped} (already exist).`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
