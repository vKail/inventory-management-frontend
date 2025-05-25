'use client';

import { useEffect, useState } from 'react';
import { StateForm } from '@/features/states/presentation/components/state-form';
import { useStateStore } from '@/features/states/context/state-store';
import { StateFormValues } from '@/features/states/data/schemas/state.schema';
import { IState } from '@/features/states/data/interfaces/state.interface';

interface EditStatePageProps {
    params: {
        id: string;
    };
}

export default function EditStatePage({ params }: EditStatePageProps) {
    const id = params.id;
    const { getStateById, updateState, loading } = useStateStore();
    const [state, setState] = useState<IState | undefined>(undefined);

    useEffect(() => {
        const loadState = async () => {
            const stateData = await getStateById(Number(id));
            setState(stateData);
        };
        loadState();
    }, [id, getStateById]);

    const handleSubmit = async (data: StateFormValues) => {
        await updateState(Number(id), data);
    };

    return (
        <StateForm
            initialData={state}
            onSubmit={handleSubmit}
            isLoading={loading}
        />
    );
} 