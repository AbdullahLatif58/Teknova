'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CreditCard, User, Truck, MapPin, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { Order } from '@/types/order';
import { getOrderById, updateOrderStatus, cancelOrder } from '@/app/api/order/api';
import { useDialog } from '@/components/context/DialogContext';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { showToast, confirm } = useDialog();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(orderId);
      if (!data) {
        showToast('Order not found', 'error');
        router.push('/orders');
        return;
      }
      setOrder(data);
    } catch (err) {
      console.error('Failed to load order:', err);
      showToast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: "pending" | "processing" | "completed" | "cancelled") => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrder();
    } catch (err) {
      showToast(`Failed to update status`, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const isConfirmed = await confirm({
      title: 'Cancel Order',
      message: `Are you sure you want to cancel order #${order.id}? This will reverse processed payments and restock items if applicable.`,
      confirmLabel: 'Cancel Order',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    setUpdating(true);
    try {
      await cancelOrder(order.id);
      showToast(`Order #${order.id} has been cancelled`, 'success');
      loadOrder();
    } catch (err) {
      showToast(`Failed to cancel order`, 'error');
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center space-y-4 flex-col">
        <Loader2 className="animate-spin text-sky-500" size={32} />
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Loading Transaction Data...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
      <div className="flex justify-between items-center bg-[#0d0d14] p-4 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/orders')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
              Order <span className="text-sky-500">#{order.id}</span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-zinc-500 font-medium font-mono">
                {new Date(order.created_at || '').toLocaleString()}
              </span>
              {getStatusBadge(order.status)}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {order.status !== 'cancelled' && order.status !== 'completed' && (
            <div className="flex gap-2">
              {order.status === 'pending' && (
                <Button 
                  onClick={() => handleUpdateStatus('processing')} 
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-500"
                  icon={Clock}
                >
                  Process
                </Button>
              )}
              {order.status === 'processing' && (
                <Button 
                  onClick={() => handleUpdateStatus('completed')} 
                  disabled={updating}
                  className="bg-emerald-600 hover:bg-emerald-500"
                  icon={CheckCircle2}
                >
                  Complete
                </Button>
              )}
              <Button 
                onClick={handleCancelOrder} 
                disabled={updating}
                className="bg-rose-600/10 hover:bg-rose-600/20 text-rose-500"
                icon={XCircle}
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>
      </div>

      <Breadcrumb items={[
        { id: 'orders', label: 'Orders', href: '/orders' },
        { id: 'detail', label: `Order #${order.id}` }
      ]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <ShoppingCart size={14} className="text-sky-500" />
              Order Items
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a10] text-[9px] font-black uppercase text-zinc-600 border-b border-white/5">
                  <tr>
                    <th className="px-4 py-3">Product ID</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-200 text-sm">Product #{item.product_id}</span>
                            {item.variant_id && (
                              <span className="text-[10px] text-zinc-500 font-medium">Variant #{item.variant_id}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-zinc-400">
                          ${Number(item.unit_price).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-black text-sky-500">
                          x{item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right font-black text-white text-sm">
                          ${Number(item.final_price).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 italic text-sm">
                        No items found for this order. (Data may be incomplete)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-3 bg-[#0a0a10] p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-zinc-400">
                  <span>Subtotal</span>
                  <span>${Number(order.original_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-amber-500">
                  <span>Discount</span>
                  <span>-${Number(order.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-sky-400">${Number(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <User size={14} className="text-violet-500" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1">Name</p>
                <p className="text-sm font-bold text-zinc-200">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1">Contact Info</p>
                <p className="text-sm font-medium text-zinc-300">{order.customer_email}</p>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">{order.customer_mobile}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <CreditCard size={14} className="text-emerald-500" />
              Payment Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-400">Payment Status</span>
                {order.is_paid ? (
                  <Badge variant="success">Paid</Badge>
                ) : (
                  <Badge variant="danger">Unpaid</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-400">Method</span>
                <span className="text-xs font-bold text-white uppercase px-2 py-1 bg-white/5 rounded-md">
                  {order.payment_method}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Truck size={14} className="text-amber-500" />
              Fulfillment
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1 flex items-center gap-1">
                  <MapPin size={10} /> Shipping Address
                </p>
                <p className="text-xs leading-relaxed text-zinc-300 bg-[#0a0a10] p-3 rounded-xl border border-white/5">
                  {order.shipping_address || 'No shipping address provided.'}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-1 flex items-center gap-1">
                  <MapPin size={10} /> Billing Address
                </p>
                <p className="text-xs leading-relaxed text-zinc-500 bg-[#0a0a10] p-3 rounded-xl border border-white/5">
                  {order.billing_address || 'Same as shipping address.'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
