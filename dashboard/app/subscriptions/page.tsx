'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Loader2, Users, Download, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useDialog } from '@/components/context/DialogContext';
import axiosClient from "@/utils/apiClient";
import Button from '@/components/ui/Button';

export default function SubscriptionsPage() {
  const { confirm, showToast } = useDialog();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/subscriptions");
      if (res.data.success) {
        setSubs(res.data.subscribers);
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Remove Subscriber',
      message: 'Are you sure you want to remove this email from the subscription list?',
      confirmLabel: 'Remove',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        await axiosClient.delete(`/subscriptions/${id}`);
        showToast("Subscriber removed", "success");
        fetchSubs();
      } catch (err) {
        showToast("Failed to remove", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-2">
          <Mail className="text-violet-600" />
          Newsletter <span className="text-violet-600">Subscribers</span>
        </h2>
        <Button icon={Download} variant="outline" size="sm">Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg"><Users size={20} /></div>
            <div>
              <h4 className="text-xl font-black text-zinc-900 dark:text-white">{subs.length}</h4>
              <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Active Subscribers</p>
            </div>
          </Card>
      </div>

        <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 border-b border-zinc-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Subscriber Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Subscribed At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {subs.length > 0 ? subs.map(s => (
                <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-emerald-500 transition-colors">
                        <Mail size={16} />
                      </div>
                      <span className="font-black text-zinc-900 dark:text-zinc-200 text-sm">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={s.is_active ? 'success' : 'danger'}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-zinc-500 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-zinc-500 italic">No subscribers yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
