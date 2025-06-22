"use client";

import { useState, useEffect } from 'react';
import { StateTable } from '../components/state-table';
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
  const itemsPerPage = 10;
  const { getStates, totalPages } = useStateStore();

  useEffect(() => {
    const loadStates = async () => {
      await getStates(currentPage, itemsPerPage);
    };
    loadStates();
  }, [currentPage, getStates]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 overflow-hidden">
      {/* Breadcrumbs y título */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground font-medium">
                  Configuración
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <AlertCircle className="inline mr-1 h-4 w-4 text-red-600 align-middle" />
                <BreadcrumbPage>Estados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-2xl font-bold tracking-tight">Lista de Estados</h2>
          <p className="text-muted-foreground">Todos los estados registrados en el sistema</p>
        </div>
      </div>

      <StateTable
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
