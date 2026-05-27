import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#181d26',
        body: '#374151',
        muted: '#6b7280',
        hairline: '#e5e7eb',
        'border-strong': '#9ca3af',
        canvas: '#ffffff',
        'surface-soft': '#f9fafb',
        'surface-strong': '#e5e7eb',
        'surface-dark': '#181d26',
        'signature-sky': '#1e3a5f',
        'signature-terrain': '#14532d',
        'signature-sand': '#f5e9d4',
        'signature-sunrise': '#7c2d12',
        link: '#2563eb',
        'link-active': '#1e40af',
        transport: {
          plane: '#2563eb',
          train: '#16a34a',
          car: '#d97706',
          bus: '#dc2626',
          ship: '#0891b2',
          walk: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xs: '2px',
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        section: '80px',
      },
    },
  },
  plugins: [],
};

export default config;
