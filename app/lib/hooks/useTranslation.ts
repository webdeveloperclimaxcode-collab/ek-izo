import { useEffect, useState } from 'react';
import { getTranslation } from '@/lib/i18n';

export function useTranslation() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    const handleLanguageChange = () => {
      const newLanguage = localStorage.getItem('language') || 'en';
      setLanguage(newLanguage);
    };

    window.addEventListener('storage', handleLanguageChange);
    return () => window.removeEventListener('storage', handleLanguageChange);
  }, []);

  const t = (key: string) => getTranslation(language, key);

  return { t, language };
}
