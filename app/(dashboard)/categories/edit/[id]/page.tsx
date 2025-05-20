import CategoryFormView from '@/features/categories/presentation/views/CategoryFormView';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return <CategoryFormView params={params} />;
}