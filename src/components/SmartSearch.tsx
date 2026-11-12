'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, getPrice, Product } from '@/lib/products';
import { useCity } from '@/context/CityContext';

const SUGGESTIONS = [
  'Birthday decoration',
  'Anniversary surprise setup',
  'Baby shower décor',
  'Bachelorette party',
  'Balloon arch',
  'Theme decoration',
  'Pinterest style',
  'Same day decoration',
  'Room decoration',
  'Kids birthday party',
];

function score(p: Product, q: string): number {
  const lq = q.toLowerCase();
  const name = p.name.toLowerCase();
  const cat = (p.cat || '').toLowerCase();
  const sub = (p.sub || '').toLowerCase();
  if (name.startsWith(lq)) return 3;
  if (name.includes(lq)) return 2;
  if (cat.includes(lq) || sub.includes(lq)) return 1;
  return 0;
}

interface Props {
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

export default function SmartSearch({ placeholder = 'Search birthday, balloons, theme...', autoFocus, onClose }: Props) {
  const { city } = useCity();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload products on mount
  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {});
  }, []);

  // Auto-focus
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Click-outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = useCallback((q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setOpen(!!q); return; }
    setLoading(true);
    const scored = allProducts
      .map(p => ({ p, s: score(p, q) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map(x => x.p);
    setResults(scored);
    setOpen(true);
    setLoading(false);
  }, [allProducts]);

  useEffect(() => {
    const t = setTimeout(() => search(query), 180);
    return () => clearTimeout(t);
  }, [query, search]);

  const go = (q: string) => {
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    setQuery(q);
    onClose?.();
  };

  const goProduct = (id: string) => {
    router.push(`/product/${encodeURIComponent(id)}`);
    setOpen(false);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) go(query);
  };

  const trendingSuggestions = SUGGESTIONS.slice(0, 5);

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center bg-white rounded-full transition-all duration-200 ${focused ? 'shadow-[0_0_0_3px_rgba(255,107,0,0.3)]' : 'shadow-2xl shadow-black/25'}`}>
          <span className="pl-4 md:pl-5 text-gray-400 text-lg flex-shrink-0">
            {loading ? <span className="inline-block w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /> : '🔍'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); setOpen(true); }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-800 text-sm md:text-base px-3 py-3 md:py-3.5 outline-none placeholder:text-gray-400 min-w-0"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="text-gray-400 hover:text-gray-600 px-2 text-lg flex-shrink-0">✕</button>
          )}
          <button type="submit" className="btn-pink text-sm md:text-base px-5 md:px-7 py-2.5 md:py-3.5 rounded-full flex-shrink-0 font-bold">
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          style={{ maxHeight: '70vh', overflowY: 'auto' }}>

          {/* Live product results */}
          {results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                Packages
              </div>
              {results.map(p => {
                const price = getPrice(p, city) || (p.price ? `₹${parseInt(p.price).toLocaleString('en-IN')}` : '');
                return (
                  <button
                    key={p.id}
                    onMouseDown={() => goProduct(p.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-orange-100">
                      {p.imgs[0]
                        ? <img src={p.imgs[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">{p.emoji}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 leading-tight truncate group-hover:text-orange-600 transition-colors">{p.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <span className="text-orange-500 font-bold">{price}</span>
                        {p.disc > 0 && <span className="bg-red-100 text-red-500 text-[9px] font-bold px-1.5 rounded-full">{p.disc}% OFF</span>}
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-orange-400 transition-colors text-sm flex-shrink-0">→</span>
                  </button>
                );
              })}
              <button
                onMouseDown={() => go(query)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-orange-600 font-semibold hover:bg-orange-50 transition border-t border-gray-50"
              >
                🔍 See all results for &ldquo;{query}&rdquo; →
              </button>
            </div>
          )}

          {/* No results */}
          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="px-4 py-6 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm text-gray-500 mb-3">No packages found for &ldquo;{query}&rdquo;</p>
              <a
                href={`https://wa.me/918073552837?text=Hi! I'm looking for: ${query}. Do you have this?`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full"
              >
                💬 Ask on WhatsApp
              </a>
            </div>
          )}

          {/* Trending suggestions (when no query) */}
          {!query && (
            <div>
              <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                🔥 Trending searches
              </div>
              {trendingSuggestions.map(s => (
                <button
                  key={s}
                  onMouseDown={() => go(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                >
                  <span className="text-gray-400 text-sm">🔥</span>
                  <span className="text-sm text-gray-700 font-medium">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
