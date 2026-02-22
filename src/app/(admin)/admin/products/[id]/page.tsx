'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Category = { _id: string; name: string; slug: string };

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '0',
    featured: false,
    images: '',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setCategories(data));
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setForm({
            name: data.name ?? '',
            description: data.description ?? '',
            price: String(data.price ?? ''),
            category: data.category?._id ?? data.category ?? '',
            stock: String(data.stock ?? 0),
            featured: data.featured ?? false,
            images: Array.isArray(data.images) ? data.images.join('\n') : '',
          });
        }
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setLoading(true);
    try {
      const images = form.images ? form.images.split(/\s+/).filter(Boolean) : [];
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: (form.category && form.category !== '__none__') ? form.category : undefined,
          stock: Number(form.stock) || 0,
          featured: form.featured,
          images,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update');
      }
      toast({ title: 'Product updated' });
      router.push('/admin/products');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Could not update product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">← Back</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
      </div>
      <Card className="max-w-xl">
        <CardHeader>Product details</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min={0}
                required
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={form.category || '__none__'}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v === '__none__' ? '' : v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="images">Image URLs (one per line)</Label>
              <textarea
                id="images"
                rows={2}
                value={form.images}
                onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-input"
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
