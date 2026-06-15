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
  resetStuckState: () => void;
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
      // Safety net: never let inputs stay frozen (disabled) if the login
      // IPC call hangs. If no response within the timeout, fail gracefully
      // and re-enable the form so the cashier can retry.
      const LOGIN_TIMEOUT_MS = 5000;
      const loginPromise = window.api.login(username, password);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), LOGIN_TIMEOUT_MS)
      );

      const response = await Promise.race([loginPromise, timeoutPromise]);
      if (response) {
        set({ user: response as User, isLoading: false, error: null });
        return true;
      } else {
        set({ error: 'invalid_credentials', isLoading: false });
        return false;
      }
    } catch (err: any) {
      console.error('Store login error:', err);
      const code = err?.message === 'timeout' ? 'timeout' : (err?.message || 'unknown_error');
      set({ error: code, isLoading: false });
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
  resetStuckState: () => set({ isLoading: false }),
}));
