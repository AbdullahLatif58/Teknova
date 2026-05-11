'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users, Shield, UserCheck, UserMinus, ShoppingBag, Edit3, Loader2, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useDialog } from '@/components/context/DialogContext';
import { listUsers, deleteUser } from '@/app/api/auth/api';
import axiosClient from '@/utils/apiClient';

export default function UsersPage() {
  const { confirm, showToast } = useDialog();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, admins: 0, customers: 0, suspended: 0 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await listUsers();
      if (res.success && res.users) {
        setUsers(res.users);
        
        // Calculate stats
        const admins = res.users.filter((u: any) => u.role === 'admin').length;
        const customers = res.users.filter((u: any) => u.role === 'user').length;
        setStats({
          total: res.users.length,
          admins,
          customers,
          suspended: 0 // Backend doesn't have status yet
        });
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: 'Delete User',
      message: `Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        const res = await deleteUser(id);
        if (res.success) {
          showToast(`User "${name}" deleted successfully`, 'success');
          fetchUsers();
        }
      } catch (err) {
        showToast("Failed to delete user", "error");
      }
    }
  };

  const [editUser, setEditUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    try {
      const res = await axiosClient.patch(`/auth/users/${editUser.id}`, editUser);
      if (res.data.success) {
        showToast("User updated successfully", "success");
        setEditUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast("Failed to update user", "error");
    } finally {
      setEditing(false);
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
          <Users className="text-violet-600" />
          System <span className="text-violet-600">Users</span>
        </h2>
        <Button icon={Plus} variant="outline">Invite Administrator</Button>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-[#0d0d14] border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic mb-6">Edit User Context</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 block">Full Name</label>
                <input 
                  value={editUser.name} 
                  onChange={e => setEditUser({...editUser, name: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-violet-600 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 block">System Role</label>
                <select 
                  value={editUser.role} 
                  onChange={e => setEditUser({...editUser, role: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white outline-none focus:border-violet-600 transition-colors"
                >
                  <option value="user">User / Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-500" disabled={editing}>
                  {editing ? 'Saving...' : 'Update Identity'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { l: 'Total', v: stats.total, i: Users, c: 'bg-violet-500' },
          { l: 'Admins', v: stats.admins, i: Shield, c: 'bg-blue-500' },
          { l: 'Customers', v: stats.customers, i: UserCheck, c: 'bg-emerald-500' },
          { l: 'Suspended', v: stats.suspended, i: UserMinus, c: 'bg-rose-500' },
        ].map((s, i) => (
          <Card key={i} className="p-4 flex items-center gap-4">
            <div className={`p-3 ${s.c}/10 rounded-lg ${s.c.replace('bg-', 'text-')}`}><s.i size={20} /></div>
            <div>
              <h4 className="text-xl font-black text-zinc-900 dark:text-white">{s.v}</h4>
              <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{s.l}</p>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-[#0d0d14] text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-600 border-b border-zinc-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} />
                      <div>
                        <p className="font-black text-zinc-900 dark:text-zinc-200 text-sm leading-tight">{u.name}</p>
                        <p className="text-[10px] text-zinc-500 italic mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'admin' ? 'primary' : 'info'}>{u.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditUser(u)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                        onClick={() => handleDelete(u.id, u.name)}
                      >
                        <Trash2 size={16} />
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
