'use client';

import { useEffect, useState } from 'react';
import { useStateStore } from '@/features/states/context/state-store';
import { useRouter } from 'next/navigation';
import { IState } from '@/features/states/data/interfaces/state.interface';
import { StateForm } from '../components/state-form';
import { StateFormValues } from '../../data/schemas/state.schema';
import { toast } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AlertCircle } from 'lucide-react';

interface StateFormViewProps {
    params: {
        id?: string;
    };
}

export default function StateFormView({ params }: StateFormViewProps) {
    const router = useRouter();
    const isEdit = params.id !== undefined && params.id !== 'new';

    const {
        getStateById,
        addState,
        updateState,
        loading,
    } = useStateStore();

    const [initialData, setInitialData] = useState<IState | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params.id) {
                const state = await getStateById(Number(params.id));
                if (state) {
                    setInitialData(state);
                }
            }
        };
        loadData();
    }, [isEdit, params.id, getStateById]);

    const handleSubmit = async (data: StateFormValues) => {
        try {
            if (isEdit && params.id) {
                await updateState(Number(params.id), data);
                toast.success('Estado actualizado exitosamente');
            } else {
                await addState(data);
                toast.success('Estado creado exitosamente');
            }
            router.push('/states');
        } catch (error) {
            console.error('Error al guardar el estado:', error);
            toast.error('Error al guardar el estado');
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
            <div className="mb-2 w-[1200px] mx-auto">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">
                                Configuración
                            </span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <AlertCircle className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/states">Estados</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{isEdit ? "Editar Estado" : "Nuevo Estado"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="w-full max-w-[1200px]">
                <StateForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                />
            </div>
        </div>
    );
} 