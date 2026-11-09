'use client';
import { useState, useEffect, useRef } from 'react';
import { Product, fetchProducts, getPrice } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import ProductCard from './ProductCard';

type SortKey = 'featured' | 'price_asc' | 'price_desc' | 'name_asc';

interface Props { cat?: string; limit?: number; title?: string; showFilters?: boolean; }

function sortProducts(products: Product[], sort: SortKey, city: string): Product[] {
  const copy = [...products];
  if (sort === 'featured') {
    // Pinned first (by sort_order asc), then rest
    return copy.sort((a, b) => (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity));
  }
  if (sort === 'price_asc' || sort === 'price_desc') {
    copy.sort((a, b) => {
      const pa = parseFloat(a.city_prices[city] || a.price || '0') || 0;
      const pb = parseFloat(b.city_prices[city] || b.price || '0') || 0;
      return sort === 'price_asc' ? pa - pb : pb - pa;
    });
    return copy;
  }
  if (sort === 'name_asc') {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy;
}

export default function ProductGrid({ cat, limit, title, showFilters = false }: Props) {
  const { city } = useCity();
  const [baseProducts, setBaseProducts] = useState<Product[]>([]); // sorted by featured, all subs
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<string>('All');
  const [activeSort, setActiveSort] = useState<SortKey>('featured');
  const [subs, setSubs] = useState<string[]>([]);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Load products once
  useEffect(() => {
    fetchProducts().then(all => {
      let filtered = cat
        ? all.filter(p => p.cat.toLowerCase().trim() === cat.toLowerCase().trim())
        : all;
      // When showing all categories (no cat filter), deduplicate by id
      // so cats2 copies don't appear twice on the homepage
      if (!cat) {
        const seen = new Set<string>();
        filtered = filtered.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
      }
      const sorted = sortProducts(filtered, 'featured', city);
      const subSet = new Set<string>();
      sorted.forEach(p => { if (p.sub) subSet.add(p.sub); });
      setSubs(['All', ...Array.from(subSet)]);
      setBaseProducts(sorted);
      setProducts(limit ? sorted.slice(0, limit) : sorted);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat]);

  // Re-apply filter + sort when controls change
  useEffect(() => {
    if (!baseProducts.length) return;
    let filtered = activeSub === 'All' ? baseProducts : baseProducts.filter(p => p.sub === activeSub);
    filtered = sortProducts(filtered, activeSort, city);
    setProducts(limit ? filtered.slice(0, limit) : filtered);
  }, [activeSub, activeSort, baseProducts, city, limit]);

  // Close sort menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const SORT_LABELS: Record<SortKey, string> = {
    featured:   '⭐ Featured',
    price_asc:  '💰 Price: Low to High',
    price_desc: '💎 Price: High to Low',
    name_asc:   '🔤 Name: A–Z',
  };

  if (loading) return (
    <div className="product-grid py-4">
      {[...Array(limit || 4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="bg-gray-200" style={{ aspectRatio: '1/1' }} />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!products.length) return (
    <div className="text-center py-10">
      <p className="text-gray-500 mb-3">No packages found{activeSub !== 'All' ? ` for "${activeSub}"` : ''}.</p>
      {activeSub !== 'All' && (
        <button onClick={() => setActiveSub('All')} className="text-orange-500 text-sm font-medium mr-4">
          ← Show all
        </button>
      )}
      <a href="https://wa.me/918073552837" className="text-orange-600 underline text-sm">
        Contact us for a custom quote →
      </a>
    </div>
  );

  return (
    <div>
      {title && <h2 className="section-title mb-2">{title}</h2>}

      {showFilters && (
        <div className="mb-5">
          {/* Sub-category chips + sort button row */}
          <div className="flex items-center gap-2 mb-0">
            {/* Sub chips — scrollable */}
            <div className="flex gap-2 overflow-x-auto flex-1 pb-1" style={{ scrollbarWidth: 'none' }}>
              {subs.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSub(sub)}
                  className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeSub === sub
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-none" ref={sortRef}>
              <button
                onClick={() => setShowSortMenu(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                  activeSort !== 'featured'
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                <span>Sort</span>
                <span className="text-[10px]">{showSortMenu ? '▲' : '▼'}</span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 z-30 min-w-[180px] overflow-hidden">
                  {(Object.keys(SORT_LABELS) as SortKey[]).map(key => (
                    <button
                      key={key}
                      onClick={() => { setActiveSort(key); setShowSortMenu(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition ${
                        activeSort === key
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter summary */}
          {(activeSub !== 'All' || activeSort !== 'featured') && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-gray-400">Showing:</span>
              {activeSub !== 'All' && (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 rounded-full px-2.5 py-0.5 font-medium">
                  {activeSub}
                  <button onClick={() => setActiveSub('All')} className="ml-0.5 text-orange-400 hover:text-orange-700">×</button>
                </span>
              )}
              {activeSort !== 'featured' && (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 rounded-full px-2.5 py-0.5 font-medium">
                  {SORT_LABELS[activeSort]}
                  <button onClick={() => setActiveSort('featured')} className="ml-0.5 text-orange-400 hover:text-orange-700">×</button>
                </span>
              )}
              <span className="text-xs text-gray-400">{products.length} packages</span>
            </div>
          )}
        </div>
      )}

      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
