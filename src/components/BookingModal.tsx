'use client';
import { useState } from 'react';
import { useCity } from '@/context/CityContext';
import { Product, getPrice, submitLead, openWhatsApp } from '@/lib/products';

interface Props { product: Product; onClose: () => void; mode?: 'book' | 'enquire'; }

// Specific clock times so users can pick exactly when they want
const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
];

export default function BookingModal({ product, onClose, mode = 'book' }: Props) {
  const isEnquiry = mode === 'enquire';
  const { city, cityName } = useCity();
  const [step, setStep] = useState(1); // 1 = details, 2 = success
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    timeslot: '',
    venue: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  const price = getPrice(product, city);

  const f = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10)))
      e.phone = 'Enter a valid 10-digit mobile number';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await submitLead({
      name: form.name,
      phone: form.phone,
      date: form.date,
      timeslot: form.timeslot,
      venue: form.venue,
      city,
      product: product.name,
      price,
      notes: form.notes,
      source: isEnquiry ? 'enquiry' : 'website',
    });

    // Open WhatsApp with all details
    const intro = isEnquiry
      ? `Hi! I'd like to know more about:`
      : `Hi! I want to book:`;
    const msg = `${intro}\n\n*Package:* ${product.name}\n*Price:* ${price}\n*City:* ${cityName}${form.date ? `\n*Date:* ${form.date}` : ''}${form.timeslot ? `\n*Time:* ${form.timeslot}` : ''}${form.venue ? `\n*Venue:* ${form.venue}` : ''}\n*Name:* ${form.name}\n*Phone:* ${form.phone}${form.notes ? `\n*Special Requests:* ${form.notes}` : ''}`;
    openWhatsApp(msg);
    setLoading(false);
    setStep(2);
  };

  if (step === 2) return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-3">{isEnquiry ? '💬' : '🎉'}</div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">{isEnquiry ? 'Enquiry Sent!' : 'Booking Requested!'}</h2>
        <p className="text-gray-500 text-sm mb-1">Our team will contact you soon.</p>
        <p className="text-gray-400 text-xs mb-6">Also check WhatsApp — we just sent you the details.</p>
        <button onClick={onClose} className="btn-pink w-full justify-center">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-800">{isEnquiry ? '💬 Enquire About This' : '📋 Book This Package'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        {/* Package info */}
        <div className="mx-5 mt-4 bg-orange-50 rounded-xl p-3.5 border border-orange-100">
          <p className="font-bold text-gray-800 text-sm line-clamp-2">{product.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {price && <span className="text-orange-600 font-extrabold">{price}</span>}
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs">📍 {cityName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5 pb-8">

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name <span className="text-red-400">*</span></label>
            <input
              value={form.name} onChange={e => f('name', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
            <input
              value={form.phone} onChange={e => f('phone', e.target.value)}
              placeholder="10-digit mobile number"
              type="tel" inputMode="numeric" maxLength={13}
              className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-orange-400'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Date + Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Date</label>
              <input
                value={form.date} onChange={e => f('date', e.target.value)}
                type="date" min={new Date().toISOString().slice(0, 10)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Start Time</label>
              <select value={form.timeslot} onChange={e => f('timeslot', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                <option value="">Pick time</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Venue / Area</label>
            <div className="flex gap-2">
              <input
                value={form.venue} onChange={e => f('venue', e.target.value)}
                placeholder="e.g. Sector 18, Noida"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => {
                  // Open Google Maps — user searches for venue and can copy the link/name
                  window.open('https://maps.google.com', '_blank');
                }}
                title="Open Google Maps to find venue"
                className="shrink-0 w-11 h-11 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-colors text-lg"
              >
                📍
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Tap 📍 to find your venue on Google Maps, then paste the name here</p>
          </div>

          {/* Special requests */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Special Requests <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={form.notes} onChange={e => f('notes', e.target.value)}
              placeholder="Any specific requirements, theme, add-ons..."
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>

          <button type="submit" disabled={loading}
            className={`w-full justify-center !py-3.5 text-base font-bold rounded-2xl ${isEnquiry ? 'btn-pink' : 'btn-wa'}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? '⏳ Sending...' : isEnquiry ? '💬 Send Enquiry on WhatsApp' : '📲 Confirm on WhatsApp'}
          </button>
          <p className="text-center text-xs text-gray-400 pb-2">
            {isEnquiry ? "We'll get back to you within 2 hours" : "We'll confirm your booking within 2 hours"}
          </p>
        </form>
      </div>
    </div>
  );
}
