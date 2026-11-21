import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Baby Shower', cityName: 'Chennai', serviceSlug: 'baby-shower', citySlug: 'chennai' });

export default function Page() {
  return <CityServiceTemplate
    cat="baby" serviceName="Baby Shower" serviceSlug="baby-shower" emoji="👶"
    citySlug="chennai" cityName="Chennai"
  />;
}
