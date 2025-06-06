import { LocationView } from '@/features/locations/presentation/views/location-view';
import { useParams } from 'next/navigation';

export default function LocationPage() {
    const params = useParams()
    const id = params?.id as unknown
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <LocationView locationId={id as number} />;
        </div>
    );
} 