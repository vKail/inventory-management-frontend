'use client';

import MaterialFormView from '@/features/materials/presentation/views/material-form-view';
import { useParams } from 'next/navigation';

export default function EditMaterialPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <MaterialFormView id={id} />
        </div>
    );
} 