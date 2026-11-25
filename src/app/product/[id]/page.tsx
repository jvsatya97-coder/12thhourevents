import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Legacy product URL /product/[id] — redirect to city-aware /product/delhi/[id]
 * Delhi is the default city; the new page auto-detects city from URL and updates context.
 */
export default async function ProductPageRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/product/delhi/${id}`);
}
