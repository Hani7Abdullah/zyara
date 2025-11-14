import { create } from 'zustand';

interface AppState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: localStorage.getItem('lang') === 'ar' ? 'ar' : 'en',
  setLanguage: (lang) => {
    localStorage.setItem('lang', lang);
    set({ language: lang });
  },
}));
