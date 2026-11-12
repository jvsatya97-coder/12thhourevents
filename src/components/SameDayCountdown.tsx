'use client';
import { useEffect, useState } from 'react';

function getTimeLeft() {
  const now = new Date();
  // Same-day booking cutoff is 6 PM IST
  const cutoff = new Date();
  cutoff.setHours(18, 0, 0, 0);

  // If past 6 PM, show tomorrow's cutoff
  if (now >= cutoff) {
    cutoff.setDate(cutoff.getDate() + 1);
  }

  const diff = cutoff.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const isTomorrow = now >= new Date(now.toDateString() + ' 18:00');
  return { h, m, s, isTomorrow };
}

export default function SameDayCountdown() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  const urgent = !time.isTomorrow && time.h < 3;

  return (
    <div className={`rounded-2xl px-5 py-4 flex items-center gap-4 ${urgent ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-100'}`}>
      <div className="text-3xl flex-shrink-0">{urgent ? '⚡' : '🕐'}</div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${urgent ? 'text-red-600' : 'text-orange-600'}`}>
          {time.isTomorrow ? 'Tomorrow\'s Same-Day Bookings Open In' : urgent ? '⚠️ Hurry! Same-Day Cutoff In' : 'Same-Day Setup — Book Before 6 PM'}
        </div>
        <div className={`text-sm ${urgent ? 'text-red-500' : 'text-orange-500'}`}>
          {time.isTomorrow
            ? 'Next same-day slots open at 9 AM'
            : 'Book now and our team arrives today!'}
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {[
          { val: String(time.h).padStart(2, '0'), label: 'hr' },
          { val: String(time.m).padStart(2, '0'), label: 'min' },
          { val: String(time.s).padStart(2, '0'), label: 'sec' },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && <span className={`font-bold text-lg ${urgent ? 'text-red-400' : 'text-orange-400'}`}>:</span>}
            <div className="flex flex-col items-center">
              <div className={`font-extrabold text-xl tabular-nums w-10 h-10 rounded-xl flex items-center justify-center ${urgent ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                {unit.val}
              </div>
              <div className={`text-[9px] font-semibold mt-0.5 ${urgent ? 'text-red-400' : 'text-orange-400'}`}>{unit.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
