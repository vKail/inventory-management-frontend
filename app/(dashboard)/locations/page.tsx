'use client';

import { MapPin } from 'lucide-react';
import { LocationTable } from '@/features/locations/presentation/components/location-table';
import { LocationPagination } from '@/features/locations/presentation/components/location-pagination';
import { LocationFilter } from '@/features/locations/presentation/components/location-filter';
import { useLocationFilters } from '@/features/locations/hooks/use-location-filters';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function LocationsPage() {
    const {
        filters,
        currentPage,
        totalPages,
        handleSearch,
        handleClear,
        handlePageChange,
    } = useLocationFilters();

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
                </div>
            </div>

            <div className="space-y-4">
                <LocationFilter
                    filters={filters}
                    onSearch={handleSearch}
                    onClear={handleClear}
                />
                <LocationTable
                    currentPage={currentPage}
                    itemsPerPage={10}
                />
                <LocationPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
} 