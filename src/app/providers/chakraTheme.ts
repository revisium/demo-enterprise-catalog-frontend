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
    'html:not([data-focus-modality="keyboard"]) :is(a, button, input, select, textarea, [tabindex]):focus-visible': {
      outline: 'none !important',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#eef6ff' },
          100: { value: '#d9ecff' },
          500: { value: '#0b5bd3' },
          600: { value: '#155eef' },
          700: { value: '#1849a9' },
          900: { value: '#101828' },
        },
        accent: {
          50: { value: '#fff7ed' },
          100: { value: '#ffedd5' },
          400: { value: '#f59e0b' },
          500: { value: '#d97706' },
          700: { value: '#9a3412' },
        },
        ink: {
          500: { value: '#667085' },
          600: { value: '#5b6678' },
          700: { value: '#475467' },
          900: { value: '#101828' },
        },
        surface: {
          50: { value: '#f5f7fb' },
          100: { value: '#eef3f8' },
          200: { value: '#e1e8f0' },
          900: { value: '#101828' },
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
        panel: { value: '0 18px 50px rgba(16, 24, 40, 0.08)' },
      },
    },
    semanticTokens: {
      colors: {
        appFrameBg: {
          value:
            'linear-gradient(90deg, color-mix(in srgb, {colors.brand.500} 8%, transparent), transparent 34%), linear-gradient(180deg, white 0, {colors.surface.50} 390px, {colors.surface.100} 100%)',
        },
        headerBg: {
          value: 'color-mix(in srgb, white 96%, transparent)',
        },
        pagePremiumBg: {
          value:
            'linear-gradient(135deg, #eff1f5 0%, #eff1f5 42%, #d9b77c 68%, {colors.brand.600} 100%)',
        },
        panelGlassBg: {
          value: 'color-mix(in srgb, white 88%, transparent)',
        },
        panelSubtleBg: {
          value: '#f8fafc',
        },
        recommendationBg: {
          value: 'linear-gradient(135deg, white 0%, #f7fbff 58%, #eaf6ff 100%)',
        },
        panelDarkBg: {
          value:
            'linear-gradient(145deg, color-mix(in srgb, {colors.surface.900} 96%, transparent), color-mix(in srgb, {colors.brand.500} 90%, transparent)), {colors.surface.900}',
        },
        logoBg: {
          value: 'linear-gradient(135deg, {colors.brand.600} 0%, #48d6c7 100%)',
        },
        ctaBg: {
          value: 'linear-gradient(135deg, {colors.surface.900} 0%, {colors.brand.600} 100%)',
        },
        reserveButtonBg: {
          value: 'linear-gradient(135deg, white 0%, #c7f9ef 100%)',
        },
        brandBorderMuted: {
          value: 'color-mix(in srgb, {colors.brand.500} 18%, transparent)',
        },
        brandBorderActive: {
          value: 'color-mix(in srgb, {colors.brand.500} 45%, transparent)',
        },
        panelBorderStrong: {
          value: '#d9e7f5',
        },
        activeBorder: {
          value: '#8dc2ff',
        },
        successBg: {
          value: '#ecfdf3',
        },
        successBorder: {
          value: '#7bdcb5',
        },
        successText: {
          value: '#087443',
        },
        amberBg: {
          value: '#fff7e6',
        },
        amberText: {
          value: '#915930',
        },
        darkPanelMutedText: {
          value: '#a9b8cf',
        },
        darkPanelText: {
          value: '#c9d3e2',
        },
        darkPanelBorder: {
          value: '#344054',
        },
        darkBadgeBg: {
          value: 'color-mix(in srgb, white 10%, transparent)',
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
