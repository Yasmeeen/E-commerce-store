import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { getStoreConfig } from '@/services/store-config.service';
import { getProducts } from '@/services/product.service';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await connectDB();
  const [config, featuredProducts] = await Promise.all([
    getStoreConfig(),
    getProducts({ featured: true }),
  ]);

  const hasHeroMedia = config?.heroMediaType && config?.heroMediaUrl;

  return (
    <div>
      <section
        className={`relative border-b min-h-[320px] md:min-h-[620px] flex items-center overflow-hidden ${
          hasHeroMedia ? '' : 'bg-muted/50'
        }`}
      >
        {hasHeroMedia && config?.heroMediaType === 'video' && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={config.heroMediaUrl!}
            aria-hidden
          />
        )}
        {hasHeroMedia && config?.heroMediaType === 'image' && (
          <img
            src={config.heroMediaUrl!}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden
          />
        )}
        {hasHeroMedia && <div className="absolute inset-0 bg-black/40" aria-hidden />}
        <div className="container relative mx-auto px-4 py-16 md:py-24 z-10">
          <div className="max-w-2xl">
            <h1
              className={`text-4xl font-bold tracking-tight md:text-5xl ${
                hasHeroMedia ? 'text-white drop-shadow-md' : ''
              }`}
            >
              Welcome to {config?.storeName ?? 'Store'}
            </h1>
            <p
              className={`mt-4 text-lg ${
                hasHeroMedia ? 'text-white/95 drop-shadow-md' : 'text-muted-foreground'
              }`}
            >
              Quality products, delivered to your door. Cash on delivery available.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={String(product._id)} className="overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-square relative bg-muted">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-primary font-semibold mt-1">{formatPrice(product.price)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/products/${product.slug}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </section>
      )}

      {featuredProducts.length === 0 && (
        <section className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          <p>No featured products yet. Check back soon!</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
