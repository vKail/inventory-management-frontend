'use client';

import { ShieldCheck } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import ConditionTable from '../components/condition-table';

export default function ConditionView() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6 overflow-hidden">
            {/* Breadcrumbs y título */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Configuración</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <ShieldCheck className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                <BreadcrumbPage>Condiciones</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h2 className="text-2xl font-bold tracking-tight">Lista de Condiciones</h2>
                    <p className="text-muted-foreground">Todas las condiciones registradas en el sistema</p>
                </div>
            </div>

            <ConditionTable />
        </div>
    );
} 