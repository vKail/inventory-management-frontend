'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MaterialForm } from '@/features/materials/presentation/components/material-form';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { IMaterial } from '@/features/materials/data/interfaces/material.interface';
import { toast } from 'sonner';

export default function EditMaterialPage() {
    const router = useRouter();
    const params = useParams();
    const { getMaterialById, updateMaterial, loading } = useMaterialStore();
    const [material, setMaterial] = useState<IMaterial | null>(null);

    useEffect(() => {
        const loadMaterial = async () => {
            try {
                const id = Number(params.id);
                if (isNaN(id)) {
                    toast.error('ID de material inválido');
                    router.push('/materials');
                    return;
                }

                const materialData = await getMaterialById(id);
                if (!materialData) {
                    toast.error('Material no encontrado');
                    router.push('/materials');
                    return;
                }

                setMaterial(materialData);
            } catch (error) {
                console.error('Error loading material:', error);
                toast.error('Error al cargar el material');
                router.push('/materials');
            }
        };

        loadMaterial();
    }, [params.id, getMaterialById, router]);

    const handleSubmit = async (formData: Partial<IMaterial>) => {
        try {
            if (!material?.id) return;

            await updateMaterial(material.id, formData);
            toast.success('Material actualizado exitosamente');
            router.push('/materials');
        } catch (error) {
            console.error('Error updating material:', error);
            toast.error('Error al actualizar el material');
        }
    };

    if (loading && !material) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-2xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Editar Material</h1>
                <p className="text-gray-600">Actualiza la información del material</p>
            </div>

            {material && (
                <MaterialForm
                    initialValues={material}
                    onSubmit={handleSubmit}
                    isEditing={true}
                    id={material.id}
                />
            )}
        </div>
    );
} 