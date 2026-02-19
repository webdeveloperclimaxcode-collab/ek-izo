import enTranslations from '@/i18n/locales/en.json';
import sqTranslations from '@/i18n/locales/sq.json';
import itTranslations from '@/i18n/locales/it.json';

export const resources = {
  en: { translation: enTranslations },
  sq: { translation: sqTranslations },
  it: { translation: itTranslations },
};

export const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'sq', 'it'];

export function getTranslation(language: string, key: string): string {
  const lang = (resources as any)[language] || (resources as any)[defaultLanguage];
  const keys = key.split('.');
  let value: any = lang.translation;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}
