import { ChakraProvider } from '@chakra-ui/react';

import { I18nProvider, type LocaleCode } from 'src/shared/i18n';
import { chakraSystem } from './chakraTheme';

interface AppProviderProps {
  readonly children: React.ReactNode;
  readonly initialLocale?: LocaleCode;
}

export function AppProvider({ children, initialLocale }: AppProviderProps) {
  return (
    <ChakraProvider value={chakraSystem}>
      <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
    </ChakraProvider>
  );
}
