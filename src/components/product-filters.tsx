'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Category = { _id: string; name: string; slug: string };

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const search = searchParams.get('search') ?? '';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const params = new URLSearchParams();
    const cat = (form.elements.namedItem('category') as HTMLSelectElement)?.value;
    const min = (form.elements.namedItem('minPrice') as HTMLInputElement)?.value;
    const max = (form.elements.namedItem('maxPrice') as HTMLInputElement)?.value;
    const q = (form.elements.namedItem('search') as HTMLInputElement)?.value;
    if (cat) params.set('category', cat);
    if (min) params.set('minPrice', min);
    if (max) params.set('maxPrice', max);
    if (q) params.set('search', q);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="w-full sm:w-48">
        <label className="text-xs text-muted-foreground block mb-1">Search</label>
        <Input name="search" placeholder="Search..." defaultValue={search} />
      </div>
      <div className="w-full sm:w-40">
        <label className="text-xs text-muted-foreground block mb-1">Category</label>
        <select
          name="category"
          defaultValue={category}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="w-32">
        <label className="text-xs text-muted-foreground block mb-1">Min price</label>
        <Input name="minPrice" type="number" min={0} placeholder="0" defaultValue={minPrice} />
      </div>
      <div className="w-32">
        <label className="text-xs text-muted-foreground block mb-1">Max price</label>
        <Input name="maxPrice" type="number" min={0} placeholder="Any" defaultValue={maxPrice} />
      </div>
      <Button type="submit">Filter</Button>
    </form>
  );
}
