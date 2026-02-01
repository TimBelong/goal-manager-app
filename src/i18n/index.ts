import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ru from './locales/ru';
import en from './locales/en';
import es from './locales/es';
import zh from './locales/zh';
import ar from './locales/ar';

export const LANGUAGE_KEY = 'app_language';
export const DEFAULT_LANGUAGE = 'ru';
export const SUPPORTED_LANGUAGES = ['ru', 'en', 'es', 'zh', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const languageNames: Record<SupportedLanguage, string> = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  zh: '中文',
  ar: 'العربية',
};

export const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  const language =
    savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)
      ? savedLanguage
      : DEFAULT_LANGUAGE;

  await i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      es: { translation: es },
      zh: { translation: zh },
      ar: { translation: ar },
    },
    lng: language,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
};

export default i18n;
