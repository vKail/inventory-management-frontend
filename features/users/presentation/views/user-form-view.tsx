'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { User } from '@/features/users/interfaces/user.interface';
import UserForm from '../components/user-form';
import { UserFormValues } from '@/features/users/interfaces/user.interface';
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
            <UserForm id={isEdit ? params.id : undefined} />
        </div>
    );
}