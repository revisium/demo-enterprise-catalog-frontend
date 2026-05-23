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
    semanticTokens: {
      colors: {
        appFrameBg: {
          value:
            'linear-gradient(90deg, color-mix(in srgb, {colors.brand.500} 8%, transparent), transparent 34%), linear-gradient(180deg, white 0, {colors.surface.50} 390px, {colors.surface.100} 100%)',
        },
        headerBg: {
          value: 'color-mix(in srgb, white 90%, transparent)',
        },
        panelDarkBg: {
          value:
            'linear-gradient(145deg, color-mix(in srgb, {colors.surface.900} 96%, transparent), color-mix(in srgb, {colors.brand.500} 90%, transparent)), {colors.surface.900}',
        },
        brandBorderMuted: {
          value: 'color-mix(in srgb, {colors.brand.500} 18%, transparent)',
        },
        brandBorderActive: {
          value: 'color-mix(in srgb, {colors.brand.500} 45%, transparent)',
        },
        navIdleBg: {
          value: 'color-mix(in srgb, white 68%, transparent)',
        },
        gatewayVisualBg: {
          value:
            'linear-gradient(135deg, color-mix(in srgb, {colors.brand.500} 92%, transparent), color-mix(in srgb, #364858 82%, transparent)), repeating-linear-gradient(90deg, transparent 0 30px, color-mix(in srgb, white 18%, transparent) 30px 32px)',
        },
        sensorVisualBg: {
          value:
            'radial-gradient(circle at 32% 35%, color-mix(in srgb, white 28%, transparent) 0% 18%, transparent 35%), linear-gradient(135deg, color-mix(in srgb, #526348 90%, transparent), color-mix(in srgb, #2d4f5f 80%, transparent))',
        },
        cloudVisualBg: {
          value:
            'linear-gradient(135deg, color-mix(in srgb, #2d4f5f 90%, transparent), color-mix(in srgb, #604f82 78%, transparent)), repeating-linear-gradient(0deg, transparent 0 20px, color-mix(in srgb, white 16%, transparent) 20px 21px)',
        },
      },
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, config);
