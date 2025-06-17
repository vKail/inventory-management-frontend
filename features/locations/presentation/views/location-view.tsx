'use client';

import { useRouter } from 'next/navigation';
import { LocationForm } from '../components/location-form';
import { useLocationStore } from '../../context/location-store';
import { LocationFormValues } from '../../schemas/location.schema';
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
    const [initialData, setInitialData] = useState<any>(null);

    // Cargar datos iniciales si es una edición
    useEffect(() => {
        const loadLocation = async () => {
            if (id) {
                const location = await getLocationById(Number(id));
                if (location) {
                    setInitialData(location);
                }
            }
        };
        loadLocation();
    }, [id, getLocationById]);

    const handleSubmit = async (data: LocationFormValues) => {
        setIsLoading(true);
        try {
            if (id) {
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

            {/* Breadcrumbs, título y descripción */}
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
                            <BreadcrumbPage>{id ? "Editar Ubicación" : "Nueva Ubicación"}</BreadcrumbPage>
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