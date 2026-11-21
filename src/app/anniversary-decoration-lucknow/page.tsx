import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Anniversary Decoration', cityName: 'Lucknow', serviceSlug: 'anniversary-decoration', citySlug: 'lucknow' });

export default function Page() {
  return <CityServiceTemplate
    cat="anniv" serviceName="Anniversary Decoration" serviceSlug="anniversary-decoration" emoji="❤️"
    citySlug="lucknow" cityName="Lucknow"
  />;
}
