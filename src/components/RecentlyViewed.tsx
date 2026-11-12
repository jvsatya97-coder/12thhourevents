'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, fetchProducts, toThumbUrl, getImgFallbacks } from '@/lib/products';
import { useCity } from '@/context/CityContext';

const KEY = '12he_recent_v1';
const MAX = 6;

export function saveRecentlyViewed(id: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const updated = [id, ...list.filter(x => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

function RecentCard({ p, city }: { p: Product; city: string }) {
  const fallbacks = getImgFallbacks(p.img);
  const allSrcs = [toThumbUrl(p.img), ...fallbacks].filter(Boolean);
  const [srcIdx, setSrcIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const currentSrc = allSrcs[srcIdx];

  const handleError = () => {
    if (srcIdx + 1 < allSrcs.length) {
      setSrcIdx(i => i + 1);
    } else {
      setFailed(true);
    }
  };

  const price = p.city_prices?.[city]
    ? `₹${parseInt(p.city_prices[city]).toLocaleString('en-IN')}`
    : p.price ? `₹${parseInt(p.price).toLocaleString('en-IN')}` : '';

  return (
    <Link href={`/product/${encodeURIComponent(p.id)}`}
      className="card flex gap-3 p-2.5 items-center hover:border-orange-200 border border-transparent transition-all">
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-orange-50">
        {currentSrc && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentSrc} alt={p.name} className="w-full h-full object-cover"
            loading="lazy" decoding="async" referrerPolicy="no-referrer"
            onError={handleError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">{p.emoji}</div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
        <p className="text-xs text-orange-600 font-bold mt-0.5">{price}</p>
      </div>
    </Link>
  );
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { city } = useCity();

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const filtered = ids.filter(id => id !== excludeId);
      if (!filtered.length) return;

      fetchProducts().then(all => {
        const found = filtered
          .map(id => all.find(p => p.id === id))
          .filter(Boolean) as Product[];
        setProducts(found.slice(0, 4));
      });
    } catch {}
  }, [excludeId, city]);

  if (!products.length) return null;

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <h2 className="text-lg font-extrabold text-gray-800 mb-4">👀 Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {products.map(p => <RecentCard key={p.id} p={p} city={city} />)}
      </div>
    </div>
  );
}
