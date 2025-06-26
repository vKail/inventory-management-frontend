'use client';

import { useRouter } from 'next/navigation';
import { LocationForm } from '../components/location-form';
import { useLocationStore } from '../../context/location-store';
import { LocationFormValues } from '../../data/schemas/location.schema';
import { ILocation } from '../../data/interfaces/location.interface';
import { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface LocationViewProps {
    id?: string;
}

export function LocationView({ id }: LocationViewProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { addLocation, updateLocation, getLocationById } = useLocationStore();
    const [initialData, setInitialData] = useState<ILocation | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Determine if this is edit mode
    useEffect(() => {
        setIsEditMode(!!id && id !== 'new');
    }, [id]);

    // Load initial data only if in edit mode and ID is valid
    useEffect(() => {
        const loadLocation = async () => {
            if (isEditMode && id && !isNaN(Number(id))) {
                try {
                    const location = await getLocationById(Number(id));
                    if (location) {
                        setInitialData(location);
                    } else {
                        // If location not found, redirect to locations list
                        router.push('/locations');
                    }
                } catch (error) {
                    console.error('Error loading location:', error);
                    router.push('/locations');
                }
            } else {
                setInitialData(null);
            }
        };

        loadLocation();
    }, [id, isEditMode, getLocationById, router]);

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true);
        try {
            if (isEditMode && id && !isNaN(Number(id))) {
                await updateLocation(Number(id), data);
            } else {
                await addLocation(data);
            }
            router.push('/locations');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            {/* Breadcrumbs */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Wrench className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/locations">Ubicaciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {isEditMode ? "Editar Ubicación" : "Nueva Ubicación"}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <LocationForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
} 