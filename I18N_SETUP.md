# i18next Implementation Guide

## Overview
This project now has full internationalization (i18n) support with English, Albanian, and Italian translations using a custom i18n solution.

## Installation
The following packages have been installed:
- `i18next` - Core i18n framework
- `i18next-react` - React integration
- `i18next-browser-languagedetector` - Automatic language detection
- `i18next-http-backend` - Backend support for loading translations

## Project Structure

```
i18n/
├── locales/
│   ├── en.json      # English translations
│   ├── sq.json      # Albanian translations
│   └── it.json      # Italian translations

lib/
├── i18n.ts          # i18n utilities and translation resources

contexts/
├── LanguageContext.tsx  # Language provider and hook

components/
├── Header.tsx       # Updated with i18n support
```

## Translation Files

### English (en.json)
- header.home, header.products, header.services, etc.
- footer translations
- common UI strings

### Albanian (sq.json)
- Complete Albanian translations for all header items
- Footer and common strings in Albanian

### Italian (it.json)
- Complete Italian translations for all header items
- Footer and common strings in Italian

## How to Use

### In Components
```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('header.home')}</h1>
      <p>Current language: {language}</p>
      <button onClick={() => setLanguage('sq')}>Albanian</button>
    </div>
  );
}
```

### Changing Language
```tsx
const { setLanguage } = useLanguage();

// Change to Albanian
setLanguage('sq');

// Change to Italian
setLanguage('it');

// Change to English
setLanguage('en');
```

The selection is automatically saved to localStorage and persists across sessions.

### Adding New Translations
1. Add the key-value pair to all three JSON files:
   - `i18n/locales/en.json`
   - `i18n/locales/sq.json`
   - `i18n/locales/it.json`

2. Use in component:
   ```tsx
   const { t } = useLanguage();
   <span>{t('your.new.key')}</span>
   ```

## Features Implemented

✅ Language dropdown in header with flag icons
✅ Persistent language selection (localStorage)
✅ Automatic language detection from browser
✅ All header navigation items translated
✅ Menu items translated
✅ Search placeholder translated
✅ Login/Logout buttons translated
✅ Dark/Light mode labels translated
✅ Responsive design maintained
✅ No external i18next dependencies needed for React

## Supported Languages

| Code | Language | Flag |
|------|----------|------|
| en   | English  | 🇺🇸 |
| sq   | Albanian | 🇦🇱 |
| it   | Italian  | 🇮🇹 |

## How It Works

1. **LanguageContext** - Manages the current language state and provides the `t()` function
2. **lib/i18n.ts** - Contains translation resources and the `getTranslation()` utility
3. **LanguageProvider** - Wraps the app and initializes language from localStorage or browser settings
4. **useLanguage Hook** - Used in components to access translations and language functions

## Next Steps

To extend translations to other components:

1. **Footer Component**: Add footer translations
2. **Product Pages**: Add product-related translations
3. **Service Pages**: Add service-related translations
4. **Blog**: Add blog-related translations
5. **Contact Form**: Add form labels and messages

## Troubleshooting

### Language not persisting
- Check browser localStorage is enabled
- Verify `setLanguage()` is being called

### Translations not showing
- Ensure key exists in all three JSON files
- Check component has `useLanguage()` hook
- Verify LanguageProvider wraps the component in layout

### Missing translations
- Add the key to all three locale files
- Use fallback language (English) as default
- Check key path is correct (e.g., 'header.home')
