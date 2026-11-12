'use client';
import { useState, useEffect, useCallback } from 'react';

function getDaysLeft(dateStr: string): { d: number; h: number; m: number; s: number; past: boolean } {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, past: true };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    past: false,
  };
}

function getTodayISO() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

const OCCASION_EMOJIS: Record<string, string> = {
  birthday: '🎂',
  anniversary: '💑',
  'baby shower': '🍼',
  bachelorette: '💃',
  wedding: '💍',
  corporate: '🏢',
  party: '🎉',
  other: '🎊',
};

export default function EventCountdown() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [occasion, setOccasion] = useState('birthday');
  const [saved, setSaved] = useState<{ name: string; date: string; occasion: string } | null>(null);
  const [tick, setTick] = useState(0);

  // Load from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('12he_countdown');
      if (stored) setSaved(JSON.parse(stored));
    } catch {}
  }, []);

  // Tick every second
  useEffect(() => {
    if (!saved) return;
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [saved]);

  const save = useCallback(() => {
    if (!name.trim() || !date) return;
    const entry = { name: name.trim(), date, occasion };
    setSaved(entry);
    try { localStorage.setItem('12he_countdown', JSON.stringify(entry)); } catch {}
    setOpen(false);
  }, [name, date, occasion]);

  const clear = () => {
    setSaved(null);
    try { localStorage.removeItem('12he_countdown'); } catch {}
    setName('');
    setDate('');
    setOccasion('birthday');
  };

  if (!saved) {
    return (
      <>
        {/* Teaser card — collapsed */}
        {!open && (
          <div
            onClick={() => setOpen(true)}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-dashed border-orange-300 hover:border-orange-500 bg-orange-50 hover:bg-orange-100 transition-all px-5 py-4 flex items-center gap-4"
          >
            <div className="text-3xl group-hover:scale-110 transition-transform">⏳</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 text-sm">Track Your Event Countdown</div>
              <div className="text-xs text-gray-500 mt-0.5">Set your event date — see a live countdown + reminder</div>
            </div>
            <div className="flex-shrink-0 text-xs font-bold text-orange-500 border border-orange-400 px-3 py-1.5 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
              Set Date →
            </div>
          </div>
        )}

        {/* Expanded form */}
        {open && (
          <div className="rounded-2xl border border-orange-200 bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white">⏳ Set Your Event Date</h3>
                <p className="text-xs text-white/80 mt-0.5">We'll count down the days with you!</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-lg">✕</button>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Event name */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Event name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priya's Birthday 🎂"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              {/* Occasion */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Occasion</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(OCCASION_EMOJIS).map(([occ, emoji]) => (
                    <button
                      key={occ}
                      onClick={() => setOccasion(occ)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-xl border-2 text-xs font-medium transition-all capitalize ${occasion === occ ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-600 hover:border-orange-200 hover:bg-orange-50'}`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-[10px] leading-tight text-center">{occ}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Event date</label>
                <input
                  type="date"
                  value={date}
                  min={getTodayISO()}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <button
                onClick={save}
                disabled={!name.trim() || !date}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition text-sm"
              >
                Start My Countdown 🚀
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Countdown display ──
  const { d, h, m, s, past } = getDaysLeft(saved.date);
  const emoji = OCCASION_EMOJIS[saved.occasion] || '🎊';
  const urgent = !past && d < 7;
  const waText = `Hi! I have ${saved.name} in ${d} days (${saved.date}). I need help planning the decoration!`;

  return (
    <div className={`relative rounded-2xl overflow-hidden border ${urgent ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
      {/* Top strip */}
      <div className={`${urgent ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-orange-500 to-pink-500'} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl">{emoji}</span>
          <div>
            <div className="font-extrabold text-sm">{saved.name}</div>
            <div className="text-xs text-white/80">
              {new Date(saved.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        <button onClick={clear} className="text-white/60 hover:text-white text-xs font-medium hover:bg-white/20 px-2 py-1 rounded-full transition">
          Change
        </button>
      </div>

      <div className="px-5 py-4">
        {past ? (
          <div className="text-center py-2">
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-bold text-gray-700">The big day is here!</div>
            <div className="text-sm text-gray-500 mt-0.5">We hope your celebration is magical!</div>
          </div>
        ) : (
          <>
            {/* Countdown tiles */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {[
                { val: d,  label: d === 1 ? 'day' : 'days' },
                { val: h,  label: h === 1 ? 'hr' : 'hrs' },
                { val: m,  label: 'min' },
                { val: s,  label: 'sec' },
              ].map((unit, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className={`font-bold text-lg ${urgent ? 'text-red-400' : 'text-orange-400'}`}>:</span>}
                  <div className="flex flex-col items-center">
                    <div className={`font-extrabold tabular-nums w-12 h-12 rounded-xl flex items-center justify-center text-xl ${urgent ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'} shadow`}>
                      {String(unit.val).padStart(2, '0')}
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${urgent ? 'text-red-500' : 'text-orange-500'}`}>{unit.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Urgency message */}
            {urgent && (
              <div className="text-center text-xs text-red-600 font-semibold mb-3">
                ⚡ Less than a week away — book your decoration now!
              </div>
            )}

            {/* Book CTA */}
            <a
              href={`https://wa.me/918073552837?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-sm text-white transition ${urgent ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90'}`}
            >
              💬 Plan Decoration for This Event
            </a>
          </>
        )}
      </div>
    </div>
  );
}
