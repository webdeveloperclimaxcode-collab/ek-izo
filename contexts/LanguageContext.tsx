'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTranslation, supportedLanguages, defaultLanguage } from '@/lib/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.split('-')[0];
    
    let languageToUse = defaultLanguage;
    
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      languageToUse = savedLanguage;
    } else if (supportedLanguages.includes(browserLanguage)) {
      languageToUse = browserLanguage;
    }
    
    setLanguageState(languageToUse);
    setIsInitialized(true);
  }, []);

  // Listen for custom language change events and storage changes
  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newLanguage = customEvent.detail;
      if (newLanguage && supportedLanguages.includes(newLanguage)) {
        setLanguageState(newLanguage);
      }
    };

    const handleStorageChange = () => {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    }
  };

  const t = (key: string) => getTranslation(language, key);

  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  // Return a default context if not within provider
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}
