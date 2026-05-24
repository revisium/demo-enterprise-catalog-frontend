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
import { NavLink } from 'react-router';

import { defaultLocale, supportedLocales } from 'src/shared/i18n';

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const navItems = [
  { label: 'Servers', to: '/catalog' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Locations', to: '/locations' },
  { label: 'Compare', to: '/compare' },
  { label: 'Docs', to: '/resources' },
  { label: 'Updates', to: '/releases' },
] as const;

const footerGroups = [
  {
    label: 'Explore',
    links: [
      { label: 'Servers', to: '/catalog' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Compare', to: '/compare' },
      { label: 'Locations', to: '/locations' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Docs', to: '/resources' },
      { label: 'Updates', to: '/releases' },
    ],
  },
  {
    label: 'Account',
    links: [
      { label: 'Customer portal', to: '/app' },
      { label: 'Request quote', to: '/quote' },
    ],
  },
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box minH="100dvh" bg="surface.50">
      <SkipNavLink>Skip to content</SkipNavLink>
      <Box
        as="header"
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
            <ChakraLink asChild color="ink.900" flexShrink="0" fontWeight="750">
              <NavLink to="/">
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
                    <Text lineHeight="1">HelioStack</Text>
                    <Text color="ink.500" fontSize="xs" lineHeight="1.1">
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
                <HeaderLink item={item} key={item.to} />
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
                    >
                      Portal
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
                    >
                      Get quote
                    </Box>
                  )}
                </NavLink>
              </ChakraLink>
              <NativeSelect.Root disabled flexShrink="0" w="82px" size="sm">
                <NativeSelect.Field
                  aria-label="Language switching coming soon"
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="control"
                  color="ink.500"
                  defaultValue={defaultLocale}
                  h="8"
                  minH="8"
                  px="2"
                  title="Language switching coming soon"
                >
                  {supportedLocales.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                      {locale.nativeLabel}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Flex>
          </Grid>
        </Container>
      </Box>
      <SkipNavContent />
      <Box id="app-content">{children}</Box>
      <Box as="footer" borderColor="surface.200" borderTopWidth="1px" bg="white">
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
                Cloud and dedicated server catalog with regional prices, stock, docs, and customer
                quote workflows.
              </Text>
            </Stack>
            {footerGroups.map((group) => (
              <Stack gap="2.5" key={group.label} minW={{ md: '120px' }}>
                <Text color="ink.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                  {group.label}
                </Text>
                <Stack gap="1.5">
                  {group.links.map((link) => (
                    <FooterLink key={link.to} to={link.to}>
                      {link.label}
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

function HeaderLink({ item }: { readonly item: (typeof navItems)[number] }) {
  return (
    <ChakraLink asChild>
      <NavLink to={item.to}>
        {({ isActive }) => (
          <Box
            borderWidth="1px"
            borderColor={isActive ? 'brand.100' : 'surface.200'}
            borderRadius="control"
            color={isActive ? 'brand.500' : 'ink.700'}
            fontSize="xs"
            fontWeight="700"
            px={{ base: '2', md: '2.5' }}
            py="1.5"
            whiteSpace="nowrap"
            bg={isActive ? 'brand.50' : 'white'}
          >
            {item.label}
          </Box>
        )}
      </NavLink>
    </ChakraLink>
  );
}

function FooterLink({ children, to }: { readonly children: React.ReactNode; readonly to: string }) {
  return (
    <ChakraLink asChild color="ink.700" fontSize="sm" fontWeight="650">
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
}
