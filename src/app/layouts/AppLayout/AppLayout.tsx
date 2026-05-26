import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
  Link as ChakraLink,
  NativeSelect,
  SkipNavContent,
  SkipNavLink,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import { NavLink } from 'react-router';

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

export function AppLayout({ children }: AppLayoutProps) {
  const { direction, locale, setLocale, t } = useI18n();

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.currentTarget.value;

    if (isLocaleCode(nextLocale)) {
      setLocale(nextLocale);
    }
  };

  return (
    <Box bg="surface.50" dir={direction} minH="100dvh">
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
            templateColumns={{
              base: 'minmax(0, 1fr) auto',
              lg: 'auto minmax(0, 1fr) auto',
            }}
          >
            <ChakraLink
              asChild
              color="ink.900"
              flexShrink="0"
              fontWeight="750"
              textDecoration="none"
              _focus={{ textDecoration: 'none' }}
              _focusVisible={{ textDecoration: 'none' }}
              _hover={{ textDecoration: 'none' }}
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
              gap="1"
              gridColumn={{ base: '1 / -1', lg: 'auto' }}
              minW="0"
              overflowX="auto"
              px={{ base: '0', lg: '1' }}
              py="0.5"
            >
              {navItems.map((item) => (
                <HeaderLink item={item} key={item.to} label={t(item.labelKey)} />
              ))}
            </Flex>

            <Flex align="center" gap="1.5" justify="flex-end" minW="0">
              <ChakraLink asChild flexShrink="0">
                <NavLink to="/app">
                  {({ isActive }) => (
                    <Box
                      bg={isActive ? 'brand.50' : 'white'}
                      borderColor={isActive ? 'brand.100' : 'surface.200'}
                      borderRadius="control"
                      borderWidth="1px"
                      color={isActive ? 'brand.500' : 'ink.700'}
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
                      {t('app.console')}
                    </Box>
                  )}
                </NavLink>
              </ChakraLink>
              <ChakraLink asChild flexShrink="0">
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
              <Box
                className="group"
                flexShrink="0"
                role="group"
                transition="transform 160ms ease"
                w={{ base: '96px', sm: '112px' }}
                _hover={{ transform: 'translateY(-1px)' }}
              >
                <NativeSelect.Root size="sm" w="100%">
                  <NativeSelect.Field
                    aria-label={t('language.selectLabel')}
                    bg="white"
                    borderColor="surface.200"
                    borderRadius="control"
                    color="ink.700"
                    h="8"
                    minH="8"
                    onChange={handleLocaleChange}
                    px="2"
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
                        {supportedLocale.nativeLabel}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Flex>
          </Grid>
        </Container>
      </Box>
      <SkipNavContent />
      <Box id="app-content">{children}</Box>
      <Box as="footer" borderColor="surface.200" borderTopWidth="1px" bg="white" data-i18n-skip>
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

function HeaderLink({
  item,
  label,
}: {
  readonly item: (typeof navItems)[number];
  readonly label: string;
}) {
  return (
    <ChakraLink asChild>
      <NavLink to={item.to}>
        {({ isActive }) => (
          <Box
            bg={isActive ? 'brand.50' : 'white'}
            borderColor={isActive ? 'brand.100' : 'surface.200'}
            borderRadius="control"
            borderWidth="1px"
            color={isActive ? 'brand.500' : 'ink.700'}
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
    >
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
}
