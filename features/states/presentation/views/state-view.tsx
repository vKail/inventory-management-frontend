"use client";

import { useState, useEffect } from 'react';
import { StateTable } from '../components/state-table';
import { StatePagination } from '../components/state-pagination';
import { AlertCircle } from 'lucide-react';
import { useStateStore } from '../../context/state-store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function StateView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { getStates } = useStateStore();

  useEffect(() => {
    const loadStates = async () => {
      const response = await getStates(currentPage, itemsPerPage);
      setTotalPages(response.pages);
    };
    loadStates();
  }, [currentPage, getStates]);

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
              <AlertCircle className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Estados</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Lista de Estados</h2>
        <p className="text-muted-foreground">
          Todos los estados registrados en el sistema
        </p>
      </div>

      <div className="space-y-4">
        <StateTable
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
        <StatePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
