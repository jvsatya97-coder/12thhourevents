import type { Metadata } from 'next';
import ProductContent from './ProductContent';
import { fetchProducts, getPrice } from '@/lib/products';
import { DOMAIN } from '@/lib/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = (() => { try { return decodeURIComponent(id); } catch { return id; } })();

  try {
    const products = await fetchProducts();
    const product = products.find(p => p.id === id)
      || products.find(p => p.id === decodedId)
      || products.find(p => p.id.toLowerCase().trim() === decodedId.toLowerCase().trim());

    if (product) {
      const price = getPrice(product, 'delhi') || product.price || '';
      const imgUrl = product.imgs?.[0] || product.img || '';
      const title = `${product.name} | 12th Hour Events`;
      const description = `Book ${product.name} decoration package${price ? ` from ${price}` : ''}. Same-day setup available. Inclusions: ${product.incs.slice(0, 3).join(', ')}. Book now on WhatsApp!`;

      return {
        title,
        description,
        alternates: { canonical: `${DOMAIN}/product/${encodeURIComponent(product.id)}` },
        openGraph: {
          title,
          description,
          type: 'website',
          url: `${DOMAIN}/product/${encodeURIComponent(product.id)}`,
          images: imgUrl ? [{ url: imgUrl, width: 800, height: 800, alt: product.name }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: imgUrl ? [imgUrl] : [],
        },
      };
    }
  } catch {
    // Fall through to default
  }

  // Product not found (deleted) — tell Google not to index this URL
  return {
    title: 'Decoration Package | 12th Hour Events',
    description: 'View decoration package details. Same-day setup available. Book on WhatsApp in 2 mins!',
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  // Server-side: load product for JSON-LD structured data
  let productSchema: string | null = null;
  try {
    const products = await fetchProducts();
    const decodedId = (() => { try { return decodeURIComponent(id); } catch { return id; } })();
    const product = products.find(p => p.id === id)
      || products.find(p => p.id === decodedId)
      || products.find(p => p.id.toLowerCase().trim() === decodedId.toLowerCase().trim());

    if (product) {
      const price = product.price ? parseFloat(product.price.replace(/[^\d.]/g, '')) : null;
      const imgUrl = product.imgs?.[0] || product.img || '';

      productSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": `${product.name} decoration package. ${product.incs.slice(0, 5).join('. ')}.`,
        "image": imgUrl ? [imgUrl] : [],
        "brand": { "@type": "Brand", "name": "12th Hour Events" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          ...(price ? { "price": price } : {}),
          "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock",
          "url": `${DOMAIN}/product/${encodeURIComponent(product.id)}`,
          "seller": { "@type": "Organization", "name": "12th Hour Events" }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "bestRating": "5"
        }
      });
    }
  } catch {
    // Skip schema if fetch fails
  }

  return (
    <div>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: productSchema }}
        />
      )}
      <ProductContent id={id} />
    </div>
  );
}
