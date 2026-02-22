'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/components/cart-provider';
import { cn } from '@/lib/utils';

type CartItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Cart = { items: CartItem[] } | null;

export function CartDrawer({
  open,
  onOpenChange,
  cart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: Cart;
}) {
  const { refreshCart } = useCart();
  const total = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l bg-background shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Dialog.Title className="text-lg font-semibold">Cart</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon">×</Button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {!cart?.items?.length ? (
                <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map((item) => (
                    <li key={item.product} className="flex gap-3 border-b pb-4">
                      <div className="relative w-16 h-16 rounded bg-muted shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover rounded" sizes="64px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">—</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cart?.items?.length ? (
              <div className="p-4 border-t space-y-2">
                <p className="font-semibold">Total: {formatPrice(total)}</p>
                <Button asChild className="w-full">
                  <Link href="/checkout" onClick={() => onOpenChange(false)}>Checkout</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
