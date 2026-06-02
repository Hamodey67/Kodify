import { create } from 'zustand';
import { Language } from '../utils/translations';

interface LanguageState {
  language: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('language');
  if (saved === 'ar' || saved === 'en' || saved === 'ku') return saved;
  return 'ar'; // Default to Arabic for RTL-first POS requirements
};

const applyLanguageConfigs = (lang: Language) => {
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  if (lang === 'ar' || lang === 'ku') {
    html.setAttribute('dir', 'rtl');
    html.classList.remove('ltr-mode');
    html.classList.add('rtl-mode');
  } else {
    html.setAttribute('dir', 'ltr');
    html.classList.remove('rtl-mode');
    html.classList.add('ltr-mode');
  }
};

// Apply configs on load
const initialLang = getInitialLanguage();
applyLanguageConfigs(initialLang);

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLang,
  dir: (initialLang === 'ar' || initialLang === 'ku') ? 'rtl' : 'ltr',
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    applyLanguageConfigs(lang);
    set({ language: lang, dir: (lang === 'ar' || lang === 'ku') ? 'rtl' : 'ltr' });
  },
  toggleLanguage: () => {
    set((state) => {
      let nextLang: Language = 'ar';
      if (state.language === 'ar') nextLang = 'en';
      else if (state.language === 'en') nextLang = 'ku';
      else nextLang = 'ar';

      localStorage.setItem('language', nextLang);
      applyLanguageConfigs(nextLang);
      return { language: nextLang, dir: (nextLang === 'ar' || nextLang === 'ku') ? 'rtl' : 'ltr' };
    });
  },
}));
