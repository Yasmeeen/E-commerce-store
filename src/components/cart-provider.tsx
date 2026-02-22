'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

type CartItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Cart = {
  items: CartItem[];
  _id?: string;
};

const CartContext = createContext<{
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  setCartFromResponse: (cart: Cart | null) => void;
  itemCount: number;
}>({
  cart: null,
  loading: true,
  refreshCart: async () => {},
  setCartFromResponse: () => {},
  itemCount: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const setCartFromResponse = useCallback((cartData: Cart | null) => {
    setCart(cartData);
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = cart?.items?.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, setCartFromResponse, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
