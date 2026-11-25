'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useCity } from '@/context/CityContext';
import { CITIES } from '@/lib/config';

/** If the current path is a city-specific page like /theme-decoration-ahmedabad,
 *  return the base slug (theme-decoration) and the current city slug (ahmedabad).
 *  Returns null if not a city page. */
function parseCityPage(pathname: string): { base: string; citySlug: string } | null {
  for (const c of CITIES) {
    if (pathname.endsWith(`-${c.slug}`)) {
      return { base: pathname.slice(1, -(c.slug.length + 1)), citySlug: c.slug };
    }
  }
  return null;
}

export default function CityModal({ onClose }: { onClose: () => void }) {
  const { city, setCity } = useCity();
  const pathname = usePathname();
  const router = useRouter();

  const handleSelect = (slug: string) => {
    setCity(slug);
    // If on a city-specific page, navigate to the same page in the new city
    const parsed = parseCityPage(pathname);
    if (parsed && parsed.citySlug !== slug) {
      router.push(`/${parsed.base}-${slug}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">📍 Select Your City</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {CITIES.map(c => (
            <button key={c.slug} onClick={() => handleSelect(c.slug)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all text-left ${
                city === c.slug ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}>
              {c.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">Prices shown will be for your selected city</p>
      </div>
    </div>
  );
}
