import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/services/product.service';
import { connectDB } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from '@/components/add-to-cart-button';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mt-2">
            {formatPrice(product.price)}
          </p>
          {product.description && (
            <p className="mt-4 text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          )}
          <div className="mt-8">
            <AddToCartButton productId={product._id.toString()} name={product.name} price={product.price} image={product.images?.[0]} />
          </div>
        </div>
      </div>
    </div>
  );
}
