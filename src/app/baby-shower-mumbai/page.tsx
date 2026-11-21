import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Baby Shower', cityName: 'Mumbai', serviceSlug: 'baby-shower', citySlug: 'mumbai' });

export default function Page() {
  return <CityServiceTemplate
    cat="baby" serviceName="Baby Shower" serviceSlug="baby-shower" emoji="👶"
    citySlug="mumbai" cityName="Mumbai"
  />;
}
