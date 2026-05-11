import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import {
  User, Package, Heart, MapPin, CreditCard, Settings,
  LogOut, Eye, EyeOff, Camera, CheckCircle, ChevronRight,
} from 'lucide-react';
import { login, signup, verifyOtp, passwordForget, getMe } from '../../api/auth';
import { getUserOrders } from '../../api/orders';
import { API_BASE_URL } from '../../api/config';

/* ── localStorage helpers (SSR-safe) ── */
const ls = {
  get: (k, fb = null) => { if (typeof window === 'undefined') return fb; try { const v = localStorage.getItem(k); return v !== null ? v : fb; } catch { return fb; } },
  set: (k, v) => { if (typeof window !== 'undefined') try { localStorage.setItem(k, v); } catch { } },
  del: (k) => { if (typeof window !== 'undefined') try { localStorage.removeItem(k); } catch { } },
  getJSON: (k, fb) => { const r = ls.get(k); if (!r) return fb; try { return JSON.parse(r); } catch { return fb; } },
};

const MOCK_ORDERS = [
  { id: 'TKN-48210', item: 'Apple iPhone 15 Pro Max', price: 1199, status: 'Delivered', emoji: '📱', date: 'Mar 28, 2025' },
  { id: 'TKN-48195', item: 'Sony WH-1000XM5', price: 289, status: 'Shipped', emoji: '🎧', date: 'Mar 25, 2025' },
  { id: 'TKN-48102', item: 'Dell XPS 15 OLED', price: 1399, status: 'Processing', emoji: '💻', date: 'Mar 20, 2025' },
];

const statusColor = (s) => ({
  Delivered: 'text-green-500 bg-green-500/10 border-green-500/20',
  Shipped: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  Cancelled: 'text-destructive bg-destructive/10 border-destructive/20',
}[s] || 'text-muted-foreground');

