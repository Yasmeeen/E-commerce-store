'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Product = {
  _id: string | { toString(): string };
  name: string;
  slug: string;
  price: number;
  images?: string[];
  featured?: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  function fetchProducts() {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setProducts(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function deleteProduct(id: string) {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    if (!confirm('Delete this product?')) return;
    fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete');
        toast({ title: 'Product deleted' });
        fetchProducts();
      })
      .catch(() => toast({ title: 'Error', variant: 'destructive' }));
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={String(p._id)} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="200px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
              )}
            </div>
            <CardContent className="p-4">
              <p className="font-medium">{p.name}</p>
              <p className="text-primary font-semibold">{formatPrice(p.price)}</p>
              <div className="flex gap-2 mt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/products/${String(p._id)}`}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteProduct(String(p._id))}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No products yet.</p>
      )}
    </div>
  );
}
