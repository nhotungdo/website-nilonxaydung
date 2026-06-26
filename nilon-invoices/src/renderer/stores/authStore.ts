import { create } from 'zustand';
import { authService } from '../services/authService';

export type UserRole = 'admin' | 'staff';

export interface User {
  username: string;
  role: UserRole;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  rememberMe: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
  
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateActivity: () => void;
  checkTimeout: () => void;
}

const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

export const useAuthStore = create<AuthState>((set, get) => {
  const storedUser = localStorage.getItem('nilon_user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const storedRemember = localStorage.getItem('nilon_remember') === 'true';
  const storedAuth = localStorage.getItem('nilon_is_auth') === 'true';
  const storedActivity = localStorage.getItem('nilon_last_activity');
  const lastActivity = storedActivity ? parseInt(storedActivity, 10) : Date.now();

  return {
    isAuthenticated: storedAuth,
    user: parsedUser,
    rememberMe: storedRemember,
    isLoading: false,
    error: null,
    lastActivity,

    login: async (username, password, rememberMe) => {
      set({ isLoading: true, error: null });
      
      const response = await authService.login(username, password);

      if (response.success && response.user) {
        set({
          isAuthenticated: true,
          user: response.user,
          rememberMe,
          isLoading: false,
          error: null,
          lastActivity: Date.now()
        });

        localStorage.setItem('nilon_last_activity', Date.now().toString());

        if (rememberMe) {
          localStorage.setItem('nilon_user', JSON.stringify(response.user));
          localStorage.setItem('nilon_remember', 'true');
          localStorage.setItem('nilon_is_auth', 'true');
        } else {
          localStorage.setItem('nilon_is_auth', 'true');
          localStorage.removeItem('nilon_user'); 
        }

        return true;
      }

      set({ isLoading: false, error: response.error || 'Đăng nhập thất bại.' });
      return false;
    },

    logout: () => {
      set({ isAuthenticated: false, user: null });
      localStorage.removeItem('nilon_is_auth');
      localStorage.removeItem('nilon_user');
      localStorage.removeItem('nilon_remember');
      localStorage.removeItem('nilon_last_activity');
    },

    clearError: () => set({ error: null }),

    updateActivity: () => {
      if (get().isAuthenticated) {
        const now = Date.now();
        set({ lastActivity: now });
        localStorage.setItem('nilon_last_activity', now.toString());
      }
    },

    checkTimeout: () => {
      const state = get();
      if (state.isAuthenticated) {
        const now = Date.now();
        if (now - state.lastActivity > SESSION_TIMEOUT_MS) {
          state.logout();
        }
      }
    }
  };
});

