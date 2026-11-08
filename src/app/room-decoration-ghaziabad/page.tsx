import type { Metadata } from 'next';
import CityServiceTemplate, { generateCityMetadata } from '@/components/CityServiceTemplate';

export const metadata: Metadata = generateCityMetadata({ serviceName: 'Room Decoration', cityName: 'Ghaziabad' });

export default function Page() {
  return <CityServiceTemplate
    cat="room" serviceName="Room Decoration" serviceSlug="room-decoration" emoji="🛏️"
    citySlug="ghaziabad" cityName="Ghaziabad"
  />;
}
