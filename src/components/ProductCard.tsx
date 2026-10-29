'use client';
import Link from 'next/link';
import { Product, getPrice, getOrig, openWhatsApp } from '@/lib/products';
import { useCity } from '@/context/CityContext';

export default function ProductCard({ p }: { p: Product }) {
  const { city, cityName } = useCity();
  const price = getPrice(p, city);
  const orig = getOrig(p, city);

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsApp(`Hi! I want to book "${p.name}" in ${cityName}. Price: ${price}`);
  };

  return (
    <Link href={`/product/${encodeURIComponent(p.id)}`} className="card block group">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {p.img ? (
          <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-5xl">{p.emoji}</div>
        )}
        {p.disc > 0 && (
          <div className="absolute top-2 right-2 disc-badge">{p.disc}% OFF</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">{p.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-orange-600 text-lg">{price || '—'}</span>
          {orig && orig !== price && <span className="text-gray-400 text-sm line-through">{orig}</span>}
        </div>
        <button onClick={handleBook}
          className="w-full btn-wa text-sm py-2 justify-center">
          📲 Book Now
        </button>
      </div>
    </Link>
  );
}
