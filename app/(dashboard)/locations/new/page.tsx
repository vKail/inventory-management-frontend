'use client';
import { useState } from 'react';
import LocationFormView from '@/features/locations/presentation/views/location-form-view';
import { useLocationStore } from '@/features/locations/context/location-store';
import { LocationFormValues } from '@/features/locations/data/schemas/location.schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewLocationPage() {
    const { addLocation } = useLocationStore();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true);
        try {
            await addLocation(data);
            toast.success('Ubicación creada exitosamente');
            router.push('/locations');
        } catch (error) {
            console.error('Error al crear la ubicación:', error);
            toast.error('Error al crear la ubicación');
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