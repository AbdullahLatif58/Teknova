'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Eye, TrendingUp, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Order } from '@/types/order';
import { getOrders } from '@/app/api/order/api';
import { useDialog } from '@/components/context/DialogContext';

export default function OrdersPage() {
  const router = useRouter();
  const { showToast } = useDialog();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders(1, 100);
      setOrders(res.orders || res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'processing': return <Badge variant="info">Processing</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'cancelled': return <Badge variant="danger">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
            <ShoppingCart className="text-violet-600" size={28} />
            Order <span className="text-violet-600">Management</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium italic">
            Monitor and process customer transactions.
          </p>
        </div>
        <Button 
          onClick={() => router.push('/orders/create')} 
          className="bg-violet-600 hover:bg-violet-500 shadow-[0_10px_30px_rgba(124,58,237,0.3)] transition-all"
        >
          Manual Entry
        </Button>
      </div>

      <Breadcrumb items={[
        { id: 'orders', label: 'Orders' }
      ]} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 border-b border-zinc-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <Loader2 className="animate-spin text-sky-500 mx-auto" size={24} />
                    <p className="text-xs text-zinc-500 mt-3 font-medium uppercase tracking-widest">Fetching Ledgers...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-zinc-500 font-medium italic">
                    <div className="flex flex-col items-center gap-2">
                      <TrendingUp size={24} className="text-zinc-700" />
                      <p>No transactions recorded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900 dark:text-zinc-200 text-sm">{order.customer_name}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{order.customer_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-black text-zinc-900 dark:text-white text-sm">
                      ${Number(order.total_amount).toFixed(2)}
                      {order.is_paid ? (
                        <span className="ml-2 text-[9px] uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Paid</span>
                      ) : (
                        <span className="ml-2 text-[9px] uppercase tracking-widest text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">Unpaid</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="p-2 text-zinc-500 hover:text-violet-600 transition-colors bg-zinc-100 dark:bg-white/5 hover:bg-violet-600/10 rounded-lg inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
