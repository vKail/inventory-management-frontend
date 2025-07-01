'use client';

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { MapPin } from 'lucide-react';
import { LocationTable } from '../components/location-table';

export default function LocationView() {
    return (
        <div className="flex-1 space-y-4 overflow-hidden">
            <div className="w-full">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <Breadcrumb className="mb-6">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <span className="text-muted-foreground font-medium">Configuración</span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <MapPin className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                    <BreadcrumbPage>Ubicaciones</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Lista de Ubicaciones</h2>
                <p className="text-muted-foreground">Todas las ubicaciones registradas en el sistema</p>
                <LocationTable />
            </div>
        </div>
    );
}