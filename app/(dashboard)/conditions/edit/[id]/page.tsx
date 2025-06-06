import ConditionFormView from "@/features/conditions/presentation/views/condition-form-view";
import { useParams } from "next/navigation";

export default function ConditionFormEdit() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ConditionFormView id={id} />
    </div>
  );
}