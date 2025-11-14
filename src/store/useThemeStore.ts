import { create } from 'zustand';

interface ThemeState {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  toggleTheme: () => {
    const newMode = get().mode === 'light' ? 'dark' : 'light';
    set({ mode: newMode });
  },
}));
