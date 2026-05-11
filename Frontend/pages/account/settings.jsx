import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AccountSettingsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/account'); }, [router]);
  return null;
}
