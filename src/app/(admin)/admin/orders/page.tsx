'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatPrice } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

type Order = {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string; address: string };
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('__all__');
  const { toast } = useToast();

  function fetchOrders() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setLoading(true);
    const url = statusFilter && statusFilter !== '__all__' ? `/api/orders?status=${statusFilter}` : '/api/orders';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setOrders(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  function updateStatus(orderId: string, status: OrderStatus) {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update');
        toast({ title: 'Order updated', description: `Status set to ${status}` });
        fetchOrders();
      })
      .catch(() => toast({ title: 'Error', variant: 'destructive' }));
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{order.customer.name} · {order.customer.email}</p>
                <p className="text-sm font-semibold mt-1">{formatPrice(order.total)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm capitalize px-2 py-1 rounded bg-muted">{order.status}</span>
                <Select
                  value={order.status}
                  onValueChange={(v) => updateStatus(order._id, v as OrderStatus)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {orders.length === 0 && (
        <p className="text-muted-foreground text-center py-12">No orders found.</p>
      )}
    </div>
  );
}
