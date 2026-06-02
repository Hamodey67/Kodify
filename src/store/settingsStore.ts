import { create } from 'zustand';

interface SettingsState {
  settings: Record<string, string>;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  saveSettings: (settingsMap: Record<string, string>) => Promise<boolean>;
  getSetting: (key: string, defaultValue?: string) => string;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: {},
  isLoading: false,
  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const response = await window.api.getSettings();
      set({ settings: response || {}, isLoading: false });
    } catch (error) {
      console.error('Store fetchSettings error:', error);
      set({ isLoading: false });
    }
  },
  saveSettings: async (settingsMap) => {
    set({ isLoading: true });
    try {
      const success = await window.api.saveSettings(settingsMap);
      if (success) {
        // Refetch settings to update state
        const updated = await window.api.getSettings();
        set({ settings: updated || {}, isLoading: false });
        return true;
      }
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Store saveSettings error:', error);
      set({ isLoading: false });
      return false;
    }
  },
  getSetting: (key, defaultValue = '') => {
    const state = get();
    return state.settings[key] !== undefined ? state.settings[key] : defaultValue;
  },
}));
