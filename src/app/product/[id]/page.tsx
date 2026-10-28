import type { Metadata } from 'next';
import ProductContent from './ProductContent';

export const metadata: Metadata = {
  title: 'Package Details | 12th Hour Events',
  description: 'View decoration package details and book on WhatsApp.',
};

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProductContent id={params.id} />
    </div>
  );
}
