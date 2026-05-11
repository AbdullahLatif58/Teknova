'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, KeyRound } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { resetPassword } from '@/app/api/auth/api';
import { useDialog } from '@/components/context/DialogContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const { showToast } = useDialog();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Optionally alert the user if they land here without a token
    if (!token) {
      showToast('Missing clearance token. Please request a new reset link.', 'warning');
    }
  }, [token, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showToast('No valid token found in URL', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    
    try {
      await resetPassword(token, {
        newPassword: formData.password
      });
      showToast('Authorization Key updated securely! Redirecting to login...', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      showToast(err.message || 'Failed to update authorization key', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#0d0d14] border border-white/10 flex items-center justify-center mx-auto shadow-xl mb-6 text-sky-500">
              <KeyRound size={28} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Reset Password</h1>
            <p className="text-sm font-medium text-zinc-500">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-4">
              <Input 
                name="password"
                type="password"
                placeholder="••••••••"
                label="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input 
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                label="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              full 
              disabled={loading || !token}
              className="py-6 rounded-xl bg-sky-600 hover:bg-sky-500 shadow-lg text-sm font-bold mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
            </Button>
          </form>
          
          {!token && (
            <div className="pt-4 text-center">
               <Button onClick={() => router.push('/forgot-password')} variant="outline" size="sm">
                 Request New Token
               </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
