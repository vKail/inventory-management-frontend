/* eslint-disable react/react-in-jsx-scope */
'use client';

import { useEffect, useState } from 'react';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { useRouter } from 'next/navigation';
import { IMaterial } from '@/features/materials/data/interfaces/material.interface';
import { MaterialForm } from '../components/material-form';
import { MaterialFormValues } from '../../data/schemas/material.schema';
import { toast } from 'sonner';

export default function MaterialFormView({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isEdit = params.id !== undefined && params.id !== 'new';

    const {
        getMaterialById,
        addMaterial,
        updateMaterial,
        loading,
    } = useMaterialStore();

    const [initialData, setInitialData] = useState<IMaterial | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params.id) {
                const material = await getMaterialById(Number(params.id));
                if (material) {
                    setInitialData(material);
                }
            }
        };
        loadData();
    }, [isEdit, params.id, getMaterialById]);

    const handleSubmit = async (data: MaterialFormValues) => {
        try {
            if (isEdit && params.id) {
                await updateMaterial(Number(params.id), data);
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
                initialValues={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
                id={isEdit ? Number(params.id) : undefined}
            />
        </div>
    );
} 