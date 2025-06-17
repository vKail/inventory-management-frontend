import { LocationView } from '@/features/locations/presentation/views/location-view';

export default function NewLocationPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <LocationView id="new" />;
        </div>
    )
} 