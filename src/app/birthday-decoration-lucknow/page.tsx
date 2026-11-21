import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Birthday Decoration', cityName: 'Lucknow', serviceSlug: 'birthday-decoration', citySlug: 'lucknow' });

export default function Page() {
  return <CityServiceTemplate
    cat="bday" serviceName="Birthday Decoration" serviceSlug="birthday-decoration" emoji="🎂"
    citySlug="lucknow" cityName="Lucknow"
  />;
}
