import { useEffect, useState } from 'react';
import { getTranslation } from '@/lib/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    const handleStorageChange = () => {
      const newLanguage = localStorage.getItem('language') || 'en';
      setLanguage(newLanguage);
    };

    const handleLanguageEvent = (event: Event) => {
      const newLanguage = (event as CustomEvent).detail;
      if (newLanguage) setLanguage(newLanguage);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('languageChange', handleLanguageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChange', handleLanguageEvent);
    };
  }, []);

  const t = (key: string) => getTranslation(language, key);

  return { t, language };
}
