import {
  Box,
  Container,
  Flex,
  HStack,
  Link as ChakraLink,
  NativeSelect,
  SkipNavContent,
  SkipNavLink,
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
  { label: 'Docs', to: '/resources' },
  { label: 'Updates', to: '/releases' },
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box minH="100dvh" bg="#f5f7fb">
      <SkipNavLink>Skip to content</SkipNavLink>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="5"
        borderBottomWidth="1px"
        borderColor="#e3e8f0"
        bg="color-mix(in srgb, #ffffff 84%, transparent)"
        backdropFilter="blur(22px)"
      >
        <Container maxW="1240px" px={{ base: '3', md: '5' }}>
          <Flex align="center" gap="3" justify="space-between" minH="14" py="2">
            <ChakraLink asChild color="#101828" flexShrink="0" fontWeight="750">
              <NavLink to="/">
                <HStack gap="3">
                  <Flex
                    align="center"
                    justify="center"
                    w="8"
                    h="8"
                    borderRadius="control"
                    bg="linear-gradient(135deg, #1370f6 0%, #48d6c7 100%)"
                    color="white"
                    fontSize="xs"
                    fontWeight="800"
                  >
                    HS
                  </Flex>
                  <Box>
                    <Text lineHeight="1">HelioStack</Text>
                    <Text color="#667085" fontSize="xs" lineHeight="1.1">
                      Cloud servers
                    </Text>
                  </Box>
                </HStack>
              </NavLink>
            </ChakraLink>
            <Flex align="center" gap="2" justify="flex-end" minW="0">
              <Flex as="nav" aria-label="Primary navigation" gap="1" minW="0" overflowX="auto">
                {navItems.map((item) => (
                  <HeaderLink item={item} key={item.to} />
                ))}
              </Flex>
              <ChakraLink asChild flexShrink="0">
                <NavLink to="/app">
                  {({ isActive }) => (
                    <Box
                      bg={isActive ? '#eef6ff' : '#ffffff'}
                      borderColor={isActive ? '#b8d7ff' : '#e3e8f0'}
                      borderRadius="control"
                      borderWidth="1px"
                      color={isActive ? '#0b5bd3' : '#475467'}
                      fontSize="xs"
                      fontWeight="700"
                      px="2.5"
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
                      bg="linear-gradient(135deg, #101828 0%, #155eef 100%)"
                      borderColor={isActive ? '#0b5bd3' : '#155eef'}
                      borderRadius="control"
                      borderWidth="1px"
                      boxShadow="0 10px 24px rgba(21, 94, 239, 0.22)"
                      color="white"
                      fontSize="xs"
                      fontWeight="760"
                      px="2.5"
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
                  bg="#ffffff"
                  borderColor="#e3e8f0"
                  borderRadius="control"
                  color="#667085"
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
          </Flex>
        </Container>
      </Box>
      <SkipNavContent />
      <Box id="app-content">{children}</Box>
      <Box as="footer" borderColor="#e3e8f0" borderTopWidth="1px" bg="#ffffff">
        <Container maxW="1240px" px={{ base: '3', md: '5' }} py="5">
          <Flex align="center" gap="3" justify="space-between" wrap="wrap">
            <Text color="#667085" fontSize="sm">
              HelioStack cloud server catalog
            </Text>
            <Flex gap="3" wrap="wrap">
              <FooterLink to="/pricing">Pricing</FooterLink>
              <FooterLink to="/resources">Docs</FooterLink>
              <FooterLink to="/releases">Updates</FooterLink>
              <FooterLink to="/app">Customer portal</FooterLink>
            </Flex>
          </Flex>
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
            borderColor={isActive ? '#b8d7ff' : '#e3e8f0'}
            borderRadius="control"
            color={isActive ? '#0b5bd3' : '#475467'}
            fontSize="xs"
            fontWeight="700"
            px="2.5"
            py="1.5"
            whiteSpace="nowrap"
            bg={isActive ? '#eef6ff' : '#ffffff'}
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
    <ChakraLink asChild color="#475467" fontSize="sm" fontWeight="650">
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
}
