'use client';

import MaterialFormView from '@/features/materials/presentation/views/material-form-view';

export default function NewMaterialPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <MaterialFormView id="new" />
        </div>
    );
}
