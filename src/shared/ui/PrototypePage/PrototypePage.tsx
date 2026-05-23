import { Box, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';

interface PrototypePageProps {
  readonly asideSummary: string;
  readonly asideTitle: string | undefined;
  readonly children: React.ReactNode;
  readonly eyebrow: string;
  readonly summary: string;
  readonly title: string;
}

export function PrototypePage({
  asideSummary,
  asideTitle,
  children,
  eyebrow,
  summary,
  title,
}: PrototypePageProps) {
  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '7', md: '10' }}>
        <Grid
          alignItems="stretch"
          bg="recommendationBg"
          borderColor="panelBorderStrong"
          borderRadius="8px"
          borderWidth="1px"
          boxShadow="panel"
          gap={{ base: '5', lg: '8' }}
          p={{ base: '4', md: '5' }}
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 320px' }}
        >
          <Stack gap="3">
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              {eyebrow}
            </Text>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              {title}
            </Heading>
            <Text color="ink.700" fontSize="md" maxW="720px">
              {summary}
            </Text>
          </Stack>
          <Stack
            bg="surface.900"
            borderRadius="8px"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
            color="white"
            gap="2"
            p="4"
          >
            <Text
              color="darkPanelMutedText"
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
            >
              Focus
            </Text>
            <Text fontSize="2xl" fontWeight="800" lineHeight="1.1">
              {asideTitle}
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              {asideSummary}
            </Text>
          </Stack>
        </Grid>
        {children}
      </Container>
    </Box>
  );
}
