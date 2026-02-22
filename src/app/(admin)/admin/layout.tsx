'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  Store,
} from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('adminToken');
    if (!token && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [mounted, pathname, router]);

  function logout() {
    localStorage.removeItem('adminToken');
    router.replace('/admin/login');
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/admin" className="font-semibold flex items-center gap-2">
            <Store className="h-5 w-5" /> Admin
          </Link>
        </div>
        <nav className="p-2 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
