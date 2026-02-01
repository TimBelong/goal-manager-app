import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import {
  LANGUAGE_KEY,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || DEFAULT_LANGUAGE
  );

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (
          savedLanguage &&
          SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)
        ) {
          setLanguage(savedLanguage as SupportedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = useCallback(async (lang: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(lang);
      setLanguage(lang);
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, []);

  const value = useMemo(
    () => ({ language, changeLanguage }),
    [language, changeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
