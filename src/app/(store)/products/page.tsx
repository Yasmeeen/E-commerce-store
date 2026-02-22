import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/services/product.service';
import { getCategories } from '@/services/category.service';
import { connectDB } from '@/lib/db';
import { ProductFilters } from '@/components/product-filters';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type SearchParams = { category?: string; minPrice?: string; maxPrice?: string; search?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connectDB();
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      category: params.category,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      search: params.search,
    }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <ProductFilters categories={categories} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {products.map((product: { _id: string; name: string; slug: string; price: number; images?: string[] }) => (
          <Card key={product._id} className="overflow-hidden">
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
      {products.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      )}
    </div>
  );
}
