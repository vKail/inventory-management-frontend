import { InventoryForm } from '@/features/inventory/presentation/components/inventory-form';

export default function CreateInventoryPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8">Crear Nuevo Item</h1>
            <InventoryForm />
        </div>
    );
} 