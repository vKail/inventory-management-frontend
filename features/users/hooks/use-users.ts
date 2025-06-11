import { useEffect, useState } from 'react';
import { UserService } from '../services/user.service';
import { IUser } from '../data/interfaces/user.interface';

export const useUsers = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (page: number = 1, limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await UserService.getInstance().getUsers(page, limit);
            setUsers(response.records);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await UserService.getInstance().deleteUser(id);
            await fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (user: Partial<IUser>) => {
        try {
            setLoading(true);
            const response = await UserService.getInstance().createUser(user);
            await fetchUsers(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, user: Partial<IUser>) => {
        try {
            setLoading(true);
            const response = await UserService.getInstance().updateUser(id, user);
            await fetchUsers(); // Refresh the list
            return response;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        handleDelete,
        handleCreate,
        handleUpdate
    };
};