'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/cart-provider';
import { useToast } from '@/components/ui/use-toast';

export function AddToCartButton({
  productId,
  name,
  price,
  image,
}: {
  productId: string;
  name: string;
  price: number;
  image?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { refreshCart, setCartFromResponse } = useCart();
  const { toast } = useToast();

  async function addToCart() {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) throw new Error('Failed to add to cart');
      const updatedCart = await res.json();
      setCartFromResponse(updatedCart);
      toast({ title: 'Added to cart', description: `${name} × ${quantity}` });
    } catch {
      toast({ title: 'Error', description: 'Could not add to cart', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Qty</label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="w-20"
        />
      </div>
      <Button onClick={addToCart} disabled={loading}>
        {loading ? 'Adding…' : 'Add to Cart'}
      </Button>
    </div>
  );
}
