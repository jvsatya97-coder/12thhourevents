'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCity } from '@/context/CityContext';
import CityModal from './CityModal';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cityName } = useCity();
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      {/* Search bar that slides up from bottom nav */}
      {searchOpen && (
        <div className="fixed bottom-[56px] left-0 right-0 z-[99] bg-white border-t border-gray-200 px-4 py-3 shadow-lg md:hidden">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              type="text"
              placeholder="Search decorations, themes..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-orange-400"
            />
            <button type="submit" className="btn-pink text-sm px-4 py-2 rounded-full">
              Go
            </button>
            <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 px-2 text-lg">✕</button>
          </form>
        </div>
      )}

      <nav className="mobile-bottom-nav md:hidden">
        <Link href="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🏠</span>
          <span>Home</span>
        </Link>

        <Link href="/activities" className={`mobile-nav-item ${pathname.includes('activities') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🎪</span>
          <span>Activities</span>
        </Link>

        <button onClick={() => setSearchOpen(!searchOpen)} className={`mobile-nav-item ${searchOpen ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🔍</span>
          <span>Search</span>
        </button>

        <button onClick={() => setCityModalOpen(true)} className="mobile-nav-item">
          <span className="mobile-nav-icon">📍</span>
          <span className="truncate max-w-[60px]">{cityName.split(' ')[0]}</span>
        </button>

        <a
          href="https://wa.me/918073552837?text=Hi! I want to book a decoration."
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-nav-item mobile-nav-book"
        >
          <span className="mobile-nav-icon">💬</span>
          <span>Book Now</span>
        </a>
      </nav>

      {cityModalOpen && <CityModal onClose={() => setCityModalOpen(false)} />}
    </>
  );
}
