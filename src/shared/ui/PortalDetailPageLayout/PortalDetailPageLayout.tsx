import { Container, Grid, Stack } from '@chakra-ui/react';
import { type ReactNode } from 'react';

import { BackNavButton } from '../BackNavButton/BackNavButton';
import { PageSectionSurface } from '../PageSectionSurface/PageSectionSurface';
import { StickyPanel } from '../QueryControls/QueryControls';

interface PortalDetailPageLayoutProps {
  readonly aside: ReactNode;
  readonly backFallback: string;
  readonly children: ReactNode;
  readonly heroPanel: ReactNode;
  readonly summaryPanel: ReactNode;
}

const sectionGap = { base: '4', md: '5' } as const;

export function PortalDetailPageLayout({
  aside,
  backFallback,
  children,
  heroPanel,
  summaryPanel,
}: PortalDetailPageLayoutProps) {
  return (
    <PageSectionSurface flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={sectionGap}>
          <BackNavButton fallbackTo={backFallback} />

          <Grid
            alignItems="stretch"
            gap={sectionGap}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          >
            {heroPanel}
            {summaryPanel}
          </Grid>

          <Grid
            alignItems="start"
            gap={sectionGap}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
            w="100%"
          >
            <Stack gap="4" gridColumn={{ xl: 'span 2' }} minW="0">
              {children}
            </Stack>

            <StickyPanel
              as="aside"
              gridColumn={{ xl: '3' }}
              maxH="none"
              overscrollBehavior="auto"
              overflowY="visible"
              pb="0"
              position={{ xl: 'static' }}
              pr="0"
              w="100%"
            >
              {aside}
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </PageSectionSurface>
  );
}
