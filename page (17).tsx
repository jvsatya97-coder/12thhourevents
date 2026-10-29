import type { Metadata } from 'next';
import ProductContent from './ProductContent';

export const metadata: Metadata = {
  title: 'Package Details | 12th Hour Events',
  description: 'View decoration package details and book on WhatsApp.',
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <ProductContent id={id} />
    </div>
  );
}
