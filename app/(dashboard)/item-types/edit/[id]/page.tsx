import ItemTypeForm from '@/features/item-types/presentation/components/item-type-form'

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditItemTypePage({ params }: PageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ItemTypeForm id={params.id} />
    </div>
  );
}
