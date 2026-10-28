'use client';
import { useState } from 'react';
import { useCity } from '@/context/CityContext';
import { Product, getPrice, submitLead, openWhatsApp } from '@/lib/products';

interface Props { product: Product; onClose: () => void; }

export default function BookingModal({ product, onClose }: Props) {
  const { city, cityName } = useCity();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const price = getPrice(product, city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead({ name, phone, date, city, product: product.name, price });
    const msg = `Hi! I want to book:\n\n*Package:* ${product.name}\n*Price:* ${price}\n*City:* ${cityName}\n*Date:* ${date || 'TBD'}\n*Name:* ${name}\n*Phone:* ${phone}`;
    openWhatsApp(msg);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">📋 Book This Package</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="bg-pink-50 rounded-xl p-3 mb-4 text-sm">
          <p className="font-semibold text-gray-800">{product.name}</p>
          <p className="text-pink-600 font-bold">{price}</p>
          <p className="text-gray-500">{cityName}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your Name" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          <input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Phone Number" type="tel" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          <input value={date} onChange={e => setDate(e.target.value)} type="date" placeholder="Event Date" className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
          <button type="submit" disabled={loading} className="btn-wa w-full justify-center">
            {loading ? 'Sending...' : '📲 Confirm on WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
