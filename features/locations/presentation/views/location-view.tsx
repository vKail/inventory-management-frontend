'use client';

import { useState, useEffect } from 'react';
import { LocationTable } from '../components/location-table';
import { LocationPagination } from '../components/location-pagination';
import { MapPin } from 'lucide-react';
import { useLocationStore } from '../../context/location-store';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function LocationView() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const { getLocations } = useLocationStore();

    useEffect(() => {
        const loadLocations = async () => {
            const response = await getLocations(currentPage, itemsPerPage);
            setTotalPages(response.pages);
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