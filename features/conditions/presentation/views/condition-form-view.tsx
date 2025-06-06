'use client';

import { useEffect, useState } from 'react';
import { useConditionStore } from '@/features/conditions/context/condition-store';
import { useRouter } from 'next/navigation';
import { ICondition } from '@/features/conditions/data/interfaces/condition.interface';
import { ConditionForm } from '../components/condition-form';
import { ConditionFormValues } from '../../data/schemas/condition.schema';
import { toast } from 'sonner';

interface ConditionFormViewProps {
    id: string;
}

export default function ConditionFormView({ id }: ConditionFormViewProps) {
    const router = useRouter();
    const isEdit = id !== undefined && id !== 'new';

    const {
        getConditionById,
        addCondition,
        updateCondition,
        loading,
    } = useConditionStore();

    const [initialData, setInitialData] = useState<Partial<ICondition> | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && id) {
                const condition = await getConditionById(id);
                if (condition) {
                    setInitialData(condition);
                } else {
                    toast.error('No se encontró la condición');
                    router.push('/conditions');
                }
            }
        };
        loadData();
    }, [isEdit, id, getConditionById, router]);

    const handleSubmit = async (data: ConditionFormValues) => {
        try {
            if (isEdit && id) {
                await updateCondition(id, data);
                toast.success('Condición actualizada exitosamente');
            } else {
                await addCondition(data);
                toast.success('Condición creada exitosamente');
            }
            router.push('/conditions');
        } catch (error) {
            console.error('Error al guardar la condición:', error);
            toast.error('Error al guardar la condición');
        }
    };

    return (
        <div className="space-y-6">
            <ConditionForm
                id={id}
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
}
