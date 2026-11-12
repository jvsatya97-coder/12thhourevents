'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, getPrice, Product } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import BookingModal from '@/components/BookingModal';

// Give each product a deterministic "heat score" based on its id/disc
function heatScore(p: Product): number {
  const hash = [...(p.id || 'x')].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 50) + p.disc * 1.5;
}

const TREND_BADGES = ['🔥 Trending', '⚡ Hot Pick', '🌟 Fan Fav', '💎 Best Value', '👑 Top Rated', '🚀 Rising Fast'];

function badge(p: Product): string {
  const hash = [...(p.id || 'x')].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TREND_BADGES[hash % TREND_BADGES.length];
}

export default function TrendingSection() {
  const { city } = useCity();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts().then(all => {
      // Pick highest-scoring across categories
      const sorted = [...all].sort((a, b) => heatScore(b) - heatScore(a)).slice(0, 6);
      setProducts(sorted);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return null; // silence while loading
  if (products.length === 0) return null;

  return (
    <>
      <section className="py-12 md:py-16 bg-gradient-to-br from-pink-50 via-orange-50 to-amber-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 rounded-full px-3 py-1 text-xs font-bold mb-2">
                🔥 TRENDING NOW
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                What&apos;s Hot This <span style={{ background: 'linear-gradient(135deg,#ff6b00,#ff9800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Week</span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Top packages people are loving right now</p>
            </div>
            {/* Live indicator */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live rankings
              </div>
              <div className="text-[11px] text-gray-400">Updated hourly</div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {products.map((p, rank) => {
              const price = getPrice(p, city) || (p.price ? `₹${parseInt(p.price).toLocaleString('en-IN')}` : '');
              const trendBadge = badge(p);
              const isTop = rank < 3;

              return (
                <div
                  key={p.id}
                  className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border ${isTop ? 'border-orange-200' : 'border-gray-100'}`}
                >
                  {/* Rank ribbon */}
                  <div className={`absolute top-2.5 left-2.5 z-10 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow ${rank === 0 ? 'bg-yellow-500' : rank === 1 ? 'bg-gray-400' : rank === 2 ? 'bg-amber-600' : 'bg-orange-500'}`}>
                    #{rank + 1}
                  </div>

                  {/* Trend badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {trendBadge}
                  </div>

                  {/* Image */}
                  <div className="relative h-32 md:h-40 bg-orange-100 overflow-hidden">
                    {p.imgs[0] ? (
                      <img src={p.imgs[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">{p.emoji}</div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Discount badge */}
                    {p.disc > 0 && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {p.disc}% OFF
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 text-xs md:text-sm leading-snug line-clamp-2 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-2.5">
                      <span className="text-orange-600 font-extrabold text-sm">{price}</span>
                      {p.disc > 0 && p.orig && (
                        <span className="text-gray-400 line-through text-[11px]">₹{parseInt(p.orig).toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    {/* Fake booking count */}
                    <div className="text-[10px] text-gray-500 mb-2.5 flex items-center gap-1">
                      <span>👥</span>
                      <span>{((heatScore(p) * 7 + rank * 3) % 80) + 20}+ booked this week</span>
                    </div>

                    {/* CTA row */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setBookingProduct(p)}
                        className="flex-1 text-[11px] font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white py-1.5 rounded-xl"
                      >
                        Book →
                      </button>
                      <Link
                        href={`/product/${encodeURIComponent(p.id)}`}
                        className="flex-1 text-[11px] font-semibold border border-orange-300 text-orange-600 py-1.5 rounded-xl text-center hover:bg-orange-50 transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-8">
            <Link
              href="/birthday-decoration"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition text-sm border border-orange-300 hover:border-orange-400 px-5 py-2.5 rounded-full hover:bg-orange-50"
            >
              See All Packages →
            </Link>
          </div>
        </div>
      </section>

      {bookingProduct && (
        <BookingModal product={bookingProduct} onClose={() => setBookingProduct(null)} mode="book" />
      )}
    </>
  );
}
