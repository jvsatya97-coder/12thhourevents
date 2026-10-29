'use client';
import { useState, useEffect } from 'react';
import { Product, fetchProducts, getPrice, getOrig, openWhatsApp } from '@/lib/products';
import { useCity } from '@/context/CityContext';
import ImageGallery from '@/components/ImageGallery';
import BookingModal from '@/components/BookingModal';

export default function ProductContent({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { city, cityName } = useCity();

  useEffect(() => {
    fetchProducts().then(products => {
      const found = products.find(p => p.id === id);
      setProduct(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 rounded-2xl aspect-[4/3]" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h1 className="text-2xl font-bold text-gray-700 mb-3">Package not found</h1>
      <a href="https://wa.me/918073552837" className="btn-pink inline-flex">Chat with us on WhatsApp</a>
    </div>
  );

  const price = getPrice(product, city);
  const orig = getOrig(product, city);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-mobile">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageGallery imgs={product.imgs} name={product.name} />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-orange-600">{price || '—'}</span>
            {orig && orig !== price && <span className="text-gray-400 text-lg line-through">{orig}</span>}
            {product.disc > 0 && <span className="disc-badge">{product.disc}% OFF</span>}
          </div>
          <p className="text-sm text-gray-500 mb-4">📍 Price for {cityName}</p>

          <div className="flex gap-3 mb-6">
            <button onClick={() => setBookingOpen(true)} className="btn-pink flex-1 justify-center">
              📋 Book This Package
            </button>
            <button onClick={() => openWhatsApp(`Hi! I want to know more about "${product.name}" in ${cityName}. Price: ${price}`)}
              className="btn-wa flex-1 justify-center">
              📲 WhatsApp
            </button>
          </div>

          {product.incs.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold text-gray-700 mb-2">✅ What&apos;s Included</h3>
              <ul className="space-y-1">
                {product.incs.map((inc, i) => <li key={i} className="text-sm text-gray-600">• {inc}</li>)}
              </ul>
            </div>
          )}

          {product.excs.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-700 mb-2">❌ Not Included</h3>
              <ul className="space-y-1">
                {product.excs.map((exc, i) => <li key={i} className="text-sm text-gray-500">• {exc}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
      {bookingOpen && <BookingModal product={product} onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
