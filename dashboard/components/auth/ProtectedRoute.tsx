'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.split('; ').some(row => row.trim().startsWith('accessToken='));
    if (!loading && !user && !hasToken) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return <>{children}</>;
}
