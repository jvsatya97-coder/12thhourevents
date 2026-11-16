'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProducts, Product, getPrice, getOrig, toThumbUrl, getImgFallbacks } from '@/lib/products';
import { SERVICES } from '@/lib/config';
import { useCity } from '@/context/CityContext';
import BookingModal from '@/components/BookingModal';

// ── compact browse card ──────────────────────────────────────────────────────
function BrowseCard({ p }: { p: Product }) {
  const { city } = useCity();
  const price = getPrice(p, city);
  const orig = getOrig(p, city);
  const [imgSrc, setImgSrc] = useState(toThumbUrl(p.img));
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const handleImgError = () => {
    const fallbacks = getImgFallbacks(p.img);
    if (fallbackIdx < fallbacks.length) {
      setImgSrc(fallbacks[fallbackIdx]);
      setFallbackIdx(f => f + 1);
    } else {
      setImgError(true);
    }
  };

  return (
    <>
      <div className="browse-card flex-shrink-0 w-[160px] sm:w-[180px] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 cursor-pointer group"
        onClick={() => window.location.href = `/product/${encodeURIComponent(p.id)}`}
      >
        {/* image */}
        <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={handleImgError}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
              <span className="text-4xl">{p.emoji}</span>
            </div>
          )}
          {p.disc > 0 && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {p.disc}% OFF
            </div>
          )}
        </div>

        {/* content */}
        <div className="p-2.5">
          <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 mb-1.5 min-h-[2.5em]">{p.name}</p>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-sm font-bold text-gray-900">{price || '—'}</span>
            {orig && orig !== price && (
              <span className="text-[11px] text-gray-400 line-through">{orig}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); setBookOpen(true); }}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors"
          >
            Book
          </button>
        </div>
      </div>
      {bookOpen && <BookingModal product={p} onClose={() => setBookOpen(false)} mode="book" />}
    </>
  );
}

// ── horizontal scrollable row ────────────────────────────────────────────────
function CategoryRow({ service, products }: { service: typeof SERVICES[number]; products: Product[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const viewAllHref = `/${service.slug}`;

  return (
    <section className="mb-8">
      {/* row header */}
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{service.emoji}</span>
          <h2 className="text-base font-bold text-gray-900">{service.name}</h2>
          <span className="text-xs text-gray-400 font-medium">({products.length})</span>
        </div>
        <Link href={viewAllHref}
          className="text-xs font-semibold text-orange-500 hover:text-orange-700 flex items-center gap-0.5">
          View All →
        </Link>
      </div>

      {/* horizontal scroll strip */}
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {products.slice(0, 12).map(p => (
          <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
            <BrowseCard p={p} />
          </div>
        ))}
        {/* view-all card */}
        {products.length > 12 && (
          <Link href={viewAllHref}
            className="flex-shrink-0 w-[160px] sm:w-[180px] rounded-2xl overflow-hidden bg-orange-50 border-2 border-dashed border-orange-200 flex flex-col items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
            style={{ aspectRatio: '0.75' }}
          >
            <span className="text-3xl">{service.emoji}</span>
            <span className="text-xs font-bold text-orange-600 text-center px-2">See all {products.length}+</span>
          </Link>
        )}
      </div>
    </section>
  );
}

// ── main page ────────────────────────────────────────────────────────────────
export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts().then(ps => { setProducts(ps); setLoading(false); });
  }, []);

  // group by cat (use original cat, not cats2 duplicates)
  const byCategory = (cat: string) =>
    products.filter(p => p.cat === cat);

  const activeTabs = SERVICES.filter(s => byCategory(s.cat).length > 0);

  const scrollTabIntoView = (slug: string) => {
    const el = tabsRef.current?.querySelector(`[data-tab="${slug}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleTabClick = (slug: string) => {
    setActiveTab(slug);
    scrollTabIntoView(slug);
    if (slug !== 'all') {
      const section = document.getElementById(`cat-${slug}`);
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── page header ── */}
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-3">
        <Link href="/" className="text-orange-500 text-sm font-medium inline-flex items-center gap-1 mb-3">
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Browse All Services</h1>
        <p className="text-sm text-gray-500 mt-0.5">Decoration packages across all categories</p>
      </div>

      {/* ── sticky category tabs ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div
          ref={tabsRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide px-3 py-2.5"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* All tab */}
          <button
            data-tab="all"
            onClick={() => handleTabClick('all')}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {activeTabs.map(s => (
            <button
              key={s.slug}
              data-tab={s.slug}
              onClick={() => handleTabClick(s.slug)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === s.slug
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <span>{s.emoji}</span> {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── content ── */}
      <div className="pt-4">
        {loading ? (
          // skeleton
          <div className="px-4 space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i}>
                <div className="h-5 w-40 bg-gray-200 rounded mb-3 animate-pulse" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="flex-shrink-0 w-[160px] h-[230px] bg-gray-200 rounded-2xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {activeTabs.map(service => (
              <div key={service.slug} id={`cat-${service.slug}`}>
                <CategoryRow service={service} products={byCategory(service.cat)} />
              </div>
            ))}
            {activeTabs.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <span className="text-5xl">🎊</span>
                <p className="mt-3 font-medium">Loading packages…</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── bottom padding ── */}
      <div className="h-8" />
    </div>
  );
}
