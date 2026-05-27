import { Container, Grid, Heading, Stack, Text } from '@chakra-ui/react';

import { BackNavButton, FieldHint, FilterCard, PageSectionSurface, SectionEyebrow } from 'src/shared/ui';
import type { PortalSavedPlanDetailPageViewModel } from '../../model/PortalSavedPlanDetailPageViewModel';

export function SavedPlanAccessState({ vm }: { readonly vm: PortalSavedPlanDetailPageViewModel }) {
  return (
    <PageSectionSurface flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '4', md: '5' }}>
          <BackNavButton fallbackTo="/app" />
          <FilterCard>
            <SectionEyebrow>Access check</SectionEyebrow>
            <Heading as="h1" color="ink.900" fontSize="3xl">
              Saved plan is not available for this user
            </Heading>
            <FieldHint>
              The backend mock resolved the current user from cookies and rejected this plan id
              before showing customer data.
            </FieldHint>
            <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
              {vm.accessRows.map((row) => (
                <PlanFact key={row.label} label={row.label} value={row.value} />
              ))}
            </Grid>
          </FilterCard>
        </Stack>
      </Container>
    </PageSectionSurface>
  );
}

function PlanFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack bg="panelGlassBg" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
      <Text color="ink.900" fontSize="sm" fontWeight="760">
        {value}
      </Text>
    </Stack>
  );
}
