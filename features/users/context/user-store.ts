import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { IUser, PaginatedResponse, PersonApiResponse } from '../data/interfaces/user.interface';
import { UserService } from '../services/user.service';

interface UserStore {
    users: IUser[];
    filteredUsers: IUser[];
    searchTerm: string;
    statusFilter: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getUsers: (page?: number, limit?: number) => Promise<void>;
    getUserById: (userId: string) => Promise<IUser | undefined>;
    addUser: (user: Partial<IUser>) => Promise<void>;
    updateUser: (userId: string, user: Partial<IUser>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    getPersonById: (id: string) => Promise<PersonApiResponse["data"] | null>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: string) => void;
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
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                const { users, statusFilter } = get();
                const filtered = users.filter((user) => {
                    const matchesSearch = user.userName.toLowerCase().includes(term.toLowerCase()) ||
                        user.person?.firstName?.toLowerCase().includes(term.toLowerCase()) ||
                        user.person?.lastName?.toLowerCase().includes(term.toLowerCase()) ||
                        user.person?.email?.toLowerCase().includes(term.toLowerCase());

                    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

                    return matchesSearch && matchesStatus;
                });
                set({ searchTerm: term, filteredUsers: filtered });
            },

            setStatusFilter: (status: string) => {
                const { users, searchTerm } = get();
                const filtered = users.filter((user) => {
                    const matchesSearch = searchTerm === '' ||
                        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.person?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.person?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.person?.email?.toLowerCase().includes(searchTerm.toLowerCase());

                    const matchesStatus = status === 'all' || user.status === status;

                    return matchesSearch && matchesStatus;
                });
                set({ statusFilter: status, filteredUsers: filtered });
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getUsers(currentPage, 10);
            },

            getUsers: async (page = 1, limit = 10) => {
                try {
                    set({ loading: true, error: null });
                    const response = await UserService.getInstance().getUsers(page, limit);

                    if (response.pages > 0 && page > response.pages) {
                        await get().getUsers(1, limit);
                        return;
                    }

                    const { searchTerm, statusFilter } = get();
                    const allUsers = response.records;

                    const filtered = allUsers.filter((user) => {
                        const matchesSearch = searchTerm === '' ||
                            user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.person?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.person?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.person?.email?.toLowerCase().includes(searchTerm.toLowerCase());

                        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

                        return matchesSearch && matchesStatus;
                    });

                    set({
                        users: allUsers,
                        filteredUsers: filtered,
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
                const { users } = get();
                set({
                    searchTerm: '',
                    statusFilter: 'all',
                    filteredUsers: users
                });
            }
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 