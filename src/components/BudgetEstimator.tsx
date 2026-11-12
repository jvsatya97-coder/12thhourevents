'use client';
import { useState } from 'react';
import { useCity } from '@/context/CityContext';

const OCCASION_BASE: Record<string, number> = {
  birthday:    1500,
  anniversary: 2000,
  'baby shower': 2500,
  bachelorette: 3000,
  theme: 3500,
  corporate: 5000,
  wedding: 8000,
};

const EXTRAS = [
  { id: 'balloons',  label: '🎈 Balloon Arch',      add: 800 },
  { id: 'fairy',     label: '✨ Fairy Lights',       add: 600 },
  { id: 'flowers',   label: '🌸 Fresh Flowers',      add: 1200 },
  { id: 'backdrop',  label: '🖼️ Photo Backdrop',     add: 700 },
  { id: 'cake',      label: '🎂 Customised Cake',    add: 1000 },
  { id: 'fog',       label: '💨 Fog Machine',         add: 500 },
  { id: 'photobooth',label: '📸 Photo Booth Props',  add: 400 },
  { id: 'neon',      label: '💡 Neon Sign',           add: 1500 },
];

// City multipliers — premium cities cost a bit more
const CITY_MUL: Record<string, number> = {
  mumbai: 1.2, bangalore: 1.1, delhi: 1.0, noida: 0.95,
  gurgaon: 1.05, faridabad: 0.9, ghaziabad: 0.9,
  hyderabad: 1.0, pune: 1.0, chennai: 1.0,
  kolkata: 0.9, lucknow: 0.85, ahmedabad: 0.9, thane: 1.1,
};

export default function BudgetEstimator() {
  const { city, cityName } = useCity();
  const [occasion, setOccasion] = useState('birthday');
  const [guestCount, setGuestCount] = useState(20);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const baseCost = OCCASION_BASE[occasion] || 1500;
  const guestExtra = Math.max(0, (guestCount - 10)) * 40; // ₹40 per extra guest
  const extrasTotal = EXTRAS.filter(e => selectedExtras.includes(e.id)).reduce((s, e) => s + e.add, 0);
  const cityMul = CITY_MUL[city] || 1.0;
  const estimate = Math.round((baseCost + guestExtra + extrasTotal) * cityMul / 100) * 100;
  const estimateLow  = Math.round(estimate * 0.9 / 100) * 100;
  const estimateHigh = Math.round(estimate * 1.15 / 100) * 100;

  const waText = `Hi! I used the budget estimator and need a ${occasion} decoration for ~${guestCount} guests in ${cityName}. My estimated budget is ₹${estimateLow.toLocaleString('en-IN')}–₹${estimateHigh.toLocaleString('en-IN')}. Can you help?`;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
            💰 FREE TOOL
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">
            Instant <span style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Budget Estimator</span>
          </h2>
          <p className="text-sm text-gray-500">Get an instant price estimate for your event in {cityName}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">

            {/* Left — inputs */}
            <div className="p-6 space-y-6">
              {/* Occasion */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">What occasion?</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(OCCASION_BASE).map(occ => (
                    <button
                      key={occ}
                      onClick={() => { setOccasion(occ); setShowResult(false); }}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${occasion === occ ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-purple-50'}`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest count slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Guest Count</label>
                  <span className="text-purple-600 font-extrabold text-lg">{guestCount}</span>
                </div>
                <input
                  type="range"
                  min={5} max={200} step={5}
                  value={guestCount}
                  onChange={e => { setGuestCount(Number(e.target.value)); setShowResult(false); }}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>5</span><span>50</span><span>100</span><span>200</span>
                </div>
              </div>

              {/* Extras */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3 block">Add-ons (optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  {EXTRAS.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => { toggleExtra(ex.id); setShowResult(false); }}
                      className={`text-left text-xs py-2 px-3 rounded-xl border-2 transition-all flex items-center gap-1.5 ${selectedExtras.includes(ex.id) ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold' : 'border-gray-100 text-gray-600 hover:border-purple-200'}`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="w-full py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                Calculate My Budget →
              </button>
            </div>

            {/* Right — result */}
            <div className="p-6 flex flex-col justify-between">
              {!showResult ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="text-6xl mb-4">🧮</div>
                  <p className="text-gray-400 text-sm font-medium">Fill in the details and hit<br /><strong className="text-gray-600">Calculate My Budget</strong></p>
                  <div className="mt-6 space-y-2 text-left">
                    {['Occasion-based pricing', `${cityName} city rates applied`, 'No hidden charges', 'Instant WhatsApp quote'].map(pt => (
                      <div key={pt} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-green-500">✓</span> {pt}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Result display */}
                  <div className="text-center mb-6">
                    <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Estimated Budget</div>
                    <div className="text-4xl font-extrabold text-gray-800 mb-1">
                      ₹{estimateLow.toLocaleString('en-IN')} – ₹{estimateHigh.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-400">for {guestCount} guests in {cityName}</div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Base ({occasion})</span>
                      <span className="font-semibold">₹{Math.round(baseCost * cityMul).toLocaleString('en-IN')}</span>
                    </div>
                    {guestExtra > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Extra guests ({guestCount - 10})</span>
                        <span className="font-semibold">₹{Math.round(guestExtra * cityMul).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {selectedExtras.length > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Add-ons ({selectedExtras.length})</span>
                        <span className="font-semibold">₹{Math.round(extrasTotal * cityMul).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
                      <span>Total estimate</span>
                      <span className="text-purple-600">₹{estimate.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <a
                      href={`https://wa.me/918073552837?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-sm transition"
                    >
                      💬 Get Exact Quote on WhatsApp
                    </a>
                    <p className="text-center text-[11px] text-gray-400">Estimates may vary ±10% · Final quote within 5 min</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
