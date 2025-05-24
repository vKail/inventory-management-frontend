import ConditionFormView from "@/features/conditions/presentation/views/condition-form-view";

export default function CategoryFormEdit({ params }: { params: { id?: string } }) {
  return (
      <ConditionFormView params={{ id: params.id }} />
  );
}