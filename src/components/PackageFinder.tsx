'use client';
import { useState } from 'react';
import Link from 'next/link';
import { fetchProducts, getPrice, Product } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import BookingModal from '@/components/BookingModal';

/* ─── Result card sub-component (keeps useState out of .map()) ── */
function ResultCard({ p, city, onBook, onClose }: {
  p: Product;
  city: string;
  onBook: (p: Product) => void;
  onClose: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const price = getPrice(p, city) || (p.price ? `₹${parseInt(p.price).toLocaleString('en-IN')}` : '');
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all group">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-orange-100">
        {p.imgs[0] && !imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">{p.emoji}</div>
        )}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{p.name}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-orange-600 font-extrabold text-sm">{price}</span>
          {p.disc > 0 && (
            <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full">{p.disc}% OFF</span>
          )}
        </div>
        <div className="text-[10px] text-orange-400 mt-0.5">★★★★★ 4.9 · {p.sub || p.cat}</div>
      </div>
      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => onBook(p)}
          className="text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full whitespace-nowrap"
        >
          📋 Book
        </button>
        <Link
          href={`/product/${encodeURIComponent(p.id)}`}
          onClick={onClose}
          className="text-xs font-semibold text-orange-500 border border-orange-200 px-3 py-1.5 rounded-full text-center whitespace-nowrap hover:bg-orange-50 transition"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

/* ─── Quiz steps ─────────────────────────────────────────────── */
const STEPS = [
  {
    id: 'occasion',
    question: "What's the occasion?",
    emoji: '🎊',
    cols: 3,
    options: [
      { label: 'Kids Activities', value: 'act-artists',  emoji: '🎪' },
      { label: 'Birthday',       value: 'bday',         emoji: '🎂' },
      { label: 'Anniversary',    value: 'anniv',        emoji: '💑' },
      { label: 'Baby Shower',    value: 'baby',         emoji: '🍼' },
      { label: 'Welcome Baby',   value: 'welcomebaby',  emoji: '👶' },
      { label: 'Bachelorette',   value: 'bachelorette', emoji: '💃' },
      { label: 'Theme Party',    value: 'theme',        emoji: '🎨' },
      { label: 'Balloon Decor',  value: 'balloon',      emoji: '🎈' },
      { label: 'Pinterest',      value: 'pinterest',    emoji: '📌' },
      { label: 'Corporate',      value: 'corporate',    emoji: '🏢' },
    ],
  },
  {
    id: 'budget',
    question: "What's your budget?",
    emoji: '💰',
    cols: 2,
    options: [
      { label: 'Under ₹1,500',       value: '0-1500',     emoji: '💸' },
      { label: '₹1,500 – ₹3,000',    value: '1500-3000',  emoji: '💵' },
      { label: '₹3,000 – ₹6,000',    value: '3000-6000',  emoji: '💎' },
      { label: '₹6,000 – ₹12,000',   value: '6000-12000', emoji: '✨' },
      { label: '₹12,000+',           value: '12000-99999',emoji: '👑' },
      { label: 'No limit / Surprise me', value: '0-99999',emoji: '🌟' },
    ],
  },
  {
    id: 'vibe',
    question: 'What vibe are you going for?',
    emoji: '🎨',
    cols: 2,
    options: [
      { label: 'Romantic & Elegant',   value: 'romantic',  emoji: '🌹', keywords: ['romantic','rose','fairy','candle','elegant','royal'] },
      { label: 'Fun & Colourful',      value: 'fun',       emoji: '🎈', keywords: ['fun','colorful','rainbow','balloon','pop','kids'] },
      { label: 'Minimal & Modern',     value: 'minimal',   emoji: '🤍', keywords: ['minimal','simple','clean','modern','white','neutral'] },
      { label: 'Pinterest Aesthetic',  value: 'pinterest', emoji: '📌', keywords: ['pinterest','boho','arch','neon','aesthetic','pastel'] },
      { label: 'Royal & Grand',        value: 'royal',     emoji: '👑', keywords: ['royal','grand','luxury','gold','premium','elite'] },
      { label: 'Surprise Setup',       value: 'surprise',  emoji: '🎁', keywords: ['surprise','secret','hidden','last-minute','same-day'] },
    ],
  },
];

/* ─── Map budget range ───────────────────────────────────────── */
function parseBudget(val: string): [number, number] {
  const [lo, hi] = val.split('-').map(Number);
  return [lo, hi];
}

// Strip ₹, commas, spaces — return numeric value
function priceNum(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  return parseInt(String(priceStr).replace(/[^0-9]/g, '')) || 0;
}

// Score a product's name/sub against vibe keywords (higher = better match)
function vibeScore(p: Product, vibeVal: string): number {
  const opt = STEPS[2].options.find(o => o.value === vibeVal);
  if (!opt || !('keywords' in opt)) return 0;
  const keywords = opt.keywords as string[];
  const haystack = `${p.name} ${p.sub || ''}`.toLowerCase();
  return keywords.reduce((s, kw) => s + (haystack.includes(kw) ? 1 : 0), 0);
}

