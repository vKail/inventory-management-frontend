'use client';

import { useEffect, useState } from 'react';
import { useStateStore } from '@/features/states/context/state-store';
import { useRouter, useParams } from 'next/navigation';
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

export default function StateFormView() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const isEdit = id !== undefined && id !== 'new';

    const {
        getStateById,
        addState,
        updateState,
        loading,
    } = useStateStore();

    const [initialData, setInitialData] = useState<IState | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && id) {
                const state = await getStateById(Number(id));
                if (state) {
                    setInitialData(state);
                }
            }
        };
        loadData();
    }, [isEdit, id, getStateById]);

    const handleSubmit = async (data: StateFormValues) => {
        try {
            if (isEdit && id) {
                await updateState(Number(id), data);
                toast.success('Estado actualizado exitosamente');
                router.push('/states');
            } else {
                await addState(data);
                toast.success('Estado creado exitosamente');
                router.push('/states');
            }
        } catch (error: any) {
            console.error('Error al guardar el estado:', error);
            let errorMsg = 'Error al guardar el estado';
            if (error?.response?.data?.message) {
                if (Array.isArray(error.response.data.message.content) && error.response.data.message.content.length > 0) {
                    errorMsg = error.response.data.message.content[0];
                } else if (typeof error.response.data.message === 'string') {
                    errorMsg = error.response.data.message;
                }
            } else if (error?.message) {
                errorMsg = error.message;
            }
            toast.error(errorMsg);
        }
    };

    return (
        <div className="space-y-6">
            <div className="w-full">
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

            <div className="w-full">
                <StateForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                />
            </div>
        </div>
    );
} 