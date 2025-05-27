'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { User, UserFormValues } from '@/features/users/data/interfaces/user.interface';
import UserForm from '../components/user-form';
import { toast } from 'sonner';

export default function UserFormView({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isEdit = params.id !== undefined && params.id !== 'new';

    const {
        getUserById,
        addUser,
        updateUser,
        loading,
    } = useUserStore();

    const [initialData, setInitialData] = useState<User | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params.id) {
                const userData = await getUserById(params.id);
                if (userData) {
                    setInitialData(userData);
                }
            }
        };
        loadData();
    }, [isEdit, params.id, getUserById]);

    const handleSubmit = async (data: UserFormValues) => {
        try {
            if (isEdit && params.id) {
                await updateUser(params.id, data);
                toast.success('Usuario actualizado exitosamente');
            } else {
                await addUser(data);
                toast.success('Usuario creado exitosamente');
            }
            router.push('/users');
        } catch (error) {
            console.error('Error al guardar el usuario:', error);
            toast.error('Error al guardar el usuario');
        }
    };

    return (
        <div className="space-y-6">
            <UserForm 
                initialValues={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
                id={isEdit ? params.id : undefined}
            />
        </div>
    );
}