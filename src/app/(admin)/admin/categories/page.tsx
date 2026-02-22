'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

type Category = { _id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  function fetchCategories() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setCategories(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function createCategory(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token || !newName.trim()) return;
    setSubmitting(true);
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName.trim() }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create');
        setNewName('');
        toast({ title: 'Category created' });
        fetchCategories();
      })
      .catch(() => toast({ title: 'Error', variant: 'destructive' }))
      .finally(() => setSubmitting(false));
  }

  function deleteCategory(id: string) {
    const token = localStorage.getItem('adminToken');
    if (!token || !confirm('Delete this category?')) return;
    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete');
        toast({ title: 'Category deleted' });
        fetchCategories();
      })
      .catch(() => toast({ title: 'Error', variant: 'destructive' }));
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      <Card className="max-w-md mb-6">
        <CardContent className="pt-6">
          <form onSubmit={createCategory} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="name" className="sr-only">New category</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <Button type="submit" disabled={submitting || !newName.trim()}>
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c._id} className="flex items-center justify-between py-2 border-b">
            <span>{c.name}</span>
            <Button size="sm" variant="ghost" onClick={() => deleteCategory(c._id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>
      {categories.length === 0 && (
        <p className="text-muted-foreground">No categories yet. Add one above.</p>
      )}
    </div>
  );
}