/* ── Sub-component moved outside to ensure stable React dispatcher ── */
const Avatar = ({ profilePic, initials, picRef, handlePic, size = 'sm' }) => {
  const dim = size === 'lg' ? 'w-20 h-20 rounded-2xl text-2xl' : 'w-10 h-10 rounded-full text-base';
  const badge = size === 'lg' ? 'absolute -bottom-1.5 -right-1.5 w-7 h-7' : 'absolute -bottom-0.5 -right-0.5 w-5 h-5';
  return (
    <div className="relative shrink-0">
      <div className={'overflow-hidden flex items-center justify-center font-bold text-white bg-primary ' + dim}>
        {profilePic ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" /> : <span>{initials}</span>}
      </div>
      <button onClick={() => picRef.current?.click()} title="Change photo"
        className={'rounded-full flex items-center justify-center text-white shadow bg-primary hover:opacity-90 transition-opacity ' + badge}>
        <Camera size={size === 'lg' ? 12 : 9} />
      </button>
      <input ref={picRef} type="file" accept="image/*" className="hidden" onChange={handlePic} />
    </div>
  );
};

export default function AccountPage() {
  const { variation } = useTheme();

  /* auth state */
  const [authMode, setAuthModeState] = useState('login');
  const [unverifiedUserId, setUnverifiedUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  /* hydration-safe mount logic */
  useEffect(() => {
    setAuthModeState(ls.get('teknova-auth', 'login'));
  }, []);

  const setAuthMode = (m) => {
    setAuthModeState(m);
    ls.set('teknova-auth', m);
    setErrorMessage('');
    setOtp('');
  };

  /* URL fix: Removed /api prefix to match backend route app.use("/auth", authRoutes) */
  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await login({ email: authForm.email, password: authForm.password });
      if (data.error || data.message && !data.accessToken) {
        if (data.unverified) {
          setUnverifiedUserId(data.userId);
          setAuthMode('verify');
        } else {
          setErrorMessage(data.message || 'Login failed');
        }
        return;
      }
      setSettings({ name: data.user.name || data.user.email, email: data.user.email });
      ls.set('teknova-token', data.accessToken);
      ls.set('teknova-userid', data.user.id);
      setAuthMode('profile');
      window.location.href = '/';
    } catch (err) {
      setErrorMessage('Server connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await signup({ name: authForm.name, email: authForm.email, password: authForm.password });
      if (data.error || data.message && !data.userId) {
        setErrorMessage(data.message || 'Signup failed');
        return;
      }
      // Save userId and transition to OTP verify mode
      setUnverifiedUserId(data.userId);
      setAuthMode('verify');
      setErrorMessage('A 6-digit verification code has been sent to your email.');
    } catch (err) {
      setErrorMessage('Server connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await verifyOtp({ userId: unverifiedUserId, otp });
      if (data.error || data.message && data.message.includes('failed')) {
        setErrorMessage(data.message || 'OTP verification failed');
        return;
      }
      setAuthMode('login');
      setErrorMessage('Account verified! Please sign in.');
    } catch (err) {
      setErrorMessage('Server connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await passwordForget({ email: authForm.email });
      if (data.error) {
        setErrorMessage(data.message || 'Request failed');
        return;
      }
      setErrorMessage('Password reset link sent to your email.');
    } catch (err) {
      setErrorMessage('Server connection error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  /* profile state */
  const [activeTab, setActiveTab] = useState('orders');
  const [profilePic, setProfilePicState] = useState(null);
  const [settings, setSettingsState] = useState({ name: 'User', email: '', phone: '' });

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const savedPic = ls.get('teknova-profilepic', null);
    const savedSettings = ls.getJSON('teknova-settings', { name: 'User', email: '', phone: '' });
    setProfilePicState(savedPic);
    setSettingsState(savedSettings);

    const storedAuth = ls.get('teknova-auth');
    if (authMode === 'profile' || storedAuth === 'profile') {
      // If we are logged in but missing the ID, we should still have the token
      // We can't easily fetch it without the ID though, so sign out/in is best
      // But we can at least try to fetch orders if ID exists
      fetchOrders();
    }
  }, [authMode]);

  const fetchOrders = async () => {
    let userId = ls.get('teknova-userid');
    const token = ls.get('teknova-token');

    if (!token) {
      setAuthMode('login');
      ls.set('teknova-auth', 'login');
      return;
    }

    // If userId is missing but we have a token, fetch it from /me first
    if (!userId) {
      try {
        const meData = await getMe(token);
        if (meData && meData.user) {
          userId = meData.user.id;
          ls.set('teknova-userid', userId);
        } else {
          return; // Still can't get userId
        }
      } catch (e) {
        return;
      }
    }

    setOrdersLoading(true);
    try {
      const data = await getUserOrders(userId, token);
      if (data && !data.error) {
        setOrders(data);
      } else if (data && (data.status === 401 || data.status === 403)) {
        setAuthMode('login');
        ls.set('teknova-auth', 'login');
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const setProfilePic = (v) => { setProfilePicState(v); v ? ls.set('teknova-profilepic', v) : ls.del('teknova-profilepic'); };
  const setSettings = (updater) => {
    setSettingsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      ls.set('teknova-settings', JSON.stringify(next));
      return next;
    });
  };
  const [savedMsg, setSavedMsg] = useState(false);
  const picRef = useRef(null);

  /* theme utils */
  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const accentBg = variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground';
  const activeItem = variation === 2 ? 'bg-neon/10 text-neon' : 'bg-primary/10 text-primary';
  const inputCls = 'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors hover:border-border/80';

  const setF = (k, v) => setAuthForm(p => ({ ...p, [k]: v }));
  const initials = (settings.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handlePic = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProfilePic(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleSave = () => { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2500); };

  /* ── VIEW LOGIC ── */
  if (authMode !== 'profile') {
    return (
      <>
        <Head><title>{authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : authMode === 'forgot-password' ? 'Reset Password' : 'Verify'} — Teknova</title></Head>
        <Layout>
          <div className="pt-32 pb-16 px-4 min-h-screen bg-background">
            <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <User size={24} className={accentCls} />
                </div>
                <h1 className={'font-heading text-2xl font-bold text-foreground'}>
                  {authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : authMode === 'forgot-password' ? 'Reset Password' : 'Confirm Access'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {authMode === 'login' ? 'Sign in to access your dashboard' : authMode === 'signup' ? 'Join our community today' : authMode === 'forgot-password' ? 'We will send you instructions to reset your password' : 'Enter the code sent to your email'}
                </p>
              </div>

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" value={authForm.name} onChange={e => setF('name', e.target.value)} placeholder="John Doe" className={inputCls} />
                  </div>
                )}
                {(authMode === 'login' || authMode === 'signup') && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">Email Address</label>
                      <input type="email" value={authForm.email} onChange={e => setF('email', e.target.value)} placeholder="name@example.com" className={inputCls} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Password</label>
                        {authMode === 'login' && (
                          <button onClick={() => setAuthMode('forgot-password')} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest bg-transparent border-none cursor-pointer">Forgot?</button>
                        )}
                      </div>
                      <div className="relative">
                        <input type={showPass ? 'text' : 'password'} value={authForm.password} onChange={e => setF('password', e.target.value)} placeholder="••••••••" className={inputCls} />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {authMode === 'forgot-password' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">Email Address</label>
                    <input type="email" value={authForm.email} onChange={e => setF('email', e.target.value)} placeholder="name@example.com" className={inputCls} />
                    <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-tighter opacity-80">Enter your email to receive a reset link</p>
                  </div>
                )}

                {authMode === 'verify' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest pl-1">Verification Code</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className={inputCls + ' text-center text-xl tracking-[0.5em] font-bold'}
                      maxLength={6}
                    />
                    <p className="text-[10px] text-center text-muted-foreground mt-3">Check your email inbox for the code. It expires in 15 minutes.</p>
                  </div>
                )}

              </div>

              {errorMessage && (
                <div className="mt-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] text-center font-semibold animate-shake">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={authMode === 'login' ? handleLogin : authMode === 'signup' ? handleSignup : authMode === 'verify' ? handleVerifyOtp : handleForgotPassword}
                disabled={loading}
                className={'w-full py-3.5 rounded-xl font-bold mt-6 relative overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-70 ' + accentBg}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  authMode === 'login' ? 'SIGN IN' : authMode === 'signup' ? 'START FOR FREE' : authMode === 'verify' ? 'VERIFY ACCOUNT' : 'SEND RESET LINK'
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground mt-6 pt-6 border-t border-border/50">
                {authMode === 'login'
                  ? <>New to Teknova?{' '}<button onClick={() => setAuthMode('signup')} className={accentCls + ' hover:underline font-bold'}>Create Account</button></>
                  : authMode === 'forgot-password'
                    ? <>Remembered your password?{' '}<button onClick={() => setAuthMode('login')} className={accentCls + ' hover:underline font-bold'}>Back to Sign In</button></>
                    : <>Joined before?{' '}<button onClick={() => setAuthMode('login')} className={accentCls + ' hover:underline font-bold'}>Sign In</button></>}
              </p>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  /* ── PROFILE DASHBOARD (Remains identical in UI) ── */
  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Head><title>My Account — Teknova</title></Head>
      <Layout>
        <div className="pt-28 pb-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">

              {/* Sidebar */}
              <aside className="bg-card border border-border rounded-2xl p-5 h-fit shadow-xl">
                <div className={'flex items-center gap-3 mb-6 pb-5 border-b border-border'}>
                  <Avatar profilePic={profilePic} initials={initials} picRef={picRef} handlePic={handlePic} size="sm" />
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm truncate">{settings.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{settings.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                      className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                        (activeTab === id ? activeItem : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                      <Icon size={16} /> {label}
                    </button>
                  ))}
                  <button onClick={() => setAuthMode('login')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </nav>
              </aside>

              {/* Main Content Areas */}
              <div className="lg:col-span-3">
                {activeTab === 'orders' && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-in fade-in">
                    <h2 className={'font-heading text-xl font-bold text-foreground mb-6'}>Your Orders</h2>
                    <div className="space-y-3">
                      {ordersLoading ? (
                        <div className="py-10 text-center text-muted-foreground">Loading orders...</div>
                      ) : orders.length > 0 ? (
                        orders.map(o => {
                          const firstItem = o.items?.[0];
                          const itemName = firstItem?.product_name || `Order #${o.id.slice(0, 8)}`;
                          const extraItems = (o.items?.length || 1) - 1;
                          const displayTitle = extraItems > 0 ? `${itemName} & ${extraItems} more` : itemName;
                          const imageSrc = firstItem?.product_image ? `${API_BASE_URL}${firstItem.product_image}` : null;

                          return (
                            <div key={o.id} className="flex items-center gap-4 p-4 border border-border rounded-xl hover:bg-secondary transition-all hover:border-primary/30">
                              {imageSrc ? (
                                <img src={imageSrc} alt="Product" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl shrink-0">📦</div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{displayTitle}</p>
                                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()} · {o.payment_method}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-semibold text-foreground">${Number(o.total_amount).toFixed(2)}</p>
                                <span className={'text-[10px] font-bold px-2 py-0.5 rounded-full border ' + statusColor(o.status.charAt(0).toUpperCase() + o.status.slice(1))}>{o.status}</span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-10 text-center text-muted-foreground">No orders found yet.</div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="bg-card border border-border rounded-2xl p-6 shadow-lg animate-in fade-in">
                    <h2 className={'font-heading text-xl font-bold text-foreground mb-6 text-center'}>Account Profile</h2>
                    <div className={'flex items-center gap-5 p-6 rounded-2xl border border-border mb-8 bg-secondary/50'}>
                      <Avatar profilePic={profilePic} initials={initials} picRef={picRef} handlePic={handlePic} size="lg" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Personal Snapshot</p>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Update your avatar and details below</p>
                        <div className="flex gap-2">
                          <button onClick={() => picRef.current?.click()} className={'px-4 py-1.5 rounded-lg text-xs font-bold ' + accentBg}>Upload New</button>
                          {profilePic && (
                            <button onClick={() => setProfilePic(null)} className="px-4 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors">Reset</button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 max-w-lg mx-auto">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Display Name</label>
                        <input value={settings.name} onChange={e => setSettings(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Public Email</label>
                        <input type="email" value={settings.email} onChange={e => setSettings(p => ({ ...p, email: e.target.value }))} className={inputCls} />
                      </div>
                      <div className="flex items-center gap-3 pt-4 justify-center">
                        <button onClick={handleSave} className={'px-8 py-2.5 rounded-xl text-sm font-bold ' + accentBg}>Apply Changes</button>
                        {savedMsg && <span className="text-sm text-green-500 font-medium flex items-center gap-1.5 animate-in fade-in zoom-in-50"><CheckCircle size={15} /> All changes saved!</span>}
                      </div>
                    </div>
                  </div>
                )}
                {/* Fallback for other tabs */}
                {['wishlist', 'addresses', 'payment'].includes(activeTab) && (
                  <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-lg">
                    <Settings size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-bold mb-1">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">This section is currently under construction.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
