import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, Lock } from 'lucide-react';
import { createOrder } from '../../api/orders';

const STEPS = ['Shipping', 'Review'];

export default function Checkout3() {
  const { items, subtotal, clearCart } = useCart();
  const { variation } = useTheme();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('teknova-userid');
  };
  const [form, setForm] = useState({ fname:'', lname:'', email:'', address:'', city:'', zip:'', country:'', card:'', expiry:'', cvv:'' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (typeof window !== 'undefined') { const settings = localStorage.getItem('teknova-settings'); if (settings) { try { const parsed = JSON.parse(settings); if (parsed.email) { setForm(prev => ({ ...prev, email: parsed.email, fname: parsed.name ? parsed.name.split(' ')[0] : '', lname: parsed.name ? parsed.name.split(' ').slice(1).join(' ') : '' })); } } catch (e) {} } } }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.fname) newErrors.fname = true;
    if (!form.lname) newErrors.lname = true;
    if (!form.email) newErrors.email = true;
    if (!form.address) newErrors.address = true;
    if (!form.city) newErrors.city = true;
    if (!form.zip) newErrors.zip = true;
    if (!form.country) newErrors.country = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: false }));
  };
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const inputCls = 'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors';
  const btnCls = variation === 2
    ? 'w-full bg-gradient-neon text-teknova-dark py-3.5 rounded-lg font-bold glow-neon'
    : 'w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity';

  if (done) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">Thank you for your purchase.</p>
      <p className="text-sm text-muted-foreground mb-8">Order #TKN-{Math.floor(Math.random()*90000)+10000} • Estimated delivery: 3-5 business days</p>
      <Link href="/" className={'inline-block px-8 py-3 rounded-full font-medium ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground')}>Back to Home</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className={'font-heading text-3xl font-bold text-foreground mb-8 ' + (variation === 3 ? 'italic' : '')}>Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ' + (i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border')}>{i + 1}</div>
            <span className={'text-sm font-medium ' + (i === step ? 'text-foreground' : 'text-muted-foreground')}>{s}</span>
            {i < STEPS.length - 1 && <div className={'h-px flex-1 w-8 ' + (i < step ? 'bg-primary' : 'bg-border')} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* STEP 0 - Shipping */}
          {step === 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading font-bold text-foreground">Shipping Information</h2>
                <div className="flex -space-x-3 overflow-hidden">
                  {items.slice(0, 3).map(item => (
                    <img key={item.id} src={item.image} alt={item.name} className="inline-block h-8 w-8 rounded-full ring-2 ring-card object-cover" />
                  ))}
                  {items.length > 3 && <div className="inline-block h-8 w-8 rounded-full ring-2 ring-card bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">+{items.length - 3}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input value={form.fname} onChange={e => set('fname', e.target.value)} placeholder="First Name" className={inputCls + (errors.fname ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.lname} onChange={e => set('lname', e.target.value)} placeholder="Last Name" className={inputCls + (errors.lname ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" type="email" className={inputCls + ' col-span-2' + (errors.email ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Address" className={inputCls + ' col-span-2' + (errors.address ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" className={inputCls + (errors.city ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="ZIP Code" className={inputCls + (errors.zip ? ' border-rose-500 bg-rose-500/5' : '')} />
                <input value={form.country} onChange={e => set('country', e.target.value)} placeholder="Country" className={inputCls + ' col-span-2' + (errors.country ? ' border-rose-500 bg-rose-500/5' : '')} />
              </div>
              <button onClick={() => validateForm() && setStep(1)} className={btnCls + ' mt-6'}>Continue to Review</button>
            </div>
          )}



          {/* STEP 1 - Review */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading font-bold text-foreground mb-6">Review Order</h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1"><p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div>
                    <span className="font-heading font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 border border-border text-foreground py-3.5 rounded-xl hover:bg-secondary transition-colors">Back</button>
                <button 
                  onClick={async () => { 
                    setLoading(true);
                    try {
                      const data = await createOrder({
                        user_id: getUserId(),
                        customer_name: `${form.fname} ${form.lname}`,
                        customer_email: form.email,
                        customer_mobile: '0000000000',
                        payment_method: 'card',
                        shipping_address: `${form.address}, ${form.city}, ${form.country} ${form.zip}`,
                        billing_address: `${form.address}, ${form.city}, ${form.country} ${form.zip}`,
                        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, unit_price: i.price }))
                      });
                      if (data && !data.error) {
                        clearCart();
                        setDone(true);
                      } else {
                        alert(data?.message || 'Failed to place order');
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Server error');
                    } finally {
                      setLoading(false);
                    }
                  }} 
                  disabled={loading}
                  className={'flex-1 ' + btnCls}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h3 className="font-heading font-bold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate max-w-[65%]">{item.name} x{item.quantity}</span>
                <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-500">Free</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-heading font-bold text-foreground border-t border-border pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
