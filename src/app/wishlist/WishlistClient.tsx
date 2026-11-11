'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, fetchProducts, toThumbUrl, getImgFallbacks, getPrice } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import { toggleWishlist } from '@/components/WishlistButton';
import CategoryBar from '@/components/CategoryBar';

const KEY = '12he_wishlist_v1';

export default function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { city } = useCity();

  const refresh = () => {
    try { setIds(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { setIds([]); }
  };

  useEffect(() => {
    refresh();
    window.addEventListener('wishlistChange', refresh);
    return () => window.removeEventListener('wishlistChange', refresh);
  }, []);

  useEffect(() => {
    if (!ids.length) { setLoading(false); return; }
    fetchProducts().then(all => {
      setProducts(ids.map(id => all.find(p => p.id === id)).filter(Boolean) as Product[]);
      setLoading(false);
    });
  }, [ids]);

  const remove = (id: string) => {
    toggleWishlist(id);
    setIds(prev => prev.filter(x => x !== id));
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="pb-mobile">
      <CategoryBar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">❤️ My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-0.5">{products.length} saved package{products.length !== 1 ? 's' : ''}</p>
          </div>
          {products.length > 0 && (
            <button onClick={() => { ids.forEach(id => toggleWishlist(id)); setIds([]); setProducts([]); }}
              className="text-xs text-red-400 hover:text-red-600 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Clear All
            </button>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="card skeleton-shimmer h-64 rounded-2xl" />)}
          </div>
        )}

        {!loading && !products.length && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Tap the ❤️ on any package to save it here</p>
            <Link href="/" className="btn-pink justify-center inline-flex px-8">Browse Packages</Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(p => {
              const price = getPrice(p, city);
              const imgSrc = toThumbUrl(p.img);
              return (
                <div key={p.id} className="card relative group">
                  <Link href={`/product/${encodeURIComponent(p.id)}`}>
                    <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy" decoding="async" referrerPolicy="no-referrer"
                          onError={e => {
                            const fb = getImgFallbacks(p.img);
                            if (fb[0]) (e.target as HTMLImageElement).src = fb[0];
                          }} />
                      ) : (
                        <div className="w-full h-full bg-orange-50 flex items-center justify-center text-5xl">{p.emoji}</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{p.name}</h3>
                      <p className="text-orange-600 font-bold">{price || '—'}</p>
                    </div>
                  </Link>
                  <div className="px-3 pb-3 flex gap-2">
                    <Link href={`/product/${encodeURIComponent(p.id)}`}
                      className="btn-pink flex-1 justify-center text-xs py-2">View</Link>
                    <button onClick={() => remove(p.id)}
                      className="p-2 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors text-sm">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
