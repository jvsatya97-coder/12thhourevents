'use client';
import Link from 'next/link';
import { Product, getPrice, getOrig, openWhatsApp } from '@/lib/products';
import { useCity } from '@/context/CityContext';

// Deterministic "review" count and rating based on product id
function pseudoRating(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  const reviews = 12 + (Math.abs(h) % 89);   // 12–100
  const rating = (4.7 + (Math.abs(h >> 4) % 3) * 0.1).toFixed(1); // 4.7–4.9
  return { reviews, rating };
}

export default function ProductCard({ p }: { p: Product }) {
  const { city, cityName } = useCity();
  const price = getPrice(p, city);
  const orig = getOrig(p, city);
  const { reviews, rating } = pseudoRating(p.id);

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    openWhatsApp(`Hi! I want to book "${p.name}" in ${cityName}. Price: ${price}`);
  };

  return (
    <Link href={`/product/${encodeURIComponent(p.id)}`} className="card block group relative">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {p.img ? (
          <img
            src={p.img}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-5xl">
            {p.emoji}
          </div>
        )}
        {/* Discount badge */}
        {p.disc > 0 && (
          <div className="absolute top-2 left-2 disc-badge">{p.disc}% OFF</div>
        )}
        {/* Category chip */}
        {p.sub && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {p.sub}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1.5 line-clamp-2">{p.name}</h3>

        {/* Star rating row */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-orange-400 text-xs">{'★'.repeat(5)}</span>
          <span className="text-xs font-semibold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-orange-600 text-base md:text-lg">{price || '—'}</span>
          {orig && orig !== price && <span className="text-gray-400 text-xs line-through">{orig}</span>}
        </div>

        {/* CTA */}
        <button
          onClick={handleBook}
          className="w-full btn-wa text-xs md:text-sm py-2 justify-center"
        >
          📲 Book Now
        </button>
      </div>
    </Link>
  );
}
