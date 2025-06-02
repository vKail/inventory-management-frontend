'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationTable } from '@/features/locations/presentation/components/location-table';
import { LocationPagination } from '@/features/locations/presentation/components/location-pagination';
import { useLocationStore } from '@/features/locations/context/location-store';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function LocationsPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const { getLocations } = useLocationStore();

    useEffect(() => {
        const loadLocations = async () => {
            const response = await getLocations(currentPage, itemsPerPage);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        };
        loadLocations();
    }, [currentPage, getLocations]);

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="mb-6">
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">
                                Configuración
                            </span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <MapPin className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbPage>Ubicaciones</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Ubicaciones</h1>
                    <Button onClick={() => router.push('/locations/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Ubicación
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <LocationTable
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                />
                <LocationPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
} 