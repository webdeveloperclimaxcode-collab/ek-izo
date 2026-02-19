import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f5f5f5',
          'bg-tertiary': '#f0f0f0',
          text: '#171717',
          'text-secondary': '#6b7280',
          'text-tertiary': '#9ca3af',
          border: '#e5e7eb',
          'border-light': '#f3f4f6',
        },
        // Dark mode colors
        dark: {
          bg: '#000000',
          'bg-secondary': '#1a1a1a',
          'bg-tertiary': '#2d2d2d',
          text: '#ededed',
          'text-secondary': '#b0b0b0',
          'text-tertiary': '#808080',
          border: '#333333',
          'border-light': '#404040',
        },
      },
      backgroundColor: {
        'light-primary': '#ffffff',
        'light-secondary': '#f5f5f5',
        'dark-primary': '#000000',
        'dark-secondary': '#1a1a1a',
      },
      textColor: {
        'light-primary': '#171717',
        'light-secondary': '#6b7280',
        'dark-primary': '#ededed',
        'dark-secondary': '#b0b0b0',
      },
    },
  },
  plugins: [],
};

export default config;
