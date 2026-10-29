'use client';
import { useState, useEffect, useRef } from 'react';
import { Product, fetchProducts } from '@/lib/products';
import ProductCard from './ProductCard';

interface Props { cat?: string; limit?: number; title?: string; showFilters?: boolean; }

export default function ProductGrid({ cat, limit, title, showFilters = false }: Props) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<string>('All');
  const [subs, setSubs] = useState<string[]>([]);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts().then(all => {
      const filtered = cat ? all.filter(p => p.cat.toLowerCase().trim() === cat.toLowerCase().trim()) : all;
      // Collect unique subs
      const subSet = new Set<string>();
      filtered.forEach(p => { if (p.sub) subSet.add(p.sub); });
      const subList = ['All', ...Array.from(subSet)];
      setSubs(subList);
      setAllProducts(filtered);
      const display = limit ? filtered.slice(0, limit) : filtered;
      setProducts(display);
      setLoading(false);
    });
  }, [cat, limit]);

  useEffect(() => {
    if (!allProducts.length) return;
    let filtered = activeSub === 'All' ? allProducts : allProducts.filter(p => p.sub === activeSub);
    if (limit) filtered = filtered.slice(0, limit);
    setProducts(filtered);
  }, [activeSub, allProducts, limit]);

  if (loading) return (
    <div className="product-grid py-4">
      {[...Array(limit || 4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="bg-gray-200" style={{ aspectRatio: '4/3' }} />
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
      <p className="text-gray-500 mb-3">No packages found in this category.</p>
      <a href="https://wa.me/918073552837" className="text-orange-600 underline text-sm">
        Contact us for a custom quote →
      </a>
    </div>
  );

  return (
    <div>
      {title && <h2 className="section-title mb-2">{title}</h2>}

      {/* Sub-category filter chips */}
      {showFilters && subs.length > 2 && (
        <div
          ref={chipsRef}
          className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {subs.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeSub === sub
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