/* ─── Component ──────────────────────────────────────────────── */
export default function PackageFinder({ onClose }: { onClose: () => void }) {
  const { city, cityName } = useCity();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);

  const current = STEPS[step];

  const pick = async (value: string) => {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);

    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }

    // ── Last step — fetch & filter products ──
    setLoading(true);
    try {
      const all = await fetchProducts();
      const occasion = next.occasion;
      const [lo, hi] = parseBudget(next.budget || '0-99999');
      const vibe = next.vibe || '';

      // Step 1: match by occasion + city price in budget
      let filtered = all.filter(p => {
        if (p.cat !== occasion && p.cats2 !== occasion) return false;
        const rawPrice = getPrice(p, city) || p.price;
        const pNum = priceNum(rawPrice);
        if (pNum === 0) return true; // no price set → include
        return pNum >= lo && pNum <= hi;
      });

      // Step 2: if too few, loosen budget (keep occasion)
      if (filtered.length < 3) {
        filtered = all.filter(p => p.cat === occasion || p.cats2 === occasion);
      }

      // Step 3: if still nothing, show all
      if (filtered.length === 0) {
        filtered = all.slice(0, 8);
      }

      // Sort: vibe score desc, then price asc
      filtered = filtered
        .map(p => ({ p, vs: vibeScore(p, vibe), price: priceNum(getPrice(p, city) || p.price) }))
        .sort((a, b) => b.vs - a.vs || a.price - b.price)
        .map(x => x.p)
        .slice(0, 8);

      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (results !== null) {
      setResults(null);
      setStep(STEPS.length - 1);
    } else {
      const newAnswers = { ...answers };
      delete newAnswers[current.id];
      setAnswers(newAnswers);
      setStep(s => s - 1);
    }
  };

  /* ─── Results screen ────────────────────────────────────────── */
  if (results !== null) {
    const occasionLabel = STEPS[0].options.find(o => o.value === answers.occasion)?.label || answers.occasion;
    const budgetLabel   = STEPS[1].options.find(o => o.value === answers.budget)?.label   || '';
    const vibeLabel     = STEPS[2].options.find(o => o.value === answers.vibe)?.label     || '';

    return (
      <>
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-4 rounded-t-3xl flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-extrabold text-white text-lg">🎯 Your Perfect Matches!</h2>
                  <p className="text-orange-100 text-xs mt-0.5">{results.length} packages found in {cityName}</p>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition text-lg flex-shrink-0">✕</button>
              </div>
              {/* Answer chips */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {occasionLabel && <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{occasionLabel}</span>}
                {budgetLabel   && <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{budgetLabel}</span>}
                {vibeLabel     && <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{vibeLabel}</span>}
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
              {results.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">😕</div>
                  <p className="text-gray-500 text-sm font-medium">No exact matches — let us customise one for you!</p>
                  <a href="https://wa.me/918073552837?text=Hi! I need help finding a decoration package." target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-full text-sm">
                    💬 Chat with Us
                  </a>
                </div>
              ) : (
                results.map(p => (
                  <ResultCard
                    key={p.id}
                    p={p}
                    city={city}
                    onBook={setBookingProduct}
                    onClose={onClose}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3 flex gap-3 flex-shrink-0">
              <button onClick={back} className="flex-1 text-sm text-gray-500 font-medium hover:text-gray-700 transition py-2">
                ← Change Answers
              </button>
              <a
                href={`https://wa.me/918073552837?text=Hi! I need a ${occasionLabel} decoration in ${cityName}. Budget: ${budgetLabel}. Vibe: ${vibeLabel}. Can you help?`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 text-sm bg-orange-500 text-white font-semibold rounded-full py-2 text-center hover:bg-orange-600 transition"
              >
                💬 Need Help?
              </a>
            </div>
          </div>
        </div>

        {bookingProduct && (
          <BookingModal product={bookingProduct} onClose={() => setBookingProduct(null)} mode="book" />
        )}
      </>
    );
  }

  /* ─── Loading screen ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-2xl">
          <div className="text-5xl animate-bounce">🎯</div>
          <p className="font-bold text-gray-800">Finding your perfect packages…</p>
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Quiz screen ────────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 pt-5 pb-7 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition"
          >
            ✕
          </button>
          <div className="text-sm font-semibold text-white/70 mb-1">Step {step + 1} of {STEPS.length}</div>
          <div className="text-3xl mb-1.5">{current.emoji}</div>
          <h2 className="text-lg font-extrabold leading-tight">{current.question}</h2>
          {/* Progress bar */}
          <div className="flex gap-1.5 justify-center mt-3">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? 'bg-white w-10' : i === step ? 'bg-white w-10' : 'bg-white/30 w-5'}`} />
            ))}
          </div>
          {/* Show previous answers as chips */}
          {step > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              {STEPS.slice(0, step).map(s => {
                const ans = answers[s.id];
                const label = s.options.find(o => o.value === ans)?.label;
                return label ? (
                  <span key={s.id} className="bg-white/20 text-white/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {label}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Options */}
        <div className={`px-4 py-4 -mt-3 bg-white rounded-t-3xl grid gap-2.5 ${current.cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => pick(opt.value)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 border-gray-100 hover:border-orange-400 hover:bg-orange-50 active:scale-95 transition-all text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
              <span className="text-[11px] font-semibold text-gray-700 leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>

        {step > 0 && (
          <div className="px-5 pb-4">
            <button onClick={back} className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium py-1.5 transition">
              ← Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
