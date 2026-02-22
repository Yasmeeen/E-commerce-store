'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    primaryColor: '#0f172a',
    logo: '',
    whatsappNumber: '',
    heroMediaType: '' as '' | 'image' | 'video',
    heroMediaUrl: '',
  });

  useEffect(() => {
    fetch('/api/store-config')
      .then((res) => res.json())
      .then((data) => {
        if (data.storeName) {
          setForm({
            storeName: data.storeName ?? '',
            primaryColor: data.primaryColor ?? '#0f172a',
            logo: data.logo ?? '',
            whatsappNumber: data.whatsappNumber ?? '',
            heroMediaType: (data.heroMediaType ?? '') as '' | 'image' | 'video',
            heroMediaUrl: data.heroMediaUrl ?? '',
          });
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/store-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        ...form,
        heroMediaType: form.heroMediaType || null,
        heroMediaUrl: form.heroMediaUrl || null,
      }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast({ title: 'Settings saved' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Store Settings</h1>
      <Card className="max-w-xl">
        <CardHeader>Basic settings</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store name</Label>
              <Input
                id="storeName"
                value={form.storeName}
                onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
                className="mt-1"
                placeholder="My Store"
              />
            </div>
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={form.logo}
                onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
                className="mt-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary color</Label>
              <div className="flex gap-2 mt-1">
                <input
                  type="color"
                  id="primaryColor"
                  value={form.primaryColor}
                  onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                  className="h-10 w-14 rounded border cursor-pointer"
                />
                <Input
                  value={form.primaryColor}
                  onChange={(e) => setForm((f) => ({ ...f, primaryColor: e.target.value }))}
                  placeholder="#0f172a"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp number (optional)</Label>
              <Input
                id="whatsappNumber"
                value={form.whatsappNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                className="mt-1"
                placeholder="+1234567890"
              />
            </div>
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium mb-2">Hero section (homepage)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Show an image or video in the first section of your store to attract customers.
              </p>
              <div className="space-y-3">
                <div>
                  <Label>Hero media type</Label>
                  <select
                    value={form.heroMediaType}
                    onChange={(e) => setForm((f) => ({ ...f, heroMediaType: e.target.value as '' | 'image' | 'video' }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                  >
                    <option value="">None</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                {(form.heroMediaType === 'image' || form.heroMediaType === 'video') && (
                  <div>
                    <Label htmlFor="heroMediaUrl">
                      {form.heroMediaType === 'image' ? 'Image URL' : 'Video URL'}
                    </Label>
                    <Input
                      id="heroMediaUrl"
                      type="url"
                      value={form.heroMediaUrl}
                      onChange={(e) => setForm((f) => ({ ...f, heroMediaUrl: e.target.value }))}
                      className="mt-1"
                      placeholder={form.heroMediaType === 'image' ? 'https://...' : 'https://... (e.g. .mp4)'}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
