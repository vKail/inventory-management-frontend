import ConditionFormView from '@/features/conditions/presentation/views/condition-form-view';

export default function NewConditionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ConditionFormView id="new" />;
    </div>
  )
} 