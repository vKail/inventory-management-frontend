import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const UserForm = dynamic(() => import('@/features/users/presentation/components/user-form'), {
    ssr: false
});

export const metadata: Metadata = {
    title: 'Editar Usuario | Inventory Management',
    description: 'Editar información del usuario',
};

interface EditUserPageProps {
    params: {
        id: string;
    };
}

export default function EditUserPage({ params }: EditUserPageProps) {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        }>
            <UserForm id={params.id} />
        </Suspense>
    );
}
