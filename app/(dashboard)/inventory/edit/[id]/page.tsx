import { InventoryForm } from '@/features/inventory/presentation/components/inventory-form';
import { useInventoryStore } from '@/features/inventory/context/inventory-store';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function EditInventoryPage() {
    const { id } = useParams();
    const { getInventoryItem, selectedItem, loading } = useInventoryStore();

    useEffect(() => {
        if (id) {
            getInventoryItem(id as string);
        }
    }, [id, getInventoryItem]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!selectedItem) {
        return <div>Item no encontrado</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8">Editar Item</h1>
            <InventoryForm initialData={selectedItem} />
        </div>
    );
} 