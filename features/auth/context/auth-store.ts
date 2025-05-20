import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/auth.service';
import { ILogin, IUserAuth } from '../data/interfaces/login.interface';

interface AuthSession {
  user: IUserAuth | null;
  token: string | null;
  role: string | null;
  getUser: () => IUserAuth | null;
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
