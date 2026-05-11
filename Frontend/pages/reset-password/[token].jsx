import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import { Eye, EyeOff, User } from 'lucide-react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const { variation } = useTheme();
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`http://localhost:4000/auth/password-reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || 'Failed to reset password');
        return;
      }

      setSuccessMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err) {
      setErrorMessage('Server connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const accentBg = variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground';
  const inputCls = 'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors hover:border-border/80';

  return (
    <>
      <Head>
        <title>Set New Password — Teknova</title>
      </Head>
      <Layout>
        <div className="pt-32 pb-16 px-4 min-h-screen bg-background">
          <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <User size={24} className={accentCls} />
              </div>
              <h1 className={'font-heading text-2xl font-bold text-foreground'}>
                Set New Password
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your new password below.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">New Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">Confirm New Password</label>
                <div className="relative">
                  <input type={showPassConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                  <button onClick={() => setShowPassConfirm(!showPassConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] text-center font-semibold animate-shake">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] text-center font-semibold">
                {successMessage}
              </div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || successMessage !== ''}
              className={'w-full py-3.5 rounded-xl font-bold mt-6 relative overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-70 ' + accentBg}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                'RESET PASSWORD'
              )}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
