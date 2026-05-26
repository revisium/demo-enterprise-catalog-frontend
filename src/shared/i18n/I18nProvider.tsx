import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  defaultLocale,
  getSupportedLocale,
  isLocaleCode,
  type LocaleCode,
} from './languages';
import { translate, type TranslationKey } from './messages';
import { startVisualTranslator } from './visualTranslator';

interface I18nContextValue {
  readonly direction: 'ltr' | 'rtl';
  readonly locale: LocaleCode;
  readonly setLocale: (locale: LocaleCode) => void;
  readonly t: (key: TranslationKey) => string;
}

interface I18nProviderProps {
  readonly children: ReactNode;
  readonly initialLocale?: LocaleCode;
}

const localeStorageKey = 'heliostack.locale';
const localeCookieKey = 'heliostack_locale';
const I18nContext = createContext<I18nContextValue | null>(null);
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function I18nProvider({ children, initialLocale = defaultLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => getInitialLocale(initialLocale));
  const translatorCleanupRef = useRef<(() => void) | null>(null);
  const direction = getSupportedLocale(locale).direction;

  useIsomorphicLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  useIsomorphicLayoutEffect(() => {
    translatorCleanupRef.current = startVisualTranslator(locale);

    return () => {
      translatorCleanupRef.current?.();
      translatorCleanupRef.current = null;
    };
  }, [locale]);

  const setLocale = useCallback((nextLocale: LocaleCode) => {
    translatorCleanupRef.current?.();
    translatorCleanupRef.current = null;
    setLocaleState(nextLocale);
    window.localStorage.setItem(localeStorageKey, nextLocale);
    document.cookie = `${localeCookieKey}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  const value = useMemo(
    () => ({
      direction,
      locale,
      setLocale,
      t,
    }),
    [direction, locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function getInitialLocale(initialLocale: LocaleCode) {
  if (typeof window === 'undefined') {
    return initialLocale;
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);

  return storedLocale && isLocaleCode(storedLocale) ? storedLocale : initialLocale;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider');
  }

  return context;
}
