'use client';

import React from 'react';
import { Plus, Users, Shield, UserCheck, UserMinus, ShoppingBag, Edit3 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { dummyUsers } from '@/lib/data';
import { useDialog } from '@/components/context/DialogContext';


export default function UsersPage() {
  const { confirm, showToast } = useDialog();

  const handleStatusToggle = async (name: string, currentStatus: string) => {
    const action = currentStatus === 'Active' ? 'suspend' : 'activate';
    const isConfirmed = await confirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} user "${name}"?`,
      confirmLabel: action.charAt(0).toUpperCase() + action.slice(1),
      cancelLabel: 'Cancel',
      variant: action === 'suspend' ? 'danger' : 'primary',
    });

    if (isConfirmed) {
      showToast(`User "${name}" ${action}ed successfully`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">System Users</h2>
        <Button icon={Plus} variant="outline">Invite Administrator</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { l: 'Total', v: 8, i: Users, c: 'bg-violet-500' },
          { l: 'Admins', v: 2, i: Shield, c: 'bg-blue-500' },
          { l: 'Customers', v: 6, i: UserCheck, c: 'bg-emerald-500' },
          { l: 'Suspended', v: 1, i: UserMinus, c: 'bg-rose-500' },
        ].map((s, i) => (
          <Card key={i} className="p-4 flex items-center gap-4">
            <div className={`p-3 ${s.c}/10 rounded-lg ${s.c.replace('bg-', 'text-')}`}><s.i size={20} /></div>
            <div>
              <h4 className="text-xl font-black text-white">{s.v}</h4>
              <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{s.l}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-600 border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dummyUsers.map(u => (
                <tr key={u.id} className={`hover:bg-white/5 transition-colors group ${u.status === 'Suspended' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} color={u.color} />
                      <div>
                        <p className="font-black text-zinc-200 text-sm leading-tight">{u.name}</p>
                        <p className="text-[10px] text-zinc-500 italic mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'Admin' ? 'primary' : 'info'}>{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-zinc-600 uppercase italic">
                    <ShoppingBag size={12} className="inline mr-1 text-violet-600" /> {u.orders}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">{u.joined}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit3 size={16} /></button>
                      <button 
                        className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                        onClick={() => handleStatusToggle(u.name, u.status)}
                      >
                        {u.status === 'Active' ? <UserMinus size={16} /> : <UserCheck size={16} />}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
