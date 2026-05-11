'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signupUser } from '@/app/api/auth/api';
import { useDialog } from '@/components/context/DialogContext';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useDialog();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    
    try {
      await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      showToast('Registration successful! Welcome.', 'success');
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err: any) {
      showToast(err.message || 'Failed to complete registration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Create an Account</h1>
            <p className="text-sm font-medium text-zinc-500">Sign up to get started.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <Input 
                name="name"
                placeholder="Full Name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input 
                name="email"
                type="email"
                placeholder="email@example.com"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Input 
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              full 
              disabled={loading}
              className="py-6 rounded-xl bg-sky-600 hover:bg-sky-500 shadow-lg text-sm font-bold mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
            </Button>
          </form>

          <div className="pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-400 hover:text-sky-300 font-bold ml-1 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
