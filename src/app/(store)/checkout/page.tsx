import { CheckoutForm } from '@/components/checkout-form';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Checkout (Cash on Delivery)</h1>
      <CheckoutForm />
    </div>
  );
}
