'use client';
import { useState, useEffect } from 'react';
import { Product, fetchProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function SearchContent() {
  const [all, setAll] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(products => { setAll(products); setLoading(false); });
  }, []);

  const results = q.trim().length > 1
    ? all.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.cat.toLowerCase().includes(q.toLowerCase()) || p.sub.toLowerCase().includes(q.toLowerCase()))
    : all;

  return (
    <div>
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-12 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-extrabold mb-4">Search Packages 🔍</h1>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search birthday, anniversary, theme..."
            className="w-full px-5 py-3 rounded-full text-gray-800 text-base focus:outline-none shadow-lg"
            autoFocus
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{results.length} packages found{q ? ` for "${q}"` : ''}</p>
            {results.length ? (
              <div className="product-grid">
                {results.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">😕</div>
                <p className="text-gray-600 mb-4">No packages found for &quot;{q}&quot;</p>
                <a href="https://wa.me/918073552837" className="btn-pink inline-flex">Ask on WhatsApp for custom quote</a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
