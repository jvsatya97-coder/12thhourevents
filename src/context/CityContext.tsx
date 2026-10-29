'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CITIES } from '@/lib/config';

interface CityCtx { city: string; cityName: string; setCity: (s: string) => void; }

const CityContext = createContext<CityCtx>({ city: 'delhi', cityName: 'Delhi NCR', setCity: () => {} });

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setRaw] = useState('delhi');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('12he_city');
      if (saved && CITIES.some(c => c.slug === saved)) {
        setRaw(saved);
      }
    } catch {}
  }, []);

  const setCity = (s: string) => {
    setRaw(s);
    try { localStorage.setItem('12he_city', s); } catch {}
  };

  const cityName = CITIES.find(c => c.slug === city)?.name || 'Delhi NCR';

  // Prevent hydration mismatch — render with default 'delhi' on server,
  // then update after mount from localStorage
  return (
    <CityContext.Provider value={{ city: mounted ? city : 'delhi', cityName: mounted ? cityName : 'Delhi NCR', setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export const useCity = () => useContext(CityContext);
