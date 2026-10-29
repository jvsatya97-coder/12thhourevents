'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, fetchProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const [all, setAll] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  // Initialise from URL param
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setQ(urlQ);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts().then(products => { setAll(products); setLoading(false); });
  }, []);

  const results = q.trim().length > 1
    ? all.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.cat.toLowerCase().includes(q.toLowerCase()) ||
        p.sub.toLowerCase().includes(q.toLowerCase())
      )
    : all;

  return (
    <div className="pb-mobile">
      {/* Search hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-10 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-4">Search Packages 🔍</h1>
          <div className="flex gap-2 bg-white rounded-full p-1.5 shadow-xl shadow-black/20">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search birthday, anniversary, theme..."
              className="flex-1 bg-transparent text-gray-800 text-base px-3 focus:outline-none placeholder:text-gray-400"
              autoFocus
            />
            {q && (
              <button onClick={() => setQ('')} className="text-gray-400 hover:text-gray-600 px-2 text-lg">✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="product-grid py-4">
            {[...Array(8)].map((_, i) => (
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
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {results.length} packages found{q ? ` for "${q}"` : ''}
            </p>
            {results.length ? (
              <div className="product-grid">
                {results.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-gray-600 mb-2 font-medium">No packages found for &quot;{q}&quot;</p>
                <p className="text-gray-400 text-sm mb-6">Try a different keyword or ask us for a custom setup</p>
                <a href={`https://wa.me/918073552837?text=Hi! I'm looking for: ${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer" className="btn-pink inline-flex">
                  📲 Ask on WhatsApp for Custom Quote
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
