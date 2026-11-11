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
        {products.map(p => {
          const imgSrc = toThumbUrl(p.img);
          return (
            <Link key={p.id} href={`/product/${encodeURIComponent(p.id)}`}
              className="card flex gap-3 p-2.5 items-center hover:border-orange-200 border border-transparent transition-all">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-orange-50">
                {imgSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgSrc} alt={p.name} className="w-full h-full object-cover"
                    loading="lazy" decoding="async" referrerPolicy="no-referrer"
                    onError={e => {
                      const fallbacks = getImgFallbacks(p.img);
                      if (fallbacks[0]) (e.target as HTMLImageElement).src = fallbacks[0];
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">{p.emoji}</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                <p className="text-xs text-orange-600 font-bold mt-0.5">
                  {p.city_prices?.[city] ? `₹${p.city_prices[city]}` : (p.price ? `₹${p.price}` : '')}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
