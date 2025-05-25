'use client';

import { StateForm } from '@/features/states/presentation/components/state-form';
import { useStateStore } from '@/features/states/context/state-store';
import { StateFormValues } from '@/features/states/data/schemas/state.schema';

export default function NewStatePage() {
    const { addState, loading } = useStateStore();

    const handleSubmit = async (data: StateFormValues) => {
        await addState(data);
    };

    return (
        <StateForm
            onSubmit={handleSubmit}
            isLoading={loading}
        />
    );
} 