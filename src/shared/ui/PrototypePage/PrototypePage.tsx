import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';

import { PageSectionSurface, PanelHeroCallout } from 'src/shared/ui';

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
    <PageSectionSurface flex="1">
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
          <PanelHeroCallout
            eyebrow="Focus"
            eyebrowFontSize="xs"
            title={asideTitle}
            titleFontSize="2xl"
          >
            <Text color="darkPanelText" fontSize="sm">
              {asideSummary}
            </Text>
          </PanelHeroCallout>
        </Grid>
        {children}
      </Container>
    </PageSectionSurface>
  );
}
