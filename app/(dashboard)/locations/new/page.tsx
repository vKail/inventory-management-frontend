'use client';
import { useState } from 'react';
import LocationFormView from '@/features/locations/presentation/views/location-form-view';
import { useLocationStore } from '@/features/locations/context/location-store';
import { LocationFormValues } from '@/features/locations/data/schemas/location.schema';

export default function NewLocationPage() {
    const { addLocation } = useLocationStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true);
        try {
            await addLocation(data);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <LocationFormView
                initialData={null}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isEditMode={false}
            />
        </div>
    );
} 