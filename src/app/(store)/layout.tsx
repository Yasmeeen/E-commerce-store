import { StoreConfigProvider } from '@/components/store-config-provider';
import { StoreHeader } from '@/components/store-header';
import { CartProvider } from '@/components/cart-provider';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreConfigProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <StoreHeader />
          <main className="flex-1">{children}</main>
        </div>
      </CartProvider>
    </StoreConfigProvider>
  );
}
