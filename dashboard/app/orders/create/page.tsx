'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Plus, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { createOrder } from '@/app/api/order/api';
import { useDialog } from '@/components/context/DialogContext';

export default function CreateOrderPage() {
  const router = useRouter();
  const { showToast } = useDialog();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_mobile: '',
    payment_method: 'card' as "cash" | "card" | "wallet" | "online",
    shipping_address: '',
    billing_address: '',
  });

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [manualTotal, setManualTotal] = useState('');

  React.useEffect(() => {
    const fetchProducts = async () => {
       try {
         const { listProducts } = require('@/app/api/product/api');
         const res = await listProducts(1, 10);
         const fetched = res.products || res.data || [];
         setProducts(fetched);
         if (fetched.length > 0) setSelectedProductId(fetched[0].id);
       } catch (e) { console.error(e); }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_email || !manualTotal || !selectedProductId) {
      showToast('Please fill out all required fields and ensure products exist', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        original_amount: parseFloat(manualTotal),
        total_amount: parseFloat(manualTotal),
        discount_amount: 0,
        status: "pending" as any,
        is_paid: false as any,

        items: [
          {
            product_id: selectedProductId,
            quantity: 1,
            unit_price: parseFloat(manualTotal),
            final_price: parseFloat(manualTotal),
          }
        ]
      };

      const res = await createOrder(orderData);
      showToast('Manual order created successfully', 'success');
      // @ts-ignore
      router.push(`/orders/${res.order?.id || res.data?.id || res.id || res.order_id}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/orders')}
            className="p-2 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl text-zinc-500 dark:text-zinc-400 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">
              Manual Order Entry
            </h2>
          </div>
        </div>
      </div>

      <Breadcrumb items={[
        { id: 'orders', label: 'Orders', href: '/orders' },
        { id: 'create', label: 'Create Entry' }
      ]} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4 border-b border-zinc-100 dark:border-white/5 pb-3">
            Customer Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Customer Name *"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <Input
              label="Email Address *"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="customer@domain.com"
              required
            />
            <Input
              label="Mobile Number"
              name="customer_mobile"
              value={formData.customer_mobile}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4 border-b border-zinc-100 dark:border-white/5 pb-3">
            Transaction Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Total Charge Amount *"
              type="number"
              step="0.01"
              value={manualTotal}
              onChange={(e) => setManualTotal(e.target.value)}
              placeholder="0.00"
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Select Product *</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-12 bg-zinc-50 dark:bg-[#0a0a10] border border-zinc-200 dark:border-white/5 rounded-2xl px-4 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
                required
              >
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title} (${p.price})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full h-12 bg-zinc-50 dark:bg-[#0a0a10] border border-zinc-200 dark:border-white/5 rounded-2xl px-4 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
              >
                <option value="card">Credit / Debit Card</option>
                <option value="wallet">Digital Wallet</option>
                <option value="cash">Cash on Delivery</option>
                <option value="online">Online Transfer</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4 border-b border-zinc-100 dark:border-white/5 pb-3">
            Fulfillment Details
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Shipping Address"
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              placeholder="Full shipping block..."
            />
            <Input
              label="Billing Address"
              name="billing_address"
              value={formData.billing_address}
              onChange={handleChange}
              placeholder="Leave blank if same as shipping..."
            />
          </div>
        </Card>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-500 py-6 px-10 text-sm shadow-[0_10px_30px_rgba(124,58,237,0.3)] min-w-[200px]">
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order Registration'}
          </Button>
        </div>
      </form>
    </div>
  );
}
