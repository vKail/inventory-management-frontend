'use client';

import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/features/categories/context/category-store';
import { useRouter, useParams } from 'next/navigation';
import { ICategory } from '@/features/categories/data/interfaces/category.interface';
import { CategoryForm } from '../components/category-form';
import { CategoryFormValues } from '../../data/schemas/category.schema';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tags } from 'lucide-react';

interface CategoryFormViewProps {
  id: string;
}

export default function CategoryFormView({ id }: CategoryFormViewProps) {
  const router = useRouter();
  const isEdit = id !== undefined && id !== 'new';

  const {
    getCategoryById,
    addCategory,
    updateCategory,
    loading,
  } = useCategoryStore();

  const [initialData, setInitialData] = useState<ICategory | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      if (isEdit && id) {
        const category = await getCategoryById(Number(id));
        if (category) {
          setInitialData(category);
        } else {
          toast.error('No se encontró la categoría');
          router.push('/categories');
        }
      }
    };
    loadData();
  }, [isEdit, id, getCategoryById, router]);

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEdit && id) {
        await updateCategory(Number(id), data);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await addCategory(data);
        toast.success('Categoría creada exitosamente');
      }
      router.push('/categories');
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      toast.error('Error al guardar la categoría');
    }
  };

  return (
    <div className="space-y-4">
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
              <BreadcrumbLink href="/categories">
                <Tags className="inline mr-1 h-4 w-4 text-primary align-middle" />
                Categorías
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isEdit ? 'Editar' : 'Nueva'} Categoría
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CategoryForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
}
