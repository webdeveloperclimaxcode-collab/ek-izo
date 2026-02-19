# Complete Website Translation Guide

## Overview
The website now has comprehensive i18n support with English, Albanian, and Italian translations. This guide explains how to translate all remaining components.

## Completed Components ✅

The following components have been fully translated:
- **Header** - Navigation, language selector, menu
- **CostOfServices** - Heading, description, button
- **AboutUs** - Heading, description, features (3 items)
- **FeaturedProducts** - Heading, 5 products with names and descriptions
- **WhyChoose** - Heading, description, 5 statistics

## Translation Files Location

All translations are stored in JSON files:
```
i18n/locales/
├── en.json  (English)
├── sq.json  (Albanian)
└── it.json  (Italian)
```

## How to Translate Remaining Components

### 1. OurServices Component
**File**: `components/OurServices.tsx`

Add to translation files:
```json
"ourServices": {
  "heading": "OUR SERVICES",
  "description": "With over 15 years experience...",
  "viewAll": "VIEW ALL SERVICES"
}
```

Update component:
```tsx
import { useTranslation } from "@/app/lib/hooks/useTranslation";

export default function OurServices() {
  const { t } = useTranslation();
  
  return (
    <h2>{t("ourServices.heading")}</h2>
    <p>{t("ourServices.description")}</p>
    <button>{t("ourServices.viewAll")}</button>
  );
}
```

### 2. OurProducts Component
**File**: `components/OurProducts.tsx`

Add to translation files:
```json
"ourProducts": {
  "heading": "OUR PRODUCT LINES",
  "viewAll": "VIEW ALL PRODUCTS",
  "contactForPricing": "Please contact us for pricing on this product"
}
```

### 3. OurProjects Component
**File**: `components/OurProjects.tsx`

Add to translation files:
```json
"ourProjects": {
  "heading": "OUR PROJECTS",
  "description": "Just give us a call...",
  "viewAll": "VIEW ALL PROJECTS",
  "prevProject": "Previous project",
  "nextProject": "Next project"
}
```

### 4. VideoTutorial Component
**File**: `components/VideoTutorial.tsx`

Add to translation files:
```json
"videoTutorial": {
  "heading": "VIDEO TUTORIAL",
  "viewAll": "VIEW ALL VIDEO TUTORIAL",
  "prevVideo": "Previous video",
  "nextVideo": "Next video"
}
```

### 5. NewsBlogs Component
**File**: `components/NewsBlogs.tsx`

Add to translation files:
```json
"newsBlogs": {
  "heading": "NEWS BLOGS",
  "viewAll": "VIEW ALL BLOGS",
  "prevBlog": "Previous blog",
  "nextBlog": "Next blog"
}
```

### 6. WeWorkWith Component
**File**: `components/WeWorkWith.tsx`

Add to translation files:
```json
"weWorkWith": {
  "heading": "WE WORK WITH"
}
```

### 7. Footer Component
**File**: `components/Footer.tsx`

Add to translation files:
```json
"footer": {
  "contactBanner": {
    "heading": "CONTACT US",
    "subheading": "Learn More About Working With IZOGRUP",
    "button": "CONTACT US"
  },
  "followUs": "Follow Us",
  "downloadApp": "Download Our App",
  "contactInfo": "Contact Us",
  "account": "Account",
  "loginRegister": "Login Register",
  "loggedInAs": "Logged in as",
  "logout": "Logout",
  "products": "PRODUCTS",
  "sustainability": "SUSTAINABILITY",
  "toolsDownloads": "TOOLS & DOWNLOADS",
  "technicalService": "TECHNICAL SERVICE",
  "projects": "PROJECTS",
  "aboutUs": "ABOUT US",
  "news": "NEWS",
  "productLines": "PRODUCT LINES",
  "scrollToTop": "Scroll to top",
  "copyright": "© Copyright 2025 Izogrup SH.P.K ALL RIGHTS RESERVED"
}
```

## Using the Translation Hook

All components should use the `useTranslation` hook:

```tsx
import { useTranslation } from "@/app/lib/hooks/useTranslation";

export default function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t("section.heading")}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

## Translation Key Naming Convention

Follow this pattern for consistency:
```
section.subsection.key
```

Examples:
- `header.home` - Header home link
- `ourServices.heading` - OurServices section heading
- `aboutUs.features.constructionManagement.title` - Feature title
- `footer.copyright` - Footer copyright text

## Dynamic Content Translation

For content from the database (services, products, projects, blogs), you need to:

1. **Add translation fields to database schema**
   - Add `title_en`, `title_sq`, `title_it` fields
   - Add `description_en`, `description_sq`, `description_it` fields

2. **Update API endpoints** to return translated content based on language parameter

3. **Update components** to use the translated data from API

Example:
```tsx
const [language, setLanguage] = useState('en');

useEffect(() => {
  fetchServices(language); // Pass language to API
}, [language]);
```

## Testing Translations

1. Open the website
2. Click the language dropdown in the header
3. Select Albanian (sq) or Italian (it)
4. Verify all text updates correctly
5. Refresh the page - language should persist

## Adding New Translations

When adding new content:

1. Add the key to all three JSON files (en.json, sq.json, it.json)
2. Use the `t()` function in components
3. Test in all three languages

## Current Translation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Header | ✅ Complete | All navigation and menu items |
| CostOfServices | ✅ Complete | Heading, description, button |
| AboutUs | ✅ Complete | Heading, description, 3 features |
| FeaturedProducts | ✅ Complete | Heading, 5 products |
| WhyChoose | ✅ Complete | Heading, description, 5 stats |
| OurServices | ⏳ Pending | Need to update component |
| OurProducts | ⏳ Pending | Need to update component |
| OurProjects | ⏳ Pending | Need to update component |
| VideoTutorial | ⏳ Pending | Need to update component |
| NewsBlogs | ⏳ Pending | Need to update component |
| WeWorkWith | ⏳ Pending | Need to update component |
| Footer | ⏳ Pending | Need to update component |

## Translation Files Already Updated

✅ `i18n/locales/en.json` - Complete with all sections
✅ `i18n/locales/sq.json` - Complete with Albanian translations
✅ `i18n/locales/it.json` - Complete with Italian translations

All translation keys are already in place. Components just need to be updated to use them.
