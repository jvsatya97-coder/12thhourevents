import type { Metadata } from 'next';
import CityServiceTemplate from '@/components/CityServiceTemplate';
import { generateCityMetadata } from '@/lib/cityMetadata';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Anniversary Decoration', cityName: 'Chennai', serviceSlug: 'anniversary-decoration', citySlug: 'chennai' });

export default function Page() {
  return <CityServiceTemplate
    cat="anniv" serviceName="Anniversary Decoration" serviceSlug="anniversary-decoration" emoji="❤️"
    citySlug="chennai" cityName="Chennai"
  />;
}
