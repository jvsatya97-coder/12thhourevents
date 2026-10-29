'use client';
import { useState, useEffect } from 'react';
import { Product, fetchProducts } from '@/lib/products';
import ProductCard from './ProductCard';

interface Props { cat?: string; limit?: number; title?: string; }

export default function ProductGrid({ cat, limit, title }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(all => {
      let filtered = cat ? all.filter(p => p.cat.toLowerCase().trim() === cat.toLowerCase().trim()) : all;
      if (limit) filtered = filtered.slice(0, limit);
      setProducts(filtered);
      setLoading(false);
    });
  }, [cat, limit]);

  if (loading) return (
    <div className="product-grid py-4">
      {[...Array(limit || 4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="bg-gray-200" style={{ aspectRatio: '4/3' }} />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!products.length) return <p className="text-center text-gray-500 py-8">No packages found. <a href="https://wa.me/918073552837" className="text-orange-600 underline">Contact us on WhatsApp</a> for a custom quote!</p>;

  return (
    <div>
      {title && <h2 className="section-title mb-2">{title}</h2>}
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
