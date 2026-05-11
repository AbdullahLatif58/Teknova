'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { requestPasswordReset } from '@/app/api/auth/api';
import { useDialog } from '@/components/context/DialogContext';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useDialog();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await requestPasswordReset(email);
      setIsSent(true);
      showToast('Reset signals dispatched successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to dispatch reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          
          <div className="flex items-center">
            <Link href="/login" className="text-zinc-500 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5">
              <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {isSent ? 'Email Sent' : 'Forgot Password?'}
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              {isSent 
                ? 'Check your inbox. A password reset link has been sent.' 
                : 'Enter your email address. We will send you a password reset link.'}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input 
                name="email"
                type="email"
                placeholder="admin@example.com"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button 
                type="submit" 
                full 
                disabled={loading}
                className="py-6 rounded-xl bg-sky-600 hover:bg-sky-500 shadow-lg text-sm font-bold mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-in zoom-in duration-500">
                <MailCheck size={32} />
              </div>
              <Button 
                onClick={() => router.push('/login')} 
                full 
                variant="outline"
                className="py-6 rounded-xl text-sm font-bold"
              >
                Return to Login
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
