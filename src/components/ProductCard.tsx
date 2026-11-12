'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Product, getPrice, getOrig, getImgFallbacks, toThumbUrl } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import WishlistButton from '@/components/WishlistButton';
import BookingModal from '@/components/BookingModal';

// Deterministic "review" count and rating based on product id
function pseudoRating(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  const reviews = 12 + (Math.abs(h) % 89);   // 12–100
  const rating = (4.7 + (Math.abs(h >> 4) % 3) * 0.1).toFixed(1); // 4.7–4.9
  // Show urgency on ~30% of cards (those where hash mod 10 < 3)
  const showUrgency = (Math.abs(h >> 8) % 10) < 3;
  const slots = 1 + (Math.abs(h >> 12) % 4); // 1–4 slots
  return { reviews, rating, showUrgency, slots };
}

export default function ProductCard({ p }: { p: Product }) {
  const { city, cityName } = useCity();
  const price = getPrice(p, city);
  const orig = getOrig(p, city);
  const { reviews, rating, showUrgency, slots } = pseudoRating(p.id);
  const [imgSrc, setImgSrc] = useState(toThumbUrl(p.img));
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    const fallbacks = getImgFallbacks(p.img);
    if (fallbackIdx < fallbacks.length) {
      setImgSrc(fallbacks[fallbackIdx]);
      setFallbackIdx(f => f + 1);
    } else {
      setImgError(true);
    }
  };

  const [bookingOpen, setBookingOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    setBookingOpen(true);
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    setEnquireOpen(true);
  };

  return (
    <>
    <Link href={`/product/${encodeURIComponent(p.id)}`} className="card block group relative">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={p.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleImgError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex flex-col items-center justify-center gap-1">
            <span className="text-5xl">{p.emoji}</span>
            <span className="text-xs text-orange-400 font-medium">View Package</span>
          </div>
        )}
        {/* Discount badge */}
        {p.disc > 0 && (
          <div className="absolute top-2 left-2 disc-badge">{p.disc}% OFF</div>
        )}
        {/* Wishlist heart */}
        <WishlistButton id={p.id} />
        {/* Category chip */}
        {p.sub && (
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            {p.sub}
          </div>
        )}
        {/* Multiple images indicator */}
        {p.imgs.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            📷 {p.imgs.length}
          </div>
        )}
        {/* Urgency badge */}
        {showUrgency && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
            🔥 {slots} left
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
        <div className="flex gap-2">
          <button onClick={handleEnquire}
            className="flex-1 border-2 border-orange-400 text-orange-500 font-semibold text-xs py-2 rounded-xl hover:bg-orange-50 transition-colors justify-center">
            💬 Enquire
          </button>
          <button onClick={handleBook}
            className="flex-1 btn-pink text-xs py-2 justify-center">
            📋 Book
          </button>
        </div>
      </div>
    </Link>

    {bookingOpen && <BookingModal product={p} onClose={() => setBookingOpen(false)} mode="book" />}
    {enquireOpen && <BookingModal product={p} onClose={() => setEnquireOpen(false)} mode="enquire" />}
    </>
  );
}
