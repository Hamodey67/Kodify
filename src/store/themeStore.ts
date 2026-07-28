import { create } from 'zustand';

export type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getInitialTheme = (): Theme => 'light';

const applyTheme = (_theme: Theme) => {
  const html = document.documentElement;
  html.classList.add('light');
  html.classList.remove('dark');
};

applyTheme(getInitialTheme());

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme: 'light' });
  },
  toggleTheme: () => {
    applyTheme('light');
    set({ theme: 'light' });
  },
}));
