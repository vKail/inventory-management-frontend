'use client';

import { useEffect, useState } from 'react';
import { useConditionStore } from '@/features/conditions/context/condition-store';
import { useRouter } from 'next/navigation';
import { ICondition } from '@/features/conditions/data/interfaces/condition.interface';
import { ConditionForm } from '../components/condition-form';
import { ConditionFormValues } from '../../data/schemas/condition.schema';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronRight, PaletteIcon } from 'lucide-react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

export default function ConditionFormView({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isEdit = params.id !== undefined && params.id !== 'new';

    const {
        getConditionById,
        addCondition,
        updateCondition,
        loading,
    } = useConditionStore();

    const [initialData, setInitialData] = useState<Partial<ICondition> | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params.id) {
                const condition = await getConditionById(params.id);
                if (condition) {
                    setInitialData(condition);
                }
            }
        };
        loadData();
    }, [isEdit, params.id, getConditionById]);

    const handleSubmit = async (data: ConditionFormValues) => {
        try {
            if (isEdit && params.id) {
                await updateCondition(params.id, data);
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
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
}
