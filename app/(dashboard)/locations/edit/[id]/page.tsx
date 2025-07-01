'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LocationFormView from '@/features/locations/presentation/views/location-form-view';
import { useLocationStore } from '@/features/locations/context/location-store';
import { LocationFormValues } from '@/features/locations/data/schemas/location.schema';
import { ILocation } from '@/features/locations/data/interfaces/location.interface';
import { toast } from 'sonner';

export default function EditLocationPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()
    const { getLocationById, updateLocation } = useLocationStore()
    const [initialData, setInitialData] = useState<ILocation | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            if (id && !isNaN(Number(id))) {
                const location = await getLocationById(Number(id))
                if (location) {
                    setInitialData(location)
                } else {
                    router.push('/locations')
                }
            }
        }
        load()
    }, [id, getLocationById, router])

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true)
        try {
            if (id && !isNaN(Number(id))) {
                await updateLocation(Number(id), data)
                toast.success('Ubicación actualizada exitosamente')
                router.push('/locations')
            }
        } catch (error) {
            console.error('Error al actualizar la ubicación:', error);
            toast.error('Error al actualizar la ubicación');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <LocationFormView
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isEditMode={true}
            />
        </div>
    );
} 