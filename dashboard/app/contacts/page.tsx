'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Loader2, MessageSquare, Clock, User } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useDialog } from '@/components/context/DialogContext';
import axiosClient from "@/utils/apiClient";

export default function ContactsPage() {
  const { confirm, showToast } = useDialog();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/contacts");
      if (res.data.success) {
        setContacts(res.data.contacts);
      }
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Inquiry',
      message: 'Are you sure you want to delete this contact message?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        await axiosClient.delete(`/contacts/${id}`);
        showToast("Inquiry deleted", "success");
        fetchContacts();
      } catch (err) {
        showToast("Failed to delete", "error");
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
          <MessageSquare className="text-violet-600" />
          Contact <span className="text-violet-600">Inquiries</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <Card key={c.id} className="p-6 group">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-violet-600/10 rounded-xl text-violet-500 h-fit">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-zinc-900 dark:text-white text-lg">{c.subject || 'No Subject'}</h4>
                      <Badge variant={c.status === 'new' ? 'primary' : 'info'}>{c.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1"><User size={12}/> {c.name}</span>
                      <span className="flex items-center gap-1 text-violet-400"><Mail size={12}/> {c.email}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed bg-zinc-50 dark:bg-white/5 p-4 rounded-lg border border-zinc-200 dark:border-white/5">
                      {c.message}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => handleDelete(c.id)}
                     className="p-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-20 text-center text-zinc-500 italic">
            No contact inquiries found.
          </Card>
        )}
      </div>
    </div>
  );
}
