import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser, PaginatedResponse } from '../data/interfaces/user.interface';
import { UserService } from '../services/user.service';

interface UserStore {
    users: IUser[];
    loading: boolean;
    error: string | null;
    getUsers: (page?: number, limit?: number) => Promise<PaginatedResponse<IUser>>;
    getUserById: (userId: number) => Promise<IUser | undefined>;
    addUser: (user: Partial<IUser>) => Promise<void>;
    updateUser: (userId: number, user: Partial<IUser>) => Promise<void>;
    deleteUser: (userId: number) => Promise<void>;
}

const STORE_NAME = 'user-storage';

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            users: [],
            loading: false,
            error: null,

            getUsers: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await UserService.getInstance().getUsers(page, limit);

                    if (response && response.records) {
                        set({
                            users: response.records,
                            loading: false,
                            error: null
                        });
                        return response;
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    console.error('Error in getUsers:', error);
                    set({
                        error: 'Error al cargar los usuarios',
                        loading: false,
                        users: []
                    });
                    throw error;
                }
            },

            getUserById: async (userId: number) => {
                try {
                    return await UserService.getInstance().getUserById(userId);
                } catch {
                    set({ error: 'Error al cargar el usuario' });
                    return undefined;
                }
            },

            addUser: async (user: Partial<IUser>) => {
                try {
                    set({ loading: true, error: null });
                    await UserService.getInstance().createUser(user);
                    await get().getUsers();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error adding user:', error);
                    set({
                        error: 'Error al crear el usuario',
                        loading: false
                    });
                    throw error;
                }
            },

            updateUser: async (id: number, user: Partial<IUser>) => {
                try {
                    set({ loading: true, error: null });
                    await UserService.getInstance().updateUser(id, user);
                    await get().getUsers();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error updating user:', error);
                    set({
                        error: 'Error al actualizar el usuario',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteUser: async (userId: number) => {
                try {
                    set({ loading: true, error: null });
                    await UserService.getInstance().deleteUser(userId);
                    const newUsers = get().users.filter(u => u.id !== userId);
                    set({ users: newUsers, loading: false });
                } catch (error) {
                    console.error('Error deleting user:', error);
                    set({
                        error: 'Error al eliminar el usuario',
                        loading: false
                    });
                    throw error;
                }
            },
        }),
        {
            name: STORE_NAME,
        }
    )
); 