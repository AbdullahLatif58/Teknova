import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Login is handled inside /account page, redirect there
    router.replace('/account');
  }, [router]);

  return null;
}
