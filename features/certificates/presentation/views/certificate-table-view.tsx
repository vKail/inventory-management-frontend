'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { FileText } from 'lucide-react';
import { CertificateTable } from '../components/certificate-table';

export default function CertificateTableView() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Configuración</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <FileText className="inline mr-1 h-4 w-4 text-primary align-middle" />
                                <BreadcrumbPage>Actas</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-2xl font-bold tracking-tight">Lista de Actas</h2>
                    <p className="text-muted-foreground">Todas las actas registradas en el sistema</p>
                </div>
            </div>

            <CertificateTable
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
} 