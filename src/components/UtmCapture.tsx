'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureUtm } from '@/lib/products';

/**
 * Invisible component — runs once on every page load to capture UTM params
 * from the URL and store them in sessionStorage.
 * Must be inside a Suspense boundary because useSearchParams() needs it.
 */
export default function UtmCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureUtm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return null;
}
