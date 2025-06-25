import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser, PaginatedResponse, PersonApiResponse } from '../data/interfaces/user.interface';
import { UserService } from '../services/user.service';

interface UserStore {
    users: IUser[];
    filteredUsers: IUser[];
    searchTerm: string;
    statusFilter: string;
    userTypeFilter: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getUsers: (page?: number, limit?: number, filters?: { userName?: string; status?: string; userType?: string }) => Promise<void>;
    getUserById: (userId: string) => Promise<IUser | undefined>;
    addUser: (user: Partial<IUser>) => Promise<void>;
    updateUser: (userId: string, user: Partial<IUser>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    getPersonById: (id: string) => Promise<PersonApiResponse["data"] | null>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: string) => void;
    setUserTypeFilter: (userType: string) => void;
    clearFilters: () => void;
}

const STORE_NAME = 'user-storage';

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            users: [],
            filteredUsers: [],
            searchTerm: '',
            statusFilter: 'all',
            userTypeFilter: 'all',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                set({ searchTerm: term });
                get().getUsers(1, 10, {
                    userName: term,
                    status: get().statusFilter !== 'all' ? get().statusFilter : undefined,
                    userType: get().userTypeFilter !== 'all' ? get().userTypeFilter : undefined,
                });
            },

            setStatusFilter: (status: string) => {
                set({ statusFilter: status });
                get().getUsers(1, 10, {
                    userName: get().searchTerm,
                    status: status !== 'all' ? status : undefined,
                    userType: get().userTypeFilter !== 'all' ? get().userTypeFilter : undefined,
                });
            },

            setUserTypeFilter: (userType: string) => {
                set({ userTypeFilter: userType });
                get().getUsers(1, 10, {
                    userName: get().searchTerm,
                    status: get().statusFilter !== 'all' ? get().statusFilter : undefined,
                    userType: userType !== 'all' ? userType : undefined,
                });
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getUsers(currentPage, 10, {
                    userName: get().searchTerm,
                    status: get().statusFilter !== 'all' ? get().statusFilter : undefined,
                    userType: get().userTypeFilter !== 'all' ? get().userTypeFilter : undefined,
                });
            },

            getUsers: async (page = 1, limit = 10, filters = {}) => {
                try {
                    set({ loading: true, error: null });
                    const response = await UserService.getInstance().getUsers(page, limit, filters);

                    if (response.pages > 0 && page > response.pages) {
                        await get().getUsers(1, limit, filters);
                        return;
                    }

                    set({
                        users: response.records,
                        filteredUsers: response.records,
                        currentPage: response.page,
                        totalPages: response.pages,
                        loading: false,
                        error: null
                    });
                } catch (error) {
                    console.error('Error fetching users:', error);
                    set({
                        error: 'Error al cargar los usuarios',
                        loading: false,
                        users: [],
                        filteredUsers: [],
                        currentPage: 1,
                        totalPages: 1
                    });
                }
            },

            getUserById: async (userId: string) => {
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
                    await get().getUsers(1, 10);
                } catch (error) {
                    console.error('Error adding user:', error);
                    set({
                        error: 'Error al crear el usuario',
                        loading: false
                    });
                    throw error;
                }
            },

            updateUser: async (id: string, user: Partial<IUser>) => {
                try {
                    set({ loading: true, error: null });
                    await UserService.getInstance().updateUser(id, user);
                    await get().refreshTable();
                } catch (error) {
                    console.error('Error updating user:', error);
                    set({
                        error: 'Error al actualizar el usuario',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteUser: async (userId: string) => {
                try {
                    set({ loading: true, error: null });
                    await UserService.getInstance().deleteUser(userId);

                    const { currentPage, users } = get();
                    if (users.length === 1 && currentPage > 1) {
                        await get().getUsers(currentPage - 1, 10);
                    } else {
                        await get().refreshTable();
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    set({
                        error: 'Error al eliminar el usuario',
                        loading: false
                    });
                    throw error;
                }
            },

            getPersonById: async (id: string) => {
                try {
                    return await UserService.getInstance().getPersonById(id);
                } catch (error) {
                    set({
                        error: 'Error al cargar la persona',
                        loading: false
                    });
                    throw error;
                }
            },

            clearFilters: () => {
                set({
                    searchTerm: '',
                    statusFilter: 'all',
                    userTypeFilter: 'all',
                });
                get().getUsers(1, 10, {});
            }
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 