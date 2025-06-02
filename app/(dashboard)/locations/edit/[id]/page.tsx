import { LocationView } from '@/features/locations/presentation/views/location-view';

interface LocationPageProps {
    params: {
        id: string;
    };
}

export default function LocationPage({ params }: LocationPageProps) {
    return <LocationView locationId={parseInt(params.id, 10)} />;
} 