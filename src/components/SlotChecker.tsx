'use client';
import { useState } from 'react';
import { WA_NUM } from '@/lib/config';
import { useCity } from '@/context/CityContext';

// Deterministic slot availability — based on date string hash
function getDateHash(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

function getSlotsForDate(dateStr: string): SlotInfo[] {
  const hash = getDateHash(dateStr);
  const date = new Date(dateStr);
  const dow = date.getDay(); // 0=Sun, 6=Sat

  const isWeekend = dow === 0 || dow === 6;

  // Base: more bookings on weekends
  const slotDefs = [
    { label: '9 AM – 12 PM', time: '9 AM – 12 PM', emoji: '🌅' },
    { label: '12 PM – 4 PM', time: '12 PM – 4 PM', emoji: '☀️' },
    { label: '4 PM – 7 PM', time: '4 PM – 7 PM', emoji: '🌆' },
    { label: '8 PM – 11 PM', time: '8 PM – 11 PM', emoji: '🌙' },
  ];

  return slotDefs.map((s, i) => {
    const slotHash = (hash >> (i * 4)) & 0xf;
    // Weekends are busier
    const threshold = isWeekend ? 5 : 10;
    const booked = slotHash < threshold;
    // 1-3 spots left if not fully booked
    const spotsLeft = booked ? 0 : 1 + ((slotHash + i) % 3);
    return { ...s, booked, spotsLeft };
  });
}

interface SlotInfo {
  label: string;
  time: string;
  emoji: string;
  booked: boolean;
  spotsLeft: number;
}

export default function SlotChecker() {
  const { cityName } = useCity();
  const [date, setDate] = useState('');
  const [checked, setChecked] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const checkSlots = () => {
    if (!date) return;
    setSlots(getSlotsForDate(date));
    setChecked(true);
    setSelectedSlot(null);
  };

  const bookSlot = (slot: SlotInfo) => {
    const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const msg = `Hi! I'd like to book a slot:\n\n📅 *Date:* ${dateFormatted}\n⏰ *Time:* ${slot.label} (${slot.time})\n📍 *City:* ${cityName}\n\nPlease confirm availability!`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const dateLabel = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const freeCount = slots.filter(s => !s.booked).length;

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">📅</div>
          <div>
            <h3 className="font-extrabold text-base">Check Slot Availability</h3>
            <p className="text-xs text-orange-100 mt-0.5">Pick a date — see open slots instantly</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Date picker */}
        <div className="flex gap-3 mb-4">
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={date}
            onChange={e => { setDate(e.target.value); setChecked(false); }}
            className="flex-1 border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-orange-400 transition"
          />
          <button
            onClick={checkSlots}
            disabled={!date}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold px-5 py-3 rounded-2xl text-sm transition active:scale-95">
            Check
          </button>
        </div>

        {!checked && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🗓️</div>
            <p className="text-sm text-gray-400">Pick a date above to see available slots in {cityName}</p>
          </div>
        )}

        {checked && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-800">{dateLabel}</p>
                <p className="text-xs text-gray-400">{freeCount} of 4 slots available</p>
              </div>
              {freeCount === 0 && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">Fully Booked</span>
              )}
              {freeCount > 0 && freeCount <= 2 && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">⚡ Filling Fast!</span>
              )}
              {freeCount >= 3 && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ Good Availability</span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              {slots.map(slot => (
                <button
                  key={slot.label}
                  onClick={() => !slot.booked && setSelectedSlot(slot)}
                  disabled={slot.booked}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                    slot.booked
                      ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      : selectedSlot?.label === slot.label
                        ? 'border-orange-400 bg-orange-50 shadow-sm'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/40'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{slot.emoji}</span>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${slot.booked ? 'text-gray-400' : 'text-gray-800'}`}>{slot.label}</p>
                      <p className="text-xs text-gray-400">{slot.time}</p>
                    </div>
                  </div>
                  {slot.booked ? (
                    <span className="text-xs font-semibold text-red-400 bg-red-50 px-2 py-1 rounded-full">Booked</span>
                  ) : (
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        slot.spotsLeft === 1
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-green-600 bg-green-50'
                      }`}>
                        {slot.spotsLeft === 1 ? '1 spot left!' : `${slot.spotsLeft} spots`}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {selectedSlot && (
              <button
                onClick={() => bookSlot(selectedSlot)}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.306A9.962 9.962 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.959 7.959 0 01-4.065-1.112l-.29-.173-3.005.788.802-2.924-.19-.3A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"/></svg>
                Book {selectedSlot.label} Slot on WhatsApp
              </button>
            )}

            {freeCount === 0 && (
              <button
                onClick={() => {
                  const msg = `Hi! The slots for ${dateLabel} seem fully booked. Can you help me find the next available date in ${cityName}?`;
                  window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2">
                Ask for Next Available Date →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
