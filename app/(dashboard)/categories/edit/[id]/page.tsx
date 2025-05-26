import CategoryFormView from "@/features/categories/presentation/views/category-form-view";

export default function CategoryFormEdit({ params }: { params: { id: string } }) {
  return (
    <CategoryFormView id={params.id} />
  );
}