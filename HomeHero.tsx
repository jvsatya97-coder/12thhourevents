'use client';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUICK_LINKS = [
  { label: '🎂 Birthday', href: '/birthday-decoration' },
  { label: '💕 Anniversary', href: '/anniversary-decoration' },
  { label: '🎈 Balloon', href: '/balloon-decoration' },
  { label: '🛏️ Room', href: '/room-decoration' },
  { label: '🍼 Baby Shower', href: '/baby-shower-decoration' },
];

export default function HomeHero() {
  const { cityName } = useCity();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="hero-bg text-white py-14 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-5">
          🌟 {cityName}&apos;s Most Trusted Party Decorators
        </div>

        <h1 className="text-3xl md:text-6xl font-extrabold mb-4 leading-tight">
          Make Every Moment<br />
          <span className="grad-text">Unforgettable ✨</span>
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-7 max-w-2xl mx-auto">
          Premium birthday, anniversary &amp; party decorations in {cityName}. Same-day setups. Book in 2 minutes!
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
          <div className="flex gap-2 bg-white rounded-full p-1.5 shadow-xl shadow-black/20">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search decorations, themes, packages…"
              className="flex-1 bg-transparent text-gray-800 text-sm px-3 outline-none placeholder:text-gray-400"
            />
            <button type="submit" className="btn-pink text-sm px-5 py-2 rounded-full">
              🔍 Search
            </button>
          </div>
        </form>

        {/* Quick category links */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {QUICK_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="text-xs md:text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-3 py-1.5 transition font-medium">
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration." target="_blank" rel="noopener noreferrer" className="btn-pink text-base px-8 py-3">
            📲 Book Now — Free Quote
          </a>
          <Link href="/birthday-decoration" className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition text-base">
            View Packages →
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 text-sm text-gray-300">
          <span>✅ 5000+ Events Done</span>
          <span>⭐ 4.9 Star Rating</span>
          <span>⚡ Same Day Available</span>
          <span>🌍 Pan India</span>
        </div>
      </div>
    </section>
  );
}
