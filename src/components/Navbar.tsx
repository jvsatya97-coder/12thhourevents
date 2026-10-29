'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import { SERVICES, CITIES } from '@/lib/config';
import CityModal from './CityModal';

export default function Navbar() {
  const { cityName } = useCity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [servOpen, setServOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) { router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`); setSearchQ(''); }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="text-2xl">🎉</span>
            <span className="grad-text">12th Hour Events</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                type="text"
                placeholder="Search decorations..."
                className="w-44 lg:w-56 border border-gray-200 rounded-full px-4 py-1.5 text-sm outline-none focus:border-orange-400 focus:w-64 transition-all duration-200 pr-8"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 text-sm">🔍</button>
            </form>

            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                Services <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-xl p-2 w-56 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                {SERVICES.map(s => (
                  <Link key={s.slug} href={`/${s.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 text-sm text-gray-700 hover:text-orange-600">
                    {s.emoji} {s.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/contact" className="nav-link">Contact</Link>
            <button onClick={() => setCityModalOpen(true)} className="flex items-center gap-1 text-sm font-medium text-orange-600 border border-orange-200 rounded-full px-3 py-1 hover:bg-orange-50">
              📍 {cityName}
            </button>
            <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink text-sm py-2 px-4">
              📞 Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setCityModalOpen(true)} className="text-xs text-orange-600 border border-orange-200 rounded-full px-2 py-1">
              📍 {cityName}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-700">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-2">
            <button onClick={() => setServOpen(!servOpen)} className="text-left font-medium text-gray-700">
              Services {servOpen ? '▲' : '▼'}
            </button>
            {servOpen && SERVICES.map(s => (
              <Link key={s.slug} href={`/${s.slug}`} onClick={() => setMobileOpen(false)}
                className="pl-4 py-1 text-sm text-gray-600 hover:text-orange-600">
                {s.emoji} {s.name}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="nav-link">Contact</Link>
            <Link href="/search" onClick={() => setMobileOpen(false)} className="nav-link">🔍 Search</Link>
            <a href="https://wa.me/918073552837" target="_blank" rel="noopener noreferrer" className="btn-pink text-sm text-center mt-1">
              📞 Book Now on WhatsApp
            </a>
          </div>
        )}
      </nav>
      {cityModalOpen && <CityModal onClose={() => setCityModalOpen(false)} />}
    </>
  );
}
