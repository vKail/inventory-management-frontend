'use client';

import { Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { LocationTable } from '@/features/locations/presentation/components/location-table';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

function LocationsContent() {
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

                <h1 className="text-2xl font-bold">Ubicaciones</h1>
            </div>

            <LocationTable />
        </div>
    );
}

export default function LocationsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Suspense fallback={<div>Loading...</div>}>
                <LocationsContent />
            </Suspense>
        </div>
    );
} 