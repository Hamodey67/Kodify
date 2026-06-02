import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'cashier';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, passwordHash: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// In Electron, we can use window.api because it is declared globally in electron/preload.ts
declare global {
  interface Window {
    api: any;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await window.api.login(username, password);
      if (response) {
        set({ user: response, isLoading: false, error: null });
        return true;
      } else {
        set({ error: 'invalid_credentials', isLoading: false });
        return false;
      }
    } catch (err: any) {
      console.error('Store login error:', err);
      set({ error: err.message || 'unknown_error', isLoading: false });
      return false;
    }
  },
  logout: async () => {
    try {
      await window.api.logout();
    } catch (err) {
      console.error('Backend logout error:', err);
    }
    set({ user: null, error: null });
  },
  clearError: () => set({ error: null }),
}));
