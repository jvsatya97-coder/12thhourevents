'use client';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICES } from '@/lib/config';
import PackageFinder from '@/components/PackageFinder';

export default function HomeHero() {
  const { cityName } = useCity();
  const [query, setQuery] = useState('');
  const [finderOpen, setFinderOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative text-white overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Background photo — use <img> tag so browser can prioritise LCP */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1400&q=70"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-14 md:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm mb-5 font-medium">
          🌟 {cityName}&apos;s Most Trusted Party Decorators
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Make Every Moment<br />
          <span className="text-orange-400">Unforgettable ✨</span>
        </h1>

        <p className="text-base md:text-lg text-gray-200 mb-7 max-w-2xl mx-auto leading-relaxed">
          Premium birthday, anniversary &amp; party decorations in <strong className="text-white">{cityName}</strong>.
          Same-day setup. Book in 2 minutes on WhatsApp!
        </p>

        {/* Search bar — large, prominent */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-5">
          <div className="flex items-center bg-white rounded-full p-1.5 shadow-2xl shadow-black/30">
            <span className="pl-4 text-gray-400 text-lg flex-shrink-0">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search birthday, anniversary, theme decoration..."
              className="flex-1 bg-transparent text-gray-800 text-sm md:text-base px-3 py-2 outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="btn-pink text-sm md:text-base px-6 py-2.5 rounded-full flex-shrink-0">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SERVICES.slice(0, 6).map(s => (
            <Link key={s.slug} href={`/${s.slug}`}
              className="text-xs md:text-sm bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-full px-3 py-1.5 transition font-medium backdrop-blur-sm">
              {s.emoji} {s.name}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration. Can you help?" target="_blank" rel="noopener noreferrer"
            className="btn-pink text-base px-8 py-3.5 shadow-lg shadow-orange-500/30">
            📲 Get Free Quote — WhatsApp
          </a>
          <button
            onClick={() => setFinderOpen(true)}
            className="border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/15 transition text-base backdrop-blur-sm flex items-center gap-2">
            🎯 Find My Package →
          </button>
        </div>
        {finderOpen && <PackageFinder onClose={() => setFinderOpen(false)} />}

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm text-white/80">
          <span className="flex items-center gap-1.5"><span className="text-green-400">✅</span> 5000+ Events Done</span>
          <span className="flex items-center gap-1.5"><span className="text-yellow-400">⭐</span> 4.9 Star Rating</span>
          <span className="flex items-center gap-1.5"><span className="text-orange-400">⚡</span> Same Day Available</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-400">🌍</span> Pan India</span>
        </div>
      </div>
    </section>
  );
}
