/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Tags } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import CategoryTable from '../components/category-table';

export default function CategoryView() {
  return (
    <div className="flex flex-col items-center space-y-6 px-6 w-full">
      {/* Breadcrumbs y título */}
      <div className="mb-2 w-full max-w-[1200px]">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">Configuración</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Tags className="inline mr-1 h-4 w-4 text-red-600 align-middle" />
              <BreadcrumbPage>Categorías</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-2xl font-bold tracking-tight">Lista de Categorías</h2>
        <p className="text-muted-foreground">Todas las categorías registradas en el sistema</p>
      </div>

      <CategoryTable />
    </div>
  );
}