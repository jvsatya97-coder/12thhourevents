'use client';
import { useCity } from '@/context/CityContext';
import { CITIES } from '@/lib/config';

export default function CityModal({ onClose }: { onClose: () => void }) {
  const { city, setCity } = useCity();
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
            <button key={c.slug} onClick={() => { setCity(c.slug); onClose(); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all text-left ${
                city === c.slug ? 'bg-pink-600 text-white border-pink-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
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
