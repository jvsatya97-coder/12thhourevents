import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Birthday Decoration', cityName: 'Bangalore', serviceSlug: 'birthday-decoration', citySlug: 'bangalore' });

export default function Page() {
  return <CityServiceTemplate
    cat="bday" serviceName="Birthday Decoration" serviceSlug="birthday-decoration" emoji="🎂"
    citySlug="bangalore" cityName="Bangalore"
  />;
}
