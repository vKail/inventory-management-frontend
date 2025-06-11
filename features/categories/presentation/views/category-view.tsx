/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useState, useEffect } from 'react';
import { CategoryTable } from '../components/category-table';
import { CategoryPagination } from '../components/category-pagination';
import { Tags } from 'lucide-react';
import { useCategoryStore } from '../../context/category-store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CategoryView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const { getCategories } = useCategoryStore();

  useEffect(() => {
    const loadCategories = async () => {
      const response = await getCategories(currentPage, itemsPerPage);
      setTotalPages(response.pages);
    };
    loadCategories();
  }, [currentPage, getCategories]);

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
              <Tags className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Categorías</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-4">
        <CategoryTable
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
        <CategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}