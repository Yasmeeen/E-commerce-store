'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/cart-provider';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export function CheckoutForm() {
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const total = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cart?.items?.length) {
      toast({ title: 'Cart is empty', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          items: cart.items.map((i) => ({ productId: i.product, quantity: i.quantity })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Checkout failed');
      }
      const order = await res.json();
      await refreshCart();
      toast({ title: 'Order placed', description: `Order ${order.orderNumber} confirmed.`, variant: 'success' });
      router.push(`/order-confirmation/${encodeURIComponent(order.orderNumber)}`);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Could not place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (!cart?.items?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Your cart is empty. Add items from the store.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="address">Delivery Address</Label>
            <textarea
              id="address"
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Total: {formatPrice(total)}</p>
        <p className="text-sm text-muted-foreground">Cash on Delivery</p>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Placing order…' : 'Place Order'}
      </Button>
    </form>
  );
}
