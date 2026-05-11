import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Redirect to account page with orders tab active
export default function OrdersPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/account'); }, [router]);
  return null;
}
