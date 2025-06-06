'use client';

import { useParams } from 'next/navigation';
import CategoryFormView from '@/features/categories/presentation/views/category-form-view';

export default function CategoryFormEdit() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CategoryFormView id={id} />
    </div>
  );
}
