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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchQ, setMobileSearchQ] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQ.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQ.trim())}`);
      setMobileSearchQ('');
      setMobileSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl flex-shrink-0">
            <span className="text-2xl">🎉</span>
            <span className="grad-text">12th Hour</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-6">
            {/* Search bar — prominent on desktop */}
            <form onSubmit={handleSearch} className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                type="text"
                placeholder="Search birthday, anniversary, room decoration..."
                className="w-full border-2 border-gray-200 rounded-full px-4 py-2 pl-9 text-sm outline-none focus:border-orange-400 transition-all duration-200"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-full transition">
                Search
              </button>
            </form>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="relative group">
              <button className="nav-link flex items-center gap-1 font-medium">
                Services <span className="text-xs opacity-60">▼</span>
              </button>
              <div className="absolute top-full right-0 bg-white shadow-2xl rounded-2xl p-2 w-60 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 border border-gray-100">
                {SERVICES.map(s => (
                  <Link key={s.slug} href={`/${s.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 text-sm text-gray-700 hover:text-orange-600 transition">
                    <span>{s.emoji}</span> <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <button onClick={() => setCityModalOpen(true)} className="flex items-center gap-1 text-sm font-semibold text-orange-600 border-2 border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-50 transition">
              📍 {cityName}
            </button>
            <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration." target="_blank" rel="noopener noreferrer"
              className="btn-pink text-sm py-2 px-5 flex-shrink-0">
              📲 Book Now
            </a>
          </div>

          {/* Mobile right — search icon + city + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileOpen(false); }}
              className={`p-2 rounded-full transition ${mobileSearchOpen ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
              aria-label="Search"
            >
              🔍
            </button>
            <button onClick={() => setCityModalOpen(true)} className="text-xs text-orange-600 border border-orange-200 rounded-full px-2 py-1 font-medium">
              📍 {cityName.split(' ')[0]}
            </button>
            <button onClick={() => { setMobileOpen(!mobileOpen); setMobileSearchOpen(false); }} className="p-2 text-gray-700 text-lg">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile search bar — slides down */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 bg-white">
            <form onSubmit={handleMobileSearch} className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2">
                <span className="text-gray-400 text-base">🔍</span>
                <input
                  autoFocus
                  value={mobileSearchQ}
                  onChange={e => setMobileSearchQ(e.target.value)}
                  type="text"
                  placeholder="Search decorations, packages..."
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />
                {mobileSearchQ && (
                  <button type="button" onClick={() => setMobileSearchQ('')} className="text-gray-400 text-xs">✕</button>
                )}
              </div>
              <button type="submit" className="btn-pink text-xs px-4 py-2.5 flex-shrink-0">
                Go
              </button>
            </form>
            {/* Quick search suggestions */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {['Birthday', 'Anniversary', 'Room Decor', 'Baby Shower', 'Bachelorette'].map(term => (
                <button key={term} type="button"
                  onClick={() => { router.push(`/search?q=${encodeURIComponent(term)}`); setMobileSearchOpen(false); }}
                  className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 hover:bg-orange-100 hover:text-orange-600 transition">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-2 shadow-lg">
            <button onClick={() => setServOpen(!servOpen)} className="text-left font-semibold text-gray-800 flex items-center justify-between py-1">
              <span>Services</span> <span className="text-xs text-gray-400">{servOpen ? '▲' : '▼'}</span>
            </button>
            {servOpen && (
              <div className="grid grid-cols-2 gap-1 mb-1">
                {SERVICES.map(s => (
                  <Link key={s.slug} href={`/${s.slug}`} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition">
                    <span>{s.emoji}</span> <span className="truncate">{s.name}</span>
                  </Link>
                ))}
              </div>
            )}
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="nav-link py-1 font-medium">Contact</Link>
            <div className="border-t border-gray-100 pt-2">
              <a href="https://wa.me/918073552837?text=Hi! I want to book a decoration."
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="btn-pink text-sm text-center w-full justify-center py-3">
                📲 Book Now on WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
      {cityModalOpen && <CityModal onClose={() => setCityModalOpen(false)} />}
    </>
  );
}
