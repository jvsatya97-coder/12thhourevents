'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import { SERVICES } from '@/lib/config';

interface Props {
  name: string;
  emoji: string;
  desc: string;
  bgImage?: string;
}

export default function ServiceHero({ name, emoji, desc, bgImage }: Props) {
  const { cityName } = useCity();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* Category chips row — above hero */}
      <div className="bg-white border-b border-gray-100 py-2.5 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto px-4 max-w-7xl mx-auto" style={{ scrollbarWidth: 'none' }}>
          {SERVICES.map(s => (
            <Link key={s.slug} href={`/${s.slug}`}
              className="flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition whitespace-nowrap bg-white">
              <span>{s.emoji}</span> <span>{s.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero with background photo */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '320px' }}>
        {/* Background image */}
        {bgImage && (
          <div className="absolute inset-0"
            style={{ backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-14 text-center">
          <div className="text-5xl md:text-6xl mb-3">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            {name} in {cityName}
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-6 max-w-xl mx-auto">{desc}</p>

          {/* Search bar — partyone style */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-xl overflow-hidden max-w-lg mx-auto mb-6">
            <span className="pl-4 text-gray-400 text-lg">🔍</span>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
              placeholder={`Search ${name.toLowerCase()} packages...`}
              className="flex-1 px-3 py-3 text-sm text-gray-800 outline-none bg-transparent"
            />
            <button type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-bold transition-colors flex-shrink-0">
              Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration."
              target="_blank" rel="noopener noreferrer"
              className="btn-pink px-6 py-2.5 text-sm">
              📲 Book Now — WhatsApp
            </a>
            <a href="tel:+918073552837"
              className="border border-white/40 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white/10 transition text-sm">
              📞 Call Us
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs text-white/80">
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">✅ Same-Day Available</span>
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">⭐ 4.9 Rated</span>
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">🎉 5000+ Events</span>
          </div>
        </div>
      </section>
    </>
  );
}
