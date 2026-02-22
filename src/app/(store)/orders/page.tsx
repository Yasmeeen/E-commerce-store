import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { getOrderByNumber } from '@/services/order.service';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>
      <p className="text-muted-foreground mb-6">
        Enter your order number to view order details.
      </p>
      <OrderLookupForm />
    </div>
  );
}

async function OrderLookupForm() {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-medium">Look up order</h2>
      </CardHeader>
      <CardContent>
        <form action="/orders/lookup" method="GET" className="flex gap-2">
          <input
            type="text"
            name="orderNumber"
            placeholder="e.g. ORD-ABC123"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit">Find</Button>
        </form>
      </CardContent>
    </Card>
  );
}
