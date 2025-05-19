import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { IUserResponse } from '@/features/users/data/interfaces/user.interface';
import { get } from 'http';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/auth.service';
import { ILogin } from '../data/interfaces/login.interface';

interface AuthSession {
  user: IUserResponse | null;
  token: string | null;
  role: string | null;
  getUser: () => IUserResponse | null;
  clearUser: () => void;
  login: (user: ILogin) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthSession>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null,
      getUser: () => get().user,
      clearUser: () => set({ user: null, token: null, role: null }),
      isAuthenticated: false,
      login: async user => {
        const response = await AuthService.getInstance().login(user);
        if (!response) {
          set({ user: null, token: null, role: null });
          return;
        }
        set({ user: response?.user, token: response?.token, role: response?.user.userType });
        set({ isAuthenticated: !!response?.token });
      },
      logout: async () => {
        await AuthService.getInstance().logout();
        set({ user: null, token: null, role: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user }),
    }
  )
);
