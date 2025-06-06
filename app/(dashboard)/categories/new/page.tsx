import CategoryFormView from '@/features/categories/presentation/views/category-form-view';

export default function NewCategoryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CategoryFormView id="new" />
    </div>
  );
}