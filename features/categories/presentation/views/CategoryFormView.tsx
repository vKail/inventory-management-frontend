/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Tags } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import CategoryForm from '../components/CategoryForm';

export default function CategoryFormView({ params }: { params: { id?: string } }) {
  const isEdit = !!params.id;

  return (
    <div className="flex w-full flex-col items-center px-6">
      <div className="w-full max-w-[1200px]">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Configuración</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">
                <div className="flex items-center">
                  <Tags className="w-4 h-4 text-red-600 mr-1" />
                  Categorías
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? "Editar Categoría" : "Nueva Categoría"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <h2 className="text-xl font-bold mb-2">
                {isEdit ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isEdit
                  ? "Modifique los detalles de la categoría"
                  : "Complete todos los campos para crear una nueva categoría"}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <CategoryForm params={params} />
          </div>
        </div>
      </div>
    </div>
  );
}