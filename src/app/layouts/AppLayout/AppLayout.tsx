import {
  Box,
  Button,
  Container,
  Dialog,
  Flex,
  Grid,
  HStack,
  Link as ChakraLink,
  NativeSelect,
  Portal,
  SkipNavContent,
  SkipNavLink,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useEffect, type ChangeEvent } from 'react';
import { NavLink, useLocation } from 'react-router';

import { isLocaleCode, supportedLocales, useI18n, type TranslationKey } from 'src/shared/i18n';

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const navItems = [
  { labelKey: 'nav.servers', to: '/catalog' },
  { labelKey: 'nav.pricing', to: '/pricing' },
  { labelKey: 'nav.locations', to: '/locations' },
  { labelKey: 'nav.compare', to: '/compare' },
  { labelKey: 'nav.resources', to: '/resources' },
  { labelKey: 'nav.updates', to: '/releases' },
] as const satisfies readonly { readonly labelKey: TranslationKey; readonly to: string }[];

const footerGroups = [
  {
    labelKey: 'footer.explore',
    links: [
      { labelKey: 'nav.servers', to: '/catalog' },
      { labelKey: 'nav.pricing', to: '/pricing' },
      { labelKey: 'nav.compare', to: '/compare' },
      { labelKey: 'nav.locations', to: '/locations' },
    ],
  },
  {
    labelKey: 'footer.resources',
    links: [
      { labelKey: 'footer.guides', to: '/resources' },
      { labelKey: 'footer.updates', to: '/releases' },
    ],
  },
  {
    labelKey: 'footer.workspace',
    links: [
      { labelKey: 'app.console', to: '/app' },
      { labelKey: 'footer.requestQuote', to: '/quote' },
    ],
  },
] as const satisfies readonly {
  readonly labelKey: TranslationKey;
  readonly links: readonly { readonly labelKey: TranslationKey; readonly to: string }[];
}[];

const linkFocusProps = {
  outline: 'none',
  textDecoration: 'none',
  _focus: {
    outline: 'none',
    textDecoration: 'none',
  },
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'brand.500',
    outlineOffset: '2px',
    textDecoration: 'none',
  },
} as const;

const keyboardFocusKeys = new Set([
  ' ',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Enter',
  'Tab',
]);

