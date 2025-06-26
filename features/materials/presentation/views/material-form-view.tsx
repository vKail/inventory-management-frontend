'use client';

import { useEffect, useState } from 'react';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { useRouter } from 'next/navigation';
import { IMaterial } from '@/features/materials/data/interfaces/material.interface';
import { MaterialForm } from '../components/material-form';
import { MaterialFormValues } from '../../data/schemas/material.schema';
import { toast } from 'sonner';

interface MaterialFormViewProps {
    id: string;
}

export default function MaterialFormView({ id }: MaterialFormViewProps) {
    const router = useRouter();
    const isEdit = id !== undefined && id !== 'new';

    const {
        getMaterialById,
        addMaterial,
        updateMaterial,
        loading,
    } = useMaterialStore();

    const [initialData, setInitialData] = useState<Partial<IMaterial> | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && id) {
                const material = await getMaterialById(Number(id));
                if (material) {
                    setInitialData(material);
                } else {
                    toast.error('No se encontró el material');
                    router.push('/materials');
                }
            }
        };
        loadData();
    }, [isEdit, id, getMaterialById, router]);

    const handleSubmit = async (data: MaterialFormValues) => {
        try {
            if (isEdit && id) {
                await updateMaterial(Number(id), data);
                toast.success('Material actualizado exitosamente');
            } else {
                await addMaterial(data);
                toast.success('Material creado exitosamente');
            }
            router.push('/materials');
        } catch (error) {
            console.error('Error al guardar el material:', error);
            toast.error('Error al guardar el material');
        }
    };

    return (
        <div className="space-y-6">
            <MaterialForm
                id={id}
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
} 