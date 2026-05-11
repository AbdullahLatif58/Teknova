import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MOCK_REVIEWS = [
  { id: 1, name: 'Alex M.', rating: 5, date: 'Mar 2025', title: 'Absolutely worth it!', body: 'Best purchase I have made this year. Build quality is exceptional and performance is top notch.', helpful: 24 },
  { id: 2, name: 'Sarah K.', rating: 5, date: 'Feb 2025', title: 'Exceeded expectations', body: 'Stunning display, fast charging, and the camera system is incredible. Highly recommended.', helpful: 18 },
  { id: 3, name: 'James L.', rating: 4, date: 'Jan 2025', title: 'Great but pricey', body: 'Brilliant device overall. The only downside is the price, but you get what you pay for.', helpful: 12 },
];

export default function ReviewsRatings({ product }) {
  const { variation } = useTheme();
  const [filter, setFilter] = useState('all');
  const accentCls = variation === 2 ? 'text-neon' : 'text-primary';
  const reviews = MOCK_REVIEWS;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <section className="py-12">
      <h2 className={'font-heading text-2xl font-bold text-foreground mb-8 ' + (variation === 3 ? 'italic' : '')}>
        {variation === 2 ? <span className="text-gradient-neon">Customer Reviews</span> : 'Customer Reviews'}
      </h2>

      {/* Summary */}
      <div className="flex items-start gap-8 mb-8 p-6 bg-secondary rounded-2xl">
        <div className="text-center">
          <p className={'font-heading text-6xl font-bold ' + accentCls}>{avg.toFixed(1)}</p>
          <div className="flex justify-center my-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(avg) ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}
          </div>
          <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(n => {
            const count = reviews.filter(r => r.rating === n).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={n} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-4">{n}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: pct + '%' }} />
                </div>
                <span className="text-xs text-muted-foreground w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map(r => (
          <div key={r.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{r.name[0]}</div>
                  <span className="font-heading font-semibold text-foreground text-sm">{r.name}</span>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={13} className={i < r.rating ? 'fill-primary text-primary' : 'text-muted-foreground'} />)}</div>
              </div>
            </div>
            <h4 className="font-heading font-semibold text-foreground text-sm mb-1">{r.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            <button className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp size={13} /> Helpful ({r.helpful})
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
