import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Package } from 'lucide-react';
import { InventoryForm } from '../components/inventory-form';
import { useInventoryStore } from '../../context/inventory-store';

export default function InventoryFormView() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEditMode = Boolean(id);
    const { getInventoryItem, selectedItem, loading, error } = useInventoryStore();

    useEffect(() => {
        if (isEditMode && id) {
            getInventoryItem(id);
        }
    }, [isEditMode, id, getInventoryItem]);

    return (
        <div className="container mx-auto">
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Operaciones</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Package className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/inventory">Inventario</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{isEditMode ? 'Editar Item' : 'Nuevo Item'}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">{error}</div>}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <InventoryForm mode={isEditMode ? 'edit' : 'create'} />
            )}
        </div>
    );
} 