"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UserTable } from '../components/user-table';
import { UserPagination } from '../components/user-pagination';
import { UserFilter } from '../components/user-filter';
import { useUserFilters } from '../../hooks/use-user-filters';
import { Users } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function UserView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { totalPages, handleFilterChange } = useUserFilters(currentPage, itemsPerPage);

  // Leer página de la URL al cargar el componente
  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);

    // Actualizar URL con la nueva página
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">
                Administración
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Users className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <UserFilter onFilterChange={handleFilterChange} />
        <UserTable />
        <UserPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}