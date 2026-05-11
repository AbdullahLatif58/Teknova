'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, ShoppingBag, Package, Users, TrendingUp, Plus, RefreshCcw,
  Palette, Terminal, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { dummyOrders, CHART_DATA } from '@/lib/data';
import { getDashboardSummary } from '@/app/api/analytics/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardSummary();
        if (data.success) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500 animate-pulse">Syncing Dashboard Data...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: stats?.metrics?.totalRevenue ? `$${stats.metrics.totalRevenue.toLocaleString()}` : '$0', trend: '', icon: ShoppingCart },
    { label: 'Total Orders', value: stats?.metrics?.totalOrders || '0', trend: '', icon: ShoppingBag },
    { label: 'Active Products', value: stats?.metrics?.activeProducts || '0', trend: '', icon: Package },
    { label: 'Total Users', value: stats?.metrics?.totalUsers || '0', trend: '', icon: Users },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="p-5 backdrop-blur-sm border-l-4 border-l-violet-600 group hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-violet-600/10 rounded-lg text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                <s.icon size={20} />
              </div>
              {s.trend && <Badge variant="success">{s.trend}</Badge>}
            </div>
            <div className="mt-4">
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[2px]">{s.label}</p>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mt-1 tracking-tight">{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-wider">
            <TrendingUp size={18} className="text-violet-500" /> Sales <span className="text-violet-500">Analytics</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--tw-card-bg, #ffffff)', borderColor: 'var(--tw-border-color, #e4e4e7)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'currentColor' }}
                  className="dark:!bg-[#111118] dark:!border-[#1e1e2e]"
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-wider">
            <ShoppingCart size={18} className="text-violet-500" /> Recent <span className="text-violet-500">Orders</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 border-b border-zinc-200 dark:border-white/5">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                {(stats?.recentOrders || []).slice(0, 5).map((o: any) => (
                  <tr key={o.id} className="hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push('/orders')}>
                    <td className="py-4 text-[11px] font-mono font-bold text-violet-600 dark:text-violet-400">{o.id}</td>
                    <td className="py-4 text-xs font-bold text-zinc-700 dark:text-zinc-300">{o.customer_name || o.customer}</td>
                    <td className="py-4 text-xs font-black text-emerald-600 dark:text-emerald-400">${o.total_amount || o.total}</td>
                    <td className="py-4"><Badge variant={o.status === 'Delivered' ? 'success' : 'warning'}>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-zinc-900 dark:text-white uppercase tracking-wider">
            <Palette size={18} className="text-violet-500" /> Activity <span className="text-violet-500">Feed</span>
          </h3>
          <div className="space-y-6">
            {stats?.activityFeed && stats.activityFeed.length > 0 ? (
              stats.activityFeed.map((log: any, i: number) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 text-violet-500"><Terminal size={16} /></div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {log.message}
                    </p>
                    <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-600 uppercase mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic text-center py-10">No recent activity logs found.</p>
            )}
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/products')}>
            <div className="p-4 bg-violet-600/10 rounded-full text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all"><Plus size={24} /></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quick Add Product</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/logs')}>
            <div className="p-4 bg-emerald-600/10 rounded-full text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Terminal size={24} /></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Check API Status</p>
          </Card>
          {/* <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/templates')}>
            <div className="p-4 bg-amber-600/10 rounded-full text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all"><Palette size={24}/></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Switch Template</p>
          </Card> */}
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/orders')}>
            <div className="p-4 bg-blue-600/10 rounded-full text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><ShoppingCart size={24} /></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recent Sales</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
