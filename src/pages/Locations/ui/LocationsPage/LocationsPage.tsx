import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterCard,
  MetricGrid,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { LocationsPageViewModel } from '../../model/LocationsPageViewModel';

type LocationResult = LocationsPageViewModel['filteredLocations'][number];
type ReturnState = ReturnType<typeof createReturnState>;

export const LocationsPage = observer(function LocationsPage() {
  const [vm] = useState(() => new LocationsPageViewModel());
  const location = useLocation();
  const returnState = createReturnState(location);
  const featuredLocation = vm.featuredLocation;

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/" showOnlyWithReturnState />
          <PageIntroGrid
            eyebrow="Locations"
            metrics={vm.summaryMetrics}
            metricsLabel="Location summary"
            summary="Choose a region by stock, setup speed, support coverage, and available server families."
            title="Data-center locations"
          />

          <Grid
            alignItems="stretch"
            gap={{ base: '4', md: '5' }}
            templateColumns={{
              base: '1fr',
              lg: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            }}
          >
            <FilterCard>
              <SectionEyebrow>Region scope</SectionEyebrow>
              <Heading as="h2" color="ink.900" fontSize="xl">
                Server families
              </Heading>
              <FieldHint>
                Narrow the map to regions that can supply the plan families in a rollout.
              </FieldHint>
              <ChipGroup
                label="Families"
                onToggle={(id) => vm.toggleFamily(id)}
                options={vm.families}
                selectedIds={vm.selectedFamilyIds}
              />
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Availability</SectionEyebrow>
              <Grid gap="3" templateColumns={{ base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }}>
                <SelectField
                  compact
                  label="Stock"
                  onChange={(value) => vm.setMinStock(value)}
                  options={vm.stockOptions}
                  value={String(vm.minStock)}
                />
                <SelectField
                  compact
                  label="Readiness"
                  onChange={(value) => vm.setReadinessBand(value)}
                  options={vm.readinessOptions}
                  value={vm.selectedReadinessBandId}
                />
                <SelectField
                  compact
                  label="Support"
                  onChange={(value) => vm.setSupportWindow(value)}
                  options={vm.supportOptions}
                  value={vm.selectedSupportWindowId}
                />
                <SelectField
                  compact
                  label="Sort"
                  onChange={(value) => vm.setSort(value)}
                  options={vm.sortOptions}
                  value={vm.sortId}
                />
              </Grid>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Active view</SectionEyebrow>
              <MetricGrid
                ariaLabel="Filtered location metrics"
                columns={{ base: 2, sm: 4, xl: 2 }}
                metrics={vm.summaryMetrics}
              />
              <QuerySummary rows={vm.queryRows} />
            </FilterCard>
          </Grid>

          <Grid
            alignItems="start"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
            w="100%"
          >
            <Flex
              align="end"
              gap="3"
              gridColumn={{ xl: 'span 2' }}
              justify="space-between"
              minW="0"
              wrap="wrap"
            >
              <Stack gap="1">
                <SectionEyebrow>Regions</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Capacity by location
                </Heading>
                <Text color="ink.500" fontSize="sm">
                  {vm.filteredLocations.length} regions ·{' '}
                  {vm.filteredLocations.reduce((total, region) => total + region.totalStock, 0)}{' '}
                  units available
                </Text>
              </Stack>
              <Button
                borderRadius="8px"
                onClick={() => vm.resetFilters()}
                size="sm"
                variant="outline"
              >
                Reset filters
              </Button>
            </Flex>

            <Stack
              as="section"
              aria-label="Data-center locations"
              gap="4"
              gridColumn={{ xl: 'span 2' }}
              gridRow={{ xl: '2' }}
              minW="0"
              overflowX={{ base: 'auto', lg: 'visible' }}
              pb={{ base: '1', lg: '0' }}
            >
              {vm.hasNoMatches ? (
                <EmptyState
                  actionLabel="Reset filters"
                  onAction={() => vm.resetFilters()}
                  summary="No region currently matches this family, stock, and support combination. Reset filters to compare all regions."
                  title="No regions match these filters"
                />
              ) : null}
              {vm.filteredLocations.map((region) => (
                <LocationCard
                  key={region.regionId}
                  location={region}
                  returnState={returnState}
                  vm={vm}
                />
              ))}
            </Stack>

            <StickyPanel
              as="aside"
              gridColumn={{ xl: '3' }}
              gridRow={{ xl: '2' }}
              maxH="none"
              minW="0"
              overscrollBehavior="auto"
              overflowY="visible"
              pb="0"
              position={{ xl: 'static' }}
              pr="0"
              w="100%"
            >
              <FilterCard bg="panelDarkBg" borderColor="darkPanelBorder" color="white">
                <Text
                  color="darkPanelMutedText"
                  fontSize="xs"
                  fontWeight="800"
                  textTransform="uppercase"
                >
                  Best capacity match
                </Text>
                {featuredLocation ? (
                  <Stack gap="3">
                    <Stack gap="1">
                      <Heading as="h2" color="white" fontSize="2xl">
                        {featuredLocation.regionLabel}
                      </Heading>
                      <Text color="darkPanelText" fontSize="sm">
                        {featuredLocation.totalStock} units · {featuredLocation.fastestSetupHours}h
                        fastest setup
                      </Text>
                    </Stack>
                    <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                      <DarkFact label="Readiness" value={String(featuredLocation.readinessScore)} />
                      <DarkFact
                        label="Family coverage"
                        value={`${featuredLocation.familyCoveragePercent}%`}
                      />
                    </Grid>
                    <Button asChild bg="reserveButtonBg" borderRadius="8px" color="ink.900">
                      <Link state={returnState} to={`/locations/${featuredLocation.regionId}`}>
                        Open region
                      </Link>
                    </Button>
                  </Stack>
                ) : (
                  <Text color="darkPanelText" fontSize="sm">
                    Reset filters to restore the regional capacity shortlist.
                  </Text>
                )}
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Shortlist</SectionEyebrow>
                <FieldHint>
                  Top visible regions stay aligned with the active filters and sort.
                </FieldHint>
                <Stack gap="2">
                  {vm.filteredLocations.slice(0, 4).map((region) => (
                    <Grid
                      alignItems="center"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="3"
                      key={region.regionId}
                      minW="0"
                      p="3"
                      templateColumns="minmax(0, 1fr) auto"
                    >
                      <Stack gap="0" minW="0">
                        <Text color="ink.900" fontSize="sm" fontWeight="760">
                          {region.regionLabel}
                        </Text>
                        <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                          {region.totalStock} units · {region.readinessScore} readiness
                        </Text>
                      </Stack>
                      <Button asChild borderRadius="8px" size="xs" variant="outline">
                        <Link state={returnState} to={`/locations/${region.regionId}`}>
                          Open
                        </Link>
                      </Button>
                    </Grid>
                  ))}
                </Stack>
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

interface LocationCardProps {
  readonly location: LocationResult;
  readonly returnState: ReturnState;
  readonly vm: LocationsPageViewModel;
}

function LocationCard({ location, returnState, vm }: LocationCardProps) {
  return (
    <Grid
      alignItems="stretch"
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      gap="4"
      minW={{ base: '680px', sm: '720px', md: '0' }}
      p="3"
      templateColumns={{
        base: 'minmax(0, 1fr) 204px',
        lg: 'minmax(0, 1fr) 260px',
      }}
    >
      <Stack gap="3" minW="0">
        <Flex align="start" gap="3" justify="space-between" minW="0" wrap="wrap">
          <Stack gap="1" minW="0">
            <Heading as="h3" color="ink.900" fontSize="xl">
              <Link state={returnState} to={`/locations/${location.regionId}`}>
                {location.regionLabel}
              </Link>
            </Heading>
            <Text color="ink.500" fontSize="sm" overflowWrap="anywhere">
              {location.dataCenterCodes.join(', ')} · updated{' '}
              {vm.formatUpdatedDate(location.latestUpdatedAt)}
            </Text>
          </Stack>
          <Flex gap="2" wrap="wrap">
            <Badge bg="successBg" borderRadius="8px" color="successText">
              {location.readinessScore} readiness
            </Badge>
            <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
              {location.plans.length} plans
            </Badge>
          </Flex>
        </Flex>

        <Flex gap="2" wrap="wrap">
          {location.families.map((family) => (
            <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family}>
              {family}
            </Badge>
          ))}
        </Flex>

        <Stack
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="0"
          overflow="hidden"
        >
          {location.plans.slice(0, 4).map((row) => (
            <Grid
              alignItems="center"
              bg="panelGlassBg"
              borderBottomColor="surface.200"
              borderBottomWidth="1px"
              gap="3"
              key={`${location.regionId}-${row.plan.id}`}
              p="3"
              templateColumns="minmax(0, 1fr) 84px 76px auto"
            >
              <Stack gap="0" minW="0">
                <Text color="ink.900" fontSize="sm" fontWeight="760" overflowWrap="anywhere">
                  {row.plan.name}
                </Text>
                <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                  {row.dataCenterCode} · {row.plan.family}
                </Text>
              </Stack>
              <Text color="ink.900" fontSize="sm" fontWeight="760">
                ${row.effectiveMonthlyPrice}/mo
              </Text>
              <Text color="ink.500" fontSize="sm">
                {row.stock} units
              </Text>
              <Button asChild borderRadius="8px" justifySelf="end" size="xs" variant="outline">
                <Link state={returnState} to={row.planHref}>
                  Open
                </Link>
              </Button>
            </Grid>
          ))}
        </Stack>
      </Stack>

      <Stack
        bg="panelGlassBg"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        gap="3"
        justify="space-between"
        p="3"
      >
        <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
          <LocationFact label="Stock" value={String(location.totalStock)} />
          <LocationFact label="Setup" value={`${location.fastestSetupHours}h`} />
          <LocationFact label="Families" value={`${location.familyCoveragePercent}%`} />
          <LocationFact label="Support" value={`${location.enterpriseCoveragePercent}%`} />
        </Grid>
        <Stack gap="1">
          {location.supportWindows.map((supportWindow) => (
            <Text color="ink.500" fontSize="sm" key={supportWindow}>
              {vm.formatSupportWindow(supportWindow)}
            </Text>
          ))}
        </Stack>
        <Button asChild bg="ctaBg" borderRadius="8px" color="white">
          <Link state={returnState} to={`/locations/${location.regionId}`}>
            View capacity
          </Link>
        </Button>
      </Stack>
    </Grid>
  );
}

function LocationFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="2.5"
    >
      <Text color="ink.900" fontSize="xl" fontWeight="780" lineHeight="1">
        {value}
      </Text>
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}

function DarkFact({ label, value }: { readonly label: string; readonly value: ReactNode }) {
  return (
    <Stack
      bg="darkBadgeBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="3"
    >
      <Text color="white" fontSize="2xl" fontWeight="800" lineHeight="1">
        {value}
      </Text>
      <Text color="darkPanelMutedText" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
