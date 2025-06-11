'use client';

import { Package } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import MaterialTable from '../components/material-table';

export default function MaterialView() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 overflow-hidden">
            {/* Breadcrumbs y título */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Inventario</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Package className="inline mr-1 h-4 w-4 text-red-600 align-middle" />
                                <BreadcrumbPage>Materiales</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h2 className="text-2xl font-bold tracking-tight">Lista de Materiales</h2>
                    <p className="text-muted-foreground">Todos los materiales registrados en el sistema</p>
                </div>
            </div>

            <MaterialTable />
        </div>
    );
} 