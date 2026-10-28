'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CITIES } from '@/lib/config';

interface CityCtx { city: string; cityName: string; setCity: (s: string) => void; }
const CityContext = createContext<CityCtx>({ city: 'delhi', cityName: 'Delhi NCR', setCity: () => {} });

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setRaw] = useState('delhi');
  useEffect(() => {
    try { const s = localStorage.getItem('12he_city'); if (s) setRaw(s); } catch {}
  }, []);
  const setCity = (s: string) => { setRaw(s); try { localStorage.setItem('12he_city', s); } catch {} };
  const cityName = CITIES.find(c => c.slug === city)?.name || 'Delhi NCR';
  return <CityContext.Provider value={{ city, cityName, setCity }}>{children}</CityContext.Provider>;
}

export const useCity = () => useContext(CityContext);
