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
      clearUser: () => set({ user: null, token: null, role: null, isAuthenticated: false }),
      isAuthenticated: false,
      login: async user => {
        try {
          console.log('Auth store: Starting login...');
          const response = await AuthService.getInstance().login(user);
          console.log('Auth store: Login response:', response);

          if (response?.token && response?.user) {
            console.log('Auth store: Setting authentication state...');
            set({
              user: response.user,
              token: response.token,
              role: response.user.userType,
              isAuthenticated: true
            });
            console.log('Auth store: Authentication state set successfully');
          } else {
            console.error('Auth store: Invalid login response - no token or user');
            throw new Error('Invalid login response');
          }
        } catch (error) {
          console.error('Auth store: Login error:', error);
          set({ user: null, token: null, role: null, isAuthenticated: false });
          throw error;
        }
      },
      logout: async () => {
        try {
          await AuthService.getInstance().logout();
        } catch (error) {
          console.error('Auth store: Logout error:', error);
        } finally {
          set({ user: null, token: null, role: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
