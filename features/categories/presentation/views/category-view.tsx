/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Tags } from 'lucide-react';
import { CategoryTable } from '../components/category-table';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useCategoryStore } from '../../context/category-store';
import { useEffect } from 'react';

export default function CategoryView() {
  const { getCategories } = useCategoryStore();

  useEffect(() => {
    getCategories(1, 10);
  }, [getCategories]);

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
                <Tags className="inline mr-1 h-4 w-4 text-primary align-middle" />
                <BreadcrumbPage>Categorías</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-2xl font-bold tracking-tight">Lista de Categorías</h2>
          <p className="text-muted-foreground">Todas las categorías registradas en el sistema</p>
        </div>
      </div>

      <CategoryTable currentPage={1} itemsPerPage={10} />
    </div>
  );
}