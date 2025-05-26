"use client";

import CategoryFormView from '@/features/categories/presentation/views/category-form-view';

export default function NewCategoryPage({ params }: { params: { id: string } }) {
  return <CategoryFormView id={params.id} />;
}