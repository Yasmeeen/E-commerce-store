'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    fetch('/api/orders/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!stats) return <p className="text-muted-foreground">Could not load stats.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-muted-foreground">Pending Orders</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
