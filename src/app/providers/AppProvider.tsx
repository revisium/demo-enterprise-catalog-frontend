import { ChakraProvider } from '@chakra-ui/react';

import { chakraSystem } from './chakraTheme';

interface AppProviderProps {
  readonly children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}
