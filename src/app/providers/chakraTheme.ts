import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    'html, body': {
      margin: 0,
      minHeight: '100%',
      color: 'ink.900',
      bg: 'surface.50',
      fontFamily: 'body',
    },
    '*': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e7efe9' },
          100: { value: '#d5e5dc' },
          500: { value: '#1f5f55' },
          600: { value: '#1a5149' },
          700: { value: '#173631' },
          900: { value: '#102421' },
        },
        ink: {
          500: { value: '#53645f' },
          700: { value: '#344642' },
          900: { value: '#14201d' },
        },
        surface: {
          50: { value: '#f5f7f4' },
          100: { value: '#eef2ec' },
          200: { value: '#e7efe9' },
          900: { value: '#14201d' },
        },
      },
      fonts: {
        body: {
          value:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        heading: {
          value:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      },
      radii: {
        panel: { value: '0.5rem' },
        control: { value: '0.45rem' },
      },
      shadows: {
        panel: { value: '0 18px 50px rgba(33, 47, 43, 0.08)' },
      },
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, config);
