import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  SkipNavContent,
  SkipNavLink,
  Text,
} from '@chakra-ui/react';
import { NavLink } from 'react-router';

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const navItems = [
  { label: 'Catalog', to: '/catalog' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Compare', to: '/compare' },
  { label: 'Resources', to: '/resources' },
  { label: 'Releases', to: '/releases' },
  { label: 'Quote', to: '/quote' },
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box minH="100dvh" bg="appFrameBg">
      <SkipNavLink>Skip to content</SkipNavLink>
      <Flex
        as="header"
        position="sticky"
        top="0"
        zIndex="5"
        align="center"
        justify="space-between"
        gap="4"
        px={{ base: '4', md: '8', xl: '12' }}
        py="3"
        borderBottomWidth="1px"
        borderColor="blackAlpha.200"
        bg="headerBg"
        backdropFilter="blur(18px)"
      >
        <ChakraLink asChild fontWeight="750">
          <NavLink to="/">
            <HStack gap="3">
              <Flex
                align="center"
                justify="center"
                w="9"
                h="9"
                borderRadius="control"
                bg="brand.500"
                color="white"
                fontSize="xs"
              >
                NX
              </Flex>
              <Text>Nexora Systems</Text>
            </HStack>
          </NavLink>
        </ChakraLink>
        <Flex as="nav" aria-label="Primary navigation" justify="flex-end" gap="1.5" wrap="wrap">
          {navItems.map((item) => (
            <ChakraLink asChild key={item.to}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <Box
                    borderWidth="1px"
                    borderColor={isActive ? 'brandBorderActive' : 'brandBorderMuted'}
                    borderRadius="control"
                    px="3"
                    py="2"
                    color={isActive ? 'brand.700' : 'ink.700'}
                    bg={isActive ? 'brand.50' : 'navIdleBg'}
                    fontSize="sm"
                  >
                    {item.label}
                  </Box>
                )}
              </NavLink>
            </ChakraLink>
          ))}
        </Flex>
      </Flex>
      <SkipNavContent />
      <Box id="app-content">{children}</Box>
    </Box>
  );
}
