import WarehouseForm from "@/features/warehouses/presentation/components/warehouse-form";

interface PageProps {
  params: {
    id: string
  }
}

export default function EditWarehousePage({ params }: PageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <WarehouseForm id={params.id} />
    </div>
  );
}
