export type LocaleCode = 'ar' | 'en' | 'es' | 'fr' | 'ru' | 'zh';

export interface SupportedLocale {
  readonly code: LocaleCode;
  readonly direction: 'ltr' | 'rtl';
  readonly englishName: string;
  readonly nativeLabel: string;
}

export const defaultLocale: LocaleCode = 'en';

export const supportedLocales: readonly SupportedLocale[] = [
  { code: 'en', direction: 'ltr', englishName: 'English', nativeLabel: 'English' },
  { code: 'ar', direction: 'rtl', englishName: 'Arabic', nativeLabel: 'العربية' },
  { code: 'zh', direction: 'ltr', englishName: 'Chinese', nativeLabel: '中文' },
  { code: 'fr', direction: 'ltr', englishName: 'French', nativeLabel: 'Français' },
  { code: 'ru', direction: 'ltr', englishName: 'Russian', nativeLabel: 'Русский' },
  { code: 'es', direction: 'ltr', englishName: 'Spanish', nativeLabel: 'Español' },
];

export function isLocaleCode(value: string): value is LocaleCode {
  return supportedLocales.some((locale) => locale.code === value);
}

export function getSupportedLocale(code: LocaleCode): SupportedLocale {
  const locale = supportedLocales.find((supportedLocale) => supportedLocale.code === code);

  return locale ?? supportedLocales.find((supportedLocale) => supportedLocale.code === defaultLocale)!;
}
