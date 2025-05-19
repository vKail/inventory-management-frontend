import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Card } from '@/shared/components/ui/Card';
import { CategoryForm } from '../../../../features/categories/components/CategoryForm';
import { DepreciationForm } from '../../../../features/categories/components/DepreciationForm';


export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Nueva Categoría" 
        description="Complete los datos para crear una nueva categoría"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Detalles</h2>
          <p className="text-sm text-gray-600 mb-4">
            Información general de la categoría, como nombre, código, descripción y jerarquía.
          </p>
          <CategoryForm />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Depreciación</h2>
          <p className="text-sm text-gray-600 mb-4">
            Datos relacionados a la vida útil y el porcentaje de depreciación de la categoría.
          </p>
          <DepreciationForm />
        </Card>
      </div>
    </div>
  );
}