# E-commerce Store Template

Production-ready Next.js 14 e-commerce template for small local stores. **COD (Cash on Delivery) only** in v1, with payment fields ready for future gateway integration.

## Features

- **Public store**: Home (hero + featured products), product listing with filters, product detail, cart drawer, checkout (COD), order confirmation, optional order lookup
- **Admin panel**: Login, dashboard (orders/revenue/pending), CRUD products, CRUD categories, orders list with status update (Pending → Delivered), store settings (name, logo, primary color, WhatsApp)
- **Backend**: Next.js API routes, MongoDB (Atlas free tier), JWT auth, role-based admin access, centralized error handling, Zod validation, Cloudinary-ready uploads

## Tech Stack

- Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui (Radix)
- MongoDB Atlas, Mongoose, JWT, bcryptjs, Zod, Cloudinary

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `MONGODB_URI` (MongoDB Atlas connection string)
   - Set `JWT_SECRET` (strong secret for production)
   - Optional: Cloudinary keys for image uploads; otherwise use image URLs in product form

3. **First admin user**
   - Register via API: `POST /api/auth/register` with `{ "email", "password", "name", "role": "admin" }`
   - Or create a user in MongoDB with `role: "admin"` and a bcrypt-hashed password

4. **Run**
   ```bash
   npm run dev
   ```
   - Store: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Project structure

```
src/
  app/
    (store)/          # Public store routes
    (admin)/admin/    # Admin panel routes
    api/              # API routes (auth, products, categories, orders, cart, store-config, upload)
  components/        # UI (shadcn) + store header, cart, checkout, etc.
  lib/               # db, auth, validations, errors, cloudinary, api-middleware
  models/            # Mongoose: User, Product, Category, Order, StoreConfig, Cart
  services/          # Business logic (auth, product, category, order, cart, store-config)
```

## API overview

| Method | Route | Auth | Description |
|--------|--------|------|-------------|
| POST | /api/auth/login | - | Login (returns JWT) |
| POST | /api/auth/register | - | Register (optional role) |
| GET/PUT | /api/store-config | GET public, PUT admin | Store settings |
| GET/POST | /api/products | GET public, POST admin | List / create products |
| GET/PUT/DELETE | /api/products/[id] | GET public, PUT/DELETE admin | Product by id |
| GET | /api/products/slug/[slug] | - | Product by slug (public) |
| GET/POST | /api/categories | GET public, POST admin | Categories |
| GET/PUT/DELETE | /api/categories/[id] | Admin | Category CRUD |
| GET/POST | /api/cart | - | Cart (session cookie) |
| PATCH/DELETE | /api/cart | - | Update/clear cart |
| POST | /api/orders | - | Create order (checkout) |
| GET | /api/orders | Admin | List orders |
| GET | /api/orders/stats | Admin | Dashboard stats |
| GET/PATCH | /api/orders/[id] | GET public, PATCH admin | Order by id / update status |
| GET | /api/orders/number/[orderNumber] | - | Order by number (confirmation) |
| POST | /api/upload | Admin | Cloudinary upload (base64 image) |

## Payment (future)

Order model already includes:
- `paymentMethod: 'cod' | 'card'`
- `paymentStatus: 'pending' | 'paid' | 'failed'`

Use these when integrating a payment gateway; v1 uses COD only.

## Deploy

- **Hosting**: Vercel, Netlify, or any Node host
- **Database**: MongoDB Atlas (free tier)
- Set all env vars in the host; ensure `NEXT_PUBLIC_APP_URL` is your production URL

## License

Private / commercial as needed.
