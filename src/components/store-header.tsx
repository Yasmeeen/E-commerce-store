'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoreConfig } from '@/components/store-config-provider';
import { useCart } from '@/components/cart-provider';
import { CartDrawer } from '@/components/cart-drawer';

export function StoreHeader() {
  const config = useStoreConfig();
  const { itemCount, cart } = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);
  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
        style={{ ['--primary' as string]: config.primaryColor }}
      >
        <div className="container flex h-14 items-center px-5">
          <Link href="/" className="font-semibold">
            {config.logo ? (
              <img src={config.logo} alt={config.storeName} className="h-8" />
            ) : (
              config.storeName
            )}
          </Link>
          <nav className="ml-auto flex items-center gap-4">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="relative overflow-visible"
              onClick={() => setCartOpen(true)}
              aria-label={`Cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center ring-2 ring-background">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} cart={cart} />
    </>
  );
}