export function AppLayout({ children }: AppLayoutProps) {
  useFocusModality();
  useRouteScrollReset();

  const { direction, locale, setLocale, t } = useI18n();

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.currentTarget.value;

    if (isLocaleCode(nextLocale)) {
      setLocale(nextLocale);
    }
  };

  return (
    <Box bg="surface.50" dir={direction} display="flex" flexDirection="column" minH="100dvh">
      <SkipNavLink data-i18n-skip>{t('app.skipContent')}</SkipNavLink>
      <Box
        as="header"
        data-i18n-skip
        position="sticky"
        top="0"
        zIndex="5"
        borderBottomWidth="1px"
        borderColor="surface.200"
        bg="headerBg"
        backdropBlur="xl"
      >
        <Container maxW="1240px" px={{ base: '3', md: '5' }}>
          <Grid
            alignItems="center"
            columnGap={{ base: '2', lg: '4' }}
            minH={{ base: '14', md: '15' }}
            py={{ base: '2', md: '2.5' }}
            rowGap="2"
            templateAreas={{
              base: `"brand menu"`,
              md: `"brand menu"`,
              lg: `"brand nav actions"`,
            }}
            templateColumns={{
              base: 'minmax(0, 1fr) auto',
              md: 'minmax(0, 1fr) auto',
              lg: 'auto minmax(0, 1fr) auto',
            }}
          >
            <ChakraLink
              asChild
              color="ink.900"
              flexShrink="0"
              fontWeight="750"
              gridArea="brand"
              minW="0"
              _hover={{ textDecoration: 'none' }}
              {...linkFocusProps}
            >
              <NavLink data-i18n-skip style={{ textDecoration: 'none' }} to="/">
                <HStack gap="3">
                  <Flex
                    align="center"
                    justify="center"
                    w="8"
                    h="8"
                    borderRadius="control"
                    bg="logoBg"
                    color="white"
                    fontSize="xs"
                    fontWeight="800"
                  >
                    HS
                  </Flex>
                  <Box textDecoration="none">
                    <Text lineHeight="1" textDecoration="none">
                      HelioStack
                    </Text>
                    <Text color="ink.500" fontSize="xs" lineHeight="1.1" textDecoration="none">
                      Cloud servers
                    </Text>
                  </Box>
                </HStack>
              </NavLink>
            </ChakraLink>

            <Flex
              as="nav"
              aria-label="Primary navigation"
              display={{ base: 'none', lg: 'flex' }}
              gap="1"
              gridArea="nav"
              justify="center"
              minW="0"
              overflowX="auto"
              px={{ base: '0', lg: '1' }}
              py="0.5"
            >
              {navItems.map((item) => (
                <HeaderLink item={item} key={item.to} label={t(item.labelKey)} />
              ))}
            </Flex>

            <Flex
              align="center"
              display={{ base: 'none', lg: 'flex' }}
              gap="1.5"
              gridArea="actions"
              justify="flex-end"
              justifySelf={{ base: 'end', md: 'auto' }}
              minW="0"
            >
              <ChakraLink asChild flexShrink="0" {...linkFocusProps}>
                <NavLink aria-label={t('app.console')} title={t('app.console')} to="/app">
                  {({ isActive }) => (
                    <Flex
                      align="center"
                      bg={isActive ? 'brand.50' : 'white'}
                      borderColor={isActive ? 'brand.100' : 'surface.200'}
                      borderRadius="full"
                      borderWidth="1px"
                      color={isActive ? 'brand.500' : 'ink.700'}
                      h="8"
                      justify="center"
                      w="8"
                      _hover={{
                        bg: isActive ? 'brand.50' : 'surface.50',
                        borderColor: isActive ? 'activeBorder' : 'brandBorderMuted',
                        boxShadow: '0 8px 18px rgba(16, 24, 40, 0.08)',
                        transform: 'translateY(-1px)',
                      }}
                    >
                      <AvatarIcon />
                    </Flex>
                  )}
                </NavLink>
              </ChakraLink>
              <LanguageSelect handleLocaleChange={handleLocaleChange} locale={locale} t={t} />
              <ChakraLink asChild flexShrink="0" {...linkFocusProps}>
                <NavLink to="/quote">
                  {({ isActive }) => (
                    <Box
                      bg="ctaBg"
                      borderColor={isActive ? 'brand.500' : 'brand.600'}
                      borderRadius="control"
                      borderWidth="1px"
                      boxShadow="0 10px 24px rgba(21, 94, 239, 0.22)"
                      color="white"
                      fontSize="xs"
                      fontWeight="760"
                      px={{ base: '2', md: '2.5' }}
                      py="1.5"
                      whiteSpace="nowrap"
                      _hover={{
                        borderColor: 'brand.500',
                        boxShadow: '0 12px 28px rgba(21, 94, 239, 0.3)',
                        transform: 'translateY(-1px)',
                      }}
                    >
                      {t('app.getQuote')}
                    </Box>
                  )}
                </NavLink>
              </ChakraLink>
            </Flex>
            <Flex align="center" display={{ base: 'flex', lg: 'none' }} gap="1.5" gridArea="menu">
              <Box display="block">
                <LanguageSelect handleLocaleChange={handleLocaleChange} locale={locale} t={t} />
              </Box>
              <MobileNavigationDialog t={t} />
            </Flex>
          </Grid>
        </Container>
      </Box>
      <SkipNavContent />
      <Box id="app-content" display="flex" flex="1" flexDirection="column">
        {children}
      </Box>
      <Box
        as="footer"
        borderColor="surface.200"
        borderTopWidth="1px"
        bg="white"
        data-i18n-skip
        flexShrink="0"
      >
        <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '7' }}>
          <Grid
            alignItems="start"
            gap={{ base: '5', md: '6' }}
            templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) repeat(3, auto)' }}
          >
            <Stack gap="2" maxW="420px">
              <Text color="ink.900" fontWeight="760">
                HelioStack
              </Text>
              <Text color="ink.500" fontSize="sm">
                {t('footer.summary')}
              </Text>
            </Stack>
            {footerGroups.map((group) => (
              <Stack gap="2.5" key={group.labelKey} minW={{ md: '120px' }}>
                <Text color="ink.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                  {t(group.labelKey)}
                </Text>
                <Stack gap="1.5">
                  {group.links.map((link) => (
                    <FooterLink key={link.to} to={link.to}>
                      {t(link.labelKey)}
                    </FooterLink>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function useRouteScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 });
  }, [pathname]);
}

function LanguageSelect({
  handleLocaleChange,
  locale,
  t,
}: {
  readonly handleLocaleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  readonly locale: string;
  readonly t: (key: TranslationKey) => string;
}) {
  return (
    <Box
      className="group"
      flexShrink="0"
      role="group"
      transition="transform 160ms ease"
      w="62px"
      _hover={{ transform: 'translateY(-1px)' }}
    >
      <NativeSelect.Root size="sm" w="100%">
        <NativeSelect.Field
          aria-label={t('language.selectLabel')}
          bg="white"
          borderColor="surface.200"
          borderRadius="control"
          color="ink.700"
          fontSize="xs"
          fontWeight="700"
          h="8"
          minH="8"
          onChange={handleLocaleChange}
          px="2.5"
          title={t('language.selectTitle')}
          value={locale}
          _groupHover={{
            bg: 'surface.50',
            borderColor: 'brandBorderMuted',
            boxShadow: '0 8px 18px rgba(16, 24, 40, 0.08)',
          }}
        >
          {supportedLocales.map((supportedLocale) => (
            <option key={supportedLocale.code} value={supportedLocale.code}>
              {supportedLocale.code.toUpperCase()}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
}

function AvatarIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.10758 16.1759C5.06665 16.5881 5.36762 16.9554 5.77981 16.9963C6.19199 17.0373 6.55931 16.7363 6.60024 16.3241L5.85391 16.25L5.10758 16.1759ZM13.3998 16.3241C13.4407 16.7363 13.808 17.0373 14.2202 16.9963C14.6324 16.9554 14.9333 16.5881 14.8924 16.1759L14.1461 16.25L13.3998 16.3241ZM17.5 10H16.75C16.75 13.7279 13.7279 16.75 10 16.75V17.5V18.25C14.5563 18.25 18.25 14.5563 18.25 10H17.5ZM10 17.5V16.75C6.27208 16.75 3.25 13.7279 3.25 10H2.5H1.75C1.75 14.5563 5.44365 18.25 10 18.25V17.5ZM2.5 10H3.25C3.25 6.27208 6.27208 3.25 10 3.25V2.5V1.75C5.44365 1.75 1.75 5.44365 1.75 10H2.5ZM10 2.5V3.25C13.7279 3.25 16.75 6.27208 16.75 10H17.5H18.25C18.25 5.44365 14.5563 1.75 10 1.75V2.5ZM11.6667 8.33333H10.9167C10.9167 8.83959 10.5063 9.25 10 9.25V10V10.75C11.3347 10.75 12.4167 9.66802 12.4167 8.33333H11.6667ZM10 10V9.25C9.49374 9.25 9.08333 8.83959 9.08333 8.33333H8.33333H7.58333C7.58333 9.66802 8.66531 10.75 10 10.75V10ZM8.33333 8.33333H9.08333C9.08333 7.82707 9.49374 7.41667 10 7.41667V6.66667V5.91667C8.66531 5.91667 7.58333 6.99865 7.58333 8.33333H8.33333ZM10 6.66667V7.41667C10.5063 7.41667 10.9167 7.82707 10.9167 8.33333H11.6667H12.4167C12.4167 6.99865 11.3347 5.91667 10 5.91667V6.66667ZM5.85391 16.25L6.60024 16.3241C6.77158 14.5983 8.22879 13.25 10 13.25V12.5V11.75C7.45009 11.75 5.35434 13.6905 5.10758 16.1759L5.85391 16.25ZM10 12.5V13.25C11.7712 13.25 13.2284 14.5983 13.3998 16.3241L14.1461 16.25L14.8924 16.1759C14.6457 13.6905 12.5499 11.75 10 11.75V12.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MobileNavigationDialog({ t }: { readonly t: (key: TranslationKey) => string }) {
  return (
    <Dialog.Root placement="center" size="full">
      <Dialog.Trigger asChild>
        <Button
          aria-label={t('nav.menu.open')}
          borderColor="surface.200"
          borderRadius="control"
          borderWidth="1px"
          display={{ base: 'inline-flex', lg: 'none' }}
          flexShrink="0"
          h="8"
          minW="8"
          p="0"
          variant="ghost"
          _hover={{
            bg: 'surface.50',
            borderColor: 'brandBorderMuted',
            boxShadow: '0 8px 18px rgba(16, 24, 40, 0.08)',
            transform: 'translateY(-1px)',
          }}
        >
          <Stack aria-hidden="true" gap="1" w="3.5">
            <Box bg="ink.700" h="1.5px" borderRadius="full" />
            <Box bg="ink.700" h="1.5px" borderRadius="full" />
            <Box bg="ink.700" h="1.5px" borderRadius="full" />
          </Stack>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop bg="rgba(15, 23, 42, 0.34)" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="pagePremiumBg"
            borderRadius="0"
            boxShadow="none"
            h="100dvh"
            maxH="100dvh"
            maxW="100dvw"
            overflowY="auto"
            p="0"
            w="100dvw"
          >
            <Dialog.Header
              alignItems="center"
              borderBottomColor="surface.200"
              borderBottomWidth="1px"
              display="flex"
              justifyContent="space-between"
              px="4"
              py="3"
            >
              <Dialog.Title color="ink.900" data-i18n-skip>
                <HStack gap="3">
                  <Flex
                    align="center"
                    justify="center"
                    w="8"
                    h="8"
                    borderRadius="control"
                    bg="logoBg"
                    color="white"
                    fontSize="xs"
                    fontWeight="800"
                  >
                    HS
                  </Flex>
                  <Box>
                    <Text fontWeight="760" lineHeight="1">
                      HelioStack
                    </Text>
                    <Text color="ink.500" fontSize="xs" lineHeight="1.1">
                      Cloud servers
                    </Text>
                  </Box>
                </HStack>
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <Button
                  aria-label={t('nav.menu.close')}
                  borderColor="surface.200"
                  borderRadius="control"
                  borderWidth="1px"
                  h="8"
                  minW="8"
                  p="0"
                  variant="ghost"
                >
                  <Text aria-hidden="true" fontSize="xl" lineHeight="1">
                    ×
                  </Text>
                </Button>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body px="4" py="5">
              <Stack gap="5">
                <Stack gap="2">
                  <MobileMenuLink label={t('app.console')} to="/app" />
                  <MobileMenuLink label={t('app.getQuote')} tone="primary" to="/quote" />
                </Stack>
                <Stack as="nav" aria-label="Primary navigation" gap="2">
                  {navItems.map((item) => (
                    <MobileNavLink item={item} key={item.to} label={t(item.labelKey)} />
                  ))}
                </Stack>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

function MobileMenuLink({
  label,
  to,
  tone = 'plain',
}: {
  readonly label: string;
  readonly to: string;
  readonly tone?: 'plain' | 'primary';
}) {
  const isPrimary = tone === 'primary';

  return (
    <Dialog.ActionTrigger asChild>
      <ChakraLink asChild {...linkFocusProps}>
        <NavLink to={to}>
          {({ isActive }) => {
            const styles = getMobileMenuLinkStyles({ isActive, isPrimary });

            return (
              <Box
                bg={styles.bg}
                borderColor={styles.borderColor}
                borderRadius="8px"
                borderWidth="1px"
                color={styles.color}
                fontSize="lg"
                fontWeight="760"
                px="4"
                py="4"
                w="100%"
                _hover={{
                  bg: styles.hoverBg,
                  borderColor: styles.hoverBorderColor,
                }}
              >
                {label}
              </Box>
            );
          }}
        </NavLink>
      </ChakraLink>
    </Dialog.ActionTrigger>
  );
}

function getMobileMenuLinkStyles({
  isActive,
  isPrimary,
}: {
  readonly isActive: boolean;
  readonly isPrimary: boolean;
}) {
  if (isPrimary) {
    return {
      bg: 'ctaBg',
      borderColor: 'brand.600',
      color: 'white',
      hoverBg: 'ctaBg',
      hoverBorderColor: 'brand.500',
    };
  }

  if (isActive) {
    return {
      bg: 'brand.50',
      borderColor: 'activeBorder',
      color: 'brand.500',
      hoverBg: 'brand.50',
      hoverBorderColor: 'activeBorder',
    };
  }

  return {
    bg: 'white',
    borderColor: 'surface.200',
    color: 'ink.900',
    hoverBg: 'surface.50',
    hoverBorderColor: 'brandBorderMuted',
  };
}

function MobileNavLink({
  item,
  label,
}: {
  readonly item: (typeof navItems)[number];
  readonly label: string;
}) {
  return (
    <Dialog.ActionTrigger asChild>
      <ChakraLink asChild {...linkFocusProps}>
        <NavLink to={item.to}>
          {({ isActive }) => (
            <Box
              bg={isActive ? 'brand.50' : 'white'}
              borderColor={isActive ? 'activeBorder' : 'surface.200'}
              borderRadius="8px"
              borderWidth="1px"
              color={isActive ? 'brand.500' : 'ink.900'}
              fontSize="lg"
              fontWeight="760"
              px="4"
              py="4"
              w="100%"
              _hover={{
                bg: isActive ? 'brand.50' : 'surface.50',
                borderColor: isActive ? 'activeBorder' : 'brandBorderMuted',
              }}
            >
              {label}
            </Box>
          )}
        </NavLink>
      </ChakraLink>
    </Dialog.ActionTrigger>
  );
}

function useFocusModality() {
  useEffect(() => {
    const root = document.documentElement;
    const setPointerModality = () => {
      root.dataset.focusModality = 'pointer';
    };
    const setKeyboardModality = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (keyboardFocusKeys.has(event.key)) {
        root.dataset.focusModality = 'keyboard';
      }
    };
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setPointerModality();
      }
    };

    setPointerModality();
    globalThis.addEventListener('keydown', setKeyboardModality, true);
    globalThis.addEventListener('pageshow', setPointerModality);
    globalThis.addEventListener('pointerdown', setPointerModality, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      globalThis.removeEventListener('keydown', setKeyboardModality, true);
      globalThis.removeEventListener('pageshow', setPointerModality);
      globalThis.removeEventListener('pointerdown', setPointerModality, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

function HeaderLink({
  item,
  label,
}: {
  readonly item: (typeof navItems)[number];
  readonly label: string;
}) {
  return (
    <ChakraLink asChild {...linkFocusProps}>
      <NavLink to={item.to}>
        {({ isActive }) => (
          <Box
            bg={isActive ? 'brand.50' : 'white'}
            borderColor={isActive ? 'brand.100' : 'surface.200'}
            borderRadius="control"
            borderWidth="1px"
            color={isActive ? 'brand.500' : 'ink.700'}
            flex="1"
            fontSize="xs"
            fontWeight="700"
            px={{ base: '2', md: '2.5' }}
            py="1.5"
            whiteSpace="nowrap"
            _hover={{
              bg: isActive ? 'brand.50' : 'surface.50',
              borderColor: isActive ? 'activeBorder' : 'brandBorderMuted',
              boxShadow: '0 8px 18px rgba(16, 24, 40, 0.08)',
              transform: 'translateY(-1px)',
            }}
          >
            {label}
          </Box>
        )}
      </NavLink>
    </ChakraLink>
  );
}

function FooterLink({ children, to }: { readonly children: React.ReactNode; readonly to: string }) {
  return (
    <ChakraLink
      asChild
      color="ink.700"
      fontSize="sm"
      fontWeight="650"
      _hover={{ color: 'brand.500' }}
      {...linkFocusProps}
    >
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
}
