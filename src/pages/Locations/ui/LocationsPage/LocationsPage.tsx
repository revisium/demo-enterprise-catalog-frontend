import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterCard,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { LocationsPageViewModel } from '../../model/LocationsPageViewModel';

export const LocationsPage = observer(function LocationsPage() {
  const [vm] = useState(() => new LocationsPageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Locations"
          metrics={vm.summaryMetrics}
          metricsLabel="Location summary"
          summary="Pick a region by available inventory, setup speed, support coverage, and server families."
          title="Choose a data-center region."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' }}
        >
          <FilterCard>
            <SectionEyebrow>Server families</SectionEyebrow>
            <FieldHint>
              See only regions that can supply the server families you care about.
            </FieldHint>
            <ChipGroup
              label="Families"
              onToggle={(id) => vm.toggleFamily(id)}
              options={vm.families}
              selectedIds={vm.selectedFamilyIds}
            />
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Availability view</SectionEyebrow>
            <FieldHint>
              Raise the stock threshold for larger rollouts or choose a support window.
            </FieldHint>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <SelectField
                label="Stock"
                onChange={(value) => vm.setMinStock(value)}
                options={vm.stockOptions}
                value={String(vm.minStock)}
              />
              <SelectField
                label="Readiness"
                onChange={(value) => vm.setReadinessBand(value)}
                options={vm.readinessOptions}
                value={vm.selectedReadinessBandId}
              />
            </Grid>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <SelectField
                label="Support"
                onChange={(value) => vm.setSupportWindow(value)}
                options={vm.supportOptions}
                value={vm.selectedSupportWindowId}
              />
            </Grid>

            <SelectField
              label="Sort"
              onChange={(value) => vm.setSort(value)}
              options={vm.sortOptions}
              value={vm.sortId}
            />

            <QuerySummary rows={vm.queryRows} />
          </FilterCard>
        </Grid>

        <Stack as="section" aria-label="Data-center locations" gap="3">
          {vm.hasNoMatches ? (
            <EmptyState
              actionLabel="Reset filters"
              onAction={() => vm.resetFilters()}
              summary="No region currently matches this family, stock, and support combination. Reset filters to compare all regions."
              title="No regions match these filters"
            />
          ) : null}
          {vm.filteredLocations.map((location) => (
            <Grid
              alignItems="stretch"
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              key={location.regionId}
              p="4"
              templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 180px 180px' }}
            >
              <Stack gap="3">
                <Flex align="center" gap="2" justify="space-between" wrap="wrap">
                  <Stack gap="0">
                    <Heading as="h2" color="ink.900" fontSize="xl">
                      {location.regionLabel}
                    </Heading>
                    <Text color="ink.500" fontSize="sm">
                      {location.dataCenterCodes.join(', ')} · updated{' '}
                      {vm.formatUpdatedDate(location.latestUpdatedAt)}
                    </Text>
                  </Stack>
                  <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                    {location.plans.length} plan rows
                  </Badge>
                  <Badge bg="successBg" borderRadius="8px" color="successText">
                    {location.readinessScore} readiness
                  </Badge>
                  <Button asChild borderRadius="8px" size="xs" variant="outline">
                    <Link to={`/locations/${location.regionId}`}>Open region</Link>
                  </Button>
                </Flex>

                <Flex gap="2" wrap="wrap">
                  {location.families.map((family) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family}>
                      {family}
                    </Badge>
                  ))}
                </Flex>

                <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}>
                  {location.plans.slice(0, 4).map((row) => (
                    <Grid
                      alignItems="center"
                      bg="panelGlassBg"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="2"
                      key={`${location.regionId}-${row.plan.id}`}
                      p="3"
                      templateColumns="1fr auto"
                    >
                      <Stack gap="0">
                        <Text color="ink.900" fontSize="sm" fontWeight="760">
                          {row.plan.name}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          {row.dataCenterCode} · ${row.effectiveMonthlyPrice}/mo · efficiency{' '}
                          {row.priceEfficiencyScore}
                        </Text>
                      </Stack>
                      <Button asChild borderRadius="8px" size="xs" variant="outline">
                        <Link to={row.planHref}>Open</Link>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Stack>

              <Stack gap="1">
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {location.totalStock}
                </Text>
                <Text color="ink.500" fontSize="sm">
                  units available
                </Text>
              </Stack>

              <Stack gap="1">
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {location.familyCoveragePercent}%
                </Text>
                <Text color="ink.500" fontSize="sm">
                  family coverage · {location.enterpriseCoveragePercent}% enterprise support
                </Text>
                <Text color="ink.500" fontSize="sm">
                  {location.fastestSetupHours}h fastest setup · {location.supportWindows.join(', ')}
                </Text>
              </Stack>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
});
