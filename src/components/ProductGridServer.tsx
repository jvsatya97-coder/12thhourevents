/**
 * ProductGridServer — Server Component
 *
 * Renders product cards as static HTML so Google can crawl and index
 * all package names, prices, and inclusions without running JavaScript.
 *
 * Used on service pages and city pages. The interactive ProductGrid
 * (client component with sorting/filtering) is rendered below this for
 * users, but this component ensures the content is in the initial HTML.
 */
import Link from 'next/link';
import { Product, getPrice, getOrig } from '@/lib/products';

interface Props {
  products: Product[];
  city?: string;
}

export default function ProductGridServer({ products, city = 'delhi' }: Props) {
  if (!products.length) return null;

  return (
    <div
      // Hide visually on client — the interactive ProductGrid takes over
      // but keep it in DOM for crawlers (they see the initial HTML render)
      className="product-grid seo-grid"
      aria-hidden="true"
    >
      {products.map(p => {
        const price = getPrice(p, city);
        const orig = getOrig(p, city);
        const hasDiscount = p.disc > 0;

        return (
          <Link
            key={p.id}
            href={`/product/${encodeURIComponent(p.id)}`}
            className="card overflow-hidden group block"
          >
            {/* Image — plain img tag, no client-side fallback needed for crawlers */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {p.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-50">
                  {p.emoji}
                </div>
              )}
              {hasDiscount && (
                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {p.disc}% OFF
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">
                {p.name}
              </h3>
              {p.incs.length > 0 && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                  {p.incs.slice(0, 3).join(' · ')}
                </p>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-orange-600 font-bold text-sm">{price || `₹${p.price}`}</span>
                {orig && orig !== price && (
                  <span className="text-gray-400 text-xs line-through">{orig}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
