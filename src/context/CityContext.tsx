'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CITIES } from '@/lib/config';

interface CityCtx { city: string; cityName: string; setCity: (s: string) => void; }

const CityContext = createContext<CityCtx>({ city: 'delhi', cityName: 'Delhi NCR', setCity: () => {} });

/** Detect city slug from pathnames like:
 *  /birthday-decoration-bangalore → 'bangalore'
 *  /product/bangalore/SOME_ID → 'bangalore'
 */
function detectCityFromPath(pathname: string): string | null {
  // Check /product/[city]/[id] pattern first
  const productMatch = pathname.match(/^\/product\/([^/]+)\//);
  if (productMatch) {
    const slug = productMatch[1];
    if (CITIES.some(c => c.slug === slug)) return slug;
  }
  // Check category-city pattern like /theme-decoration-bangalore
  for (const c of CITIES) {
    if (pathname.endsWith(`-${c.slug}`) || pathname.includes(`-${c.slug}/`)) {
      return c.slug;
    }
  }
  return null;
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setRaw] = useState('delhi');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const persistCity = (slug: string) => {
    try { localStorage.setItem('12he_city', slug); } catch {}
    try {
      document.cookie = `12he_city=${slug}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    // 1. Try to detect city from current URL — takes priority
    const fromUrl = detectCityFromPath(pathname);
    if (fromUrl) {
      setRaw(fromUrl);
      persistCity(fromUrl);
      return;
    }
    // 2. Fall back to saved preference
    try {
      const saved = localStorage.getItem('12he_city');
      if (saved && CITIES.some(c => c.slug === saved)) {
        setRaw(saved);
        persistCity(saved);
      }
    } catch {}
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Also sync on pathname changes after mount
  useEffect(() => {
    if (!mounted) return;
    const fromUrl = detectCityFromPath(pathname);
    if (fromUrl) {
      setRaw(fromUrl);
      persistCity(fromUrl);
    }
  }, [pathname, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCity = (s: string) => {
    setRaw(s);
    persistCity(s);
  };

  const cityName = CITIES.find(c => c.slug === city)?.name || 'Delhi NCR';

  // Prevent hydration mismatch — render with default 'delhi' on server,
  // then update after mount from URL / localStorage
  return (
    <CityContext.Provider value={{ city: mounted ? city : 'delhi', cityName: mounted ? cityName : 'Delhi NCR', setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => useContext(CityContext);
