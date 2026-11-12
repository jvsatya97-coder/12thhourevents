'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCity } from '@/context/CityContext';
import { SERVICES } from '@/lib/config';
import CityModal from './CityModal';
import AnimatedLogo from './AnimatedLogo';
import SmartSearch from './SmartSearch';

export default function Navbar() {
  const { cityName } = useCity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [servOpen, setServOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl flex-shrink-0">
            <AnimatedLogo />
            <span className="grad-text">12th Hour</span>
          </Link>

          {/* Desktop nav — SmartSearch */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-6">
            <div className="flex-1">
              <SmartSearch placeholder="Search birthday, anniversary, room decoration..." />
            </div>
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
            <SmartSearch
              placeholder="Search decorations, packages..."
              autoFocus
              onClose={() => setMobileSearchOpen(false)}
            />
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
