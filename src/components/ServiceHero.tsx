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

const QUICK_SEARCHES: Record<string, string[]> = {
  'Birthday Decoration': ['Balloon arch', 'Unicorn theme', 'Car theme', 'Princess'],
  'Anniversary Decoration': ['Rose setup', 'Candle setup', 'Flower wall', 'Romantic'],
  'Room Decoration': ['Surprise setup', 'LED lights', 'Balloon ceiling', 'Fairy lights'],
  'Baby Shower': ['Blue theme', 'Pink theme', 'Gender neutral', 'Boho'],
  'Theme Decoration': ['Unicorn', 'Superhero', 'Jungle', 'Mermaid'],
  'Bachelorette Party': ['Sash setup', 'Bride tribe', 'Pink glam', 'Boho'],
};

export default function ServiceHero({ name, emoji, desc, bgImage }: Props) {
  const { cityName } = useCity();
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const quickTerms = QUICK_SEARCHES[name] || [];

  return (
    <>
      {/* Category chips row */}
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

      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '340px' }}>
        {bgImage && (
          <div className="absolute inset-0"
            style={{ backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-14 text-center">
          <div className="text-5xl md:text-6xl mb-3 drop-shadow-lg">{emoji}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            {name} in {cityName}
          </h1>
          <p className="text-gray-200 text-sm md:text-base mb-5 max-w-xl mx-auto leading-relaxed">{desc}</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow-2xl shadow-black/30 overflow-hidden max-w-lg mx-auto mb-3">
            <span className="pl-4 text-gray-400 text-lg flex-shrink-0">🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} type="text"
              placeholder={`Search ${name.toLowerCase()} packages...`}
              className="flex-1 px-3 py-3 text-sm text-gray-800 outline-none bg-transparent" />
            <button type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-sm font-bold transition-colors flex-shrink-0">
              Search
            </button>
          </form>

          {/* Quick search chips */}
          {quickTerms.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {quickTerms.map(term => (
                <button key={term} type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                  className="text-xs text-white/75 border border-white/25 rounded-full px-3 py-1 hover:bg-white/15 transition backdrop-blur-sm">
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-5">
            <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration."
              target="_blank" rel="noopener noreferrer"
              className="btn-pink px-6 py-2.5 text-sm shadow-lg shadow-orange-500/30">
              📲 Book Now — WhatsApp
            </a>
            <a href="tel:+918073552837"
              className="border border-white/40 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white/10 transition text-sm">
              📞 Call Us
            </a>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-3 text-xs text-white/80">
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">✅ Same-Day Available</span>
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">⭐ 4.9 Rated · 5000+ Events</span>
            <span className="bg-white/10 backdrop-blur rounded-full px-3 py-1">💰 No Hidden Charges</span>
          </div>
        </div>
      </section>
    </>
  );
}
