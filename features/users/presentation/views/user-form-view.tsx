'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/features/users/context/user-store';
import { useRouter } from 'next/navigation';
import { IUser, UserFormValues } from '@/features/users/data/interfaces/user.interface';
import UserForm from '../components/user-form';
import { toast } from 'sonner';

export default function UserFormView({ params }: { params?: { id?: string } }) {
    const router = useRouter();
    const isEdit = params?.id !== undefined && params?.id !== 'new';

    const {
        getUserById,
        addUser,
        updateUser,
        loading,
    } = useUserStore();

    const [initialData, setInitialData] = useState<IUser | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params?.id) {
                const userData = await getUserById(params.id);
                if (userData) {
                    setInitialData(userData);
                }
            }
        };
        loadData();
    }, [isEdit, params?.id, getUserById]);

    const handleSubmit = async (data: UserFormValues) => {
        try {
            console.log('UserFormView received data:', data);
            console.log('Is edit mode:', isEdit, 'with ID:', params?.id);

            // Preparar los datos para enviar a la API
            const userData = {
                userName: data.userName,
                password: data.password,
                career: data.career || 'FISEI',
                userType: data.userType,
                status: data.status || 'ACTIVE',
                person: {
                    dni: data.person.dni,
                    firstName: data.person.firstName,
                    middleName: data.person.middleName || '',
                    lastName: data.person.lastName,
                    secondLastName: data.person.secondLastName || '',
                    email: data.person.email,
                    birthDate: data.person.birthDate || '',
                    phone: data.person.phone || ''
                }
            };

            console.log('Formatted userData to send:', userData);

            if (isEdit && params?.id) {
                console.log('Updating user with ID:', params.id);
                await updateUser(params.id, userData);
                toast.success('Usuario actualizado exitosamente');
            } else {
                console.log('Creating new user');
                await addUser(userData);
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
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
}