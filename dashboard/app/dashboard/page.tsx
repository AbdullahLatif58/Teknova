'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart, ShoppingBag, Package, Users, TrendingUp, Plus, RefreshCcw,
  Palette, Terminal
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { dummyOrders, CHART_DATA } from '@/lib/data';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '$84,320', trend: '+12.5%', icon: ShoppingCart },
          { label: 'Total Orders', value: '1,247', trend: '+8.2%', icon: ShoppingBag },
          { label: 'Active Products', value: '342', trend: '+3.1%', icon: Package },
          { label: 'Total Users', value: '8,910', trend: '+5.7%', icon: Users },
        ].map((s, i) => (
          <Card key={i} className="p-5 backdrop-blur-sm border-l-4 border-l-violet-600 group hover:translate-y-[-2px]">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-violet-600/10 rounded-lg text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                <s.icon size={20} />
              </div>
              <Badge variant="success">{s.trend}</Badge>
            </div>
            <div className="mt-4">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px]">{s.label}</p>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-white uppercase tracking-wider">
            <TrendingUp size={18} className="text-violet-500" /> Sales Analytics
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1e2e" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111118', borderColor: '#1e1e2e', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-white uppercase tracking-wider">
            <ShoppingCart size={18} className="text-violet-500" /> Recent Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase text-zinc-600 border-b border-white/5">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dummyOrders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push('/orders')}>
                    <td className="py-4 text-[11px] font-mono font-bold text-violet-400">{o.id}</td>
                    <td className="py-4 text-xs font-bold text-zinc-300">{o.customer}</td>
                    <td className="py-4 text-xs font-black text-emerald-400">${o.total}</td>
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
          <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-white uppercase tracking-wider">
            <Palette size={18} className="text-violet-500" /> Activity Feed
          </h3>
          <div className="space-y-6">
            {[
              { user: 'Ali Hassan', act: 'added new Product', target: 'Nike Air Max', time: '5m ago', icon: Plus, color: 'text-violet-500' },
              { user: 'Sara Khan', act: 'placed Order', target: '#TKV-0098', time: '12m ago', icon: ShoppingBag, color: 'text-blue-500' },
              { user: 'System', act: 'synced API Products', target: 'Amazon', time: '45m ago', icon: RefreshCcw, color: 'text-emerald-500' },
              { user: 'Bilal Ahmed', act: 'activated Template', target: 'Minimal Dark', time: '1h ago', icon: Palette, color: 'text-amber-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group">
                <div className={`mt-1 ${item.color}`}><item.icon size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-zinc-200">
                    <span className="text-white">{item.user}</span> {item.act} <span className="text-violet-400">{item.target}</span>
                  </p>
                  <p className="text-[10px] font-black text-zinc-600 uppercase mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/products')}>
            <div className="p-4 bg-violet-600/10 rounded-full text-violet-500 group-hover:bg-violet-600 group-hover:text-white transition-all"><Plus size={24}/></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quick Add Product</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/logs')}>
            <div className="p-4 bg-emerald-600/10 rounded-full text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Terminal size={24}/></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Check API Status</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/templates')}>
            <div className="p-4 bg-amber-600/10 rounded-full text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all"><Palette size={24}/></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Switch Template</p>
          </Card>
          <Card className="p-6 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-violet-600" onClick={() => router.push('/orders')}>
            <div className="p-4 bg-blue-600/10 rounded-full text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all"><ShoppingCart size={24}/></div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Recent Sales</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
