import WarehouseForm from "@/features/warehouses/presentation/components/warehouse-form";
import { useParams } from "next/navigation";

export default function EditWarehousePage() {
  const params = useParams()
  const id = params?.id as string;
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <WarehouseForm id={id} />
    </div>
  );
}
