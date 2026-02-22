import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/services/order.service';
import { connectDB } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  await connectDB();
  const { orderNumber } = await params;
  let order;
  try {
    order = await getOrderByNumber(decodeURIComponent(orderNumber));
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-semibold">Order Confirmed</h1>
          <p className="text-muted-foreground">
            Order <strong>{order.orderNumber}</strong> has been placed. We will contact you for delivery.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Delivery address</p>
            <p>{order.customer.address}</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex gap-4">
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/orders">View Order History</Link>
        </Button>
      </div>
    </div>
  );
}
