'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCity } from '@/context/CityContext';
import CityModal from './CityModal';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cityName } = useCity();
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="mobile-bottom-nav md:hidden">
        <Link href="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🏠</span>
          <span>Home</span>
        </Link>

        <Link href="/birthday-decoration" className={`mobile-nav-item ${pathname.includes('decoration') || pathname.includes('baby') || pathname.includes('bachelor') || pathname.includes('first-night') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🎊</span>
          <span>Services</span>
        </Link>

        <Link href="/search" className={`mobile-nav-item ${isActive('/search') ? 'active' : ''}`}>
          <span className="mobile-nav-icon">🔍</span>
          <span>Search</span>
        </Link>

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
