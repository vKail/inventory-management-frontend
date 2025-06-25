'use client';

import StateFormView from '@/features/states/presentation/views/state-form-view';

export default function NewStatePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <StateFormView />;
        </div>
    )
}