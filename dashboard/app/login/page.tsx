'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginUser } from '@/app/api/auth/api';
import { useDialog } from '@/components/context/DialogContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useDialog();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await loginUser(formData);
      showToast('Login successful! Redirecting...', 'success');
      // In a real app, you'd store the token here
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err: any) {
      showToast(err.message || 'Failed to authenticate', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center mx-auto shadow-lg mb-6">
                <span className="font-black text-2xl text-white italic">T</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Welcome Back</h1>
              <p className="text-sm font-medium text-zinc-500">Sign in to your account to continue.</p>
            </div>
  
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <Input 
                    name="password"
                    type="password"
                    placeholder="••••••••••"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
  
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
  
              <Button 
                type="submit" 
                full 
                disabled={loading}
                className="py-6 rounded-xl bg-sky-600 hover:bg-sky-500 shadow-lg text-sm font-bold"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
              </Button>
            </form>
  
            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-xs text-zinc-500 font-medium">
                Don't have an account?{' '}
                <Link href="/signup" className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors">
                  Sign Up
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
