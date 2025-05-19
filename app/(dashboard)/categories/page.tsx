"use client";

import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { CategoryFilters } from '@/features/categories/components/CategoryFilters';
import { CategoryTable } from '@/features/categories/components/CategoryTable';
import { getCategories } from '@/features/categories/services/categories.service';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
	<div className="space-y-6">
	  <PageHeader 
		title="Lista de Categorías" 
		description="Todas las categorías registradas en el sistema"
		action={{
		  href: '/categories/new',
		  label: 'Nueva Categoría'
		}}
	  />

	  <CategoryFilters />

	  <Card>
		<CategoryTable data={categories} />
	  </Card>
	</div>
  );
}