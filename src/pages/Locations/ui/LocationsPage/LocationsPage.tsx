import { Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import { locationsIntroImage } from 'src/shared/assets';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  DarkFact,
  EmptyState,
  FieldHint,
  FilterCard,
  MetricGrid,
  PageSectionSurface,
  PageIntroGrid,
  ResetButton,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { LocationsPageViewModel } from '../../model/LocationsPageViewModel';
import { LocationCard } from '../LocationCard/LocationCard';

export const LocationsPage = observer(function LocationsPage() {
  const [vm] = useState(() => new LocationsPageViewModel());
  const location = useLocation();
  const returnState = createReturnState(location);
  const featuredLocation = vm.featuredLocation;

  return (
    <PageSectionSurface tone="locations" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/" showOnlyWithReturnState />
          <PageIntroGrid
            eyebrow="Locations"
            image={{ src: locationsIntroImage }}
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
                  label="Value tier"
                  onChange={(value) => vm.setValueTier(value)}
                  options={vm.valueTierOptions}
                  value={vm.selectedValueTierId}
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
                  {vm.filteredLocations.length} regions · {vm.filteredTotalStock} units available
                </Text>
              </Stack>
              {vm.hasUserFilters ? (
                <ResetButton onClick={() => vm.resetFilters()}>
                  Reset filters
                </ResetButton>
              ) : null}
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
                  <Stack
                    asChild
                    color="inherit"
                    cursor="pointer"
                    gap="3"
                    textDecoration="none"
                    transition="transform 0.18s ease"
                    _focusVisible={{
                      boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.28)',
                      outline: 'none',
                    }}
                    _hover={{ transform: 'translateY(-1px)' }}
                  >
                    <Link state={returnState} to={`/locations/${featuredLocation.regionId}`}>
                      <Stack gap="1">
                        <Heading as="h2" color="white" fontSize="2xl">
                          {featuredLocation.regionLabel}
                        </Heading>
                        <Text color="darkPanelText" fontSize="sm">
                          {featuredLocation.totalStock} units · {featuredLocation.fastestSetupHours}
                          h fastest setup
                        </Text>
                      </Stack>
                      <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                        <DarkFact
                          label="Best value tier"
                          value={String(featuredLocation.bestValueTier)}
                        />
                        <DarkFact
                          label="Family coverage"
                          value={`${featuredLocation.familyCoveragePercent}%`}
                        />
                      </Grid>
                    </Link>
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
                      asChild
                      alignItems="center"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      color="inherit"
                      cursor="pointer"
                      gap="3"
                      key={region.regionId}
                      minW="0"
                      p="3"
                      textDecoration="none"
                      templateColumns="minmax(0, 1fr)"
                      transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
                      _focusVisible={{
                        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
                        outline: 'none',
                      }}
                      _hover={{
                        borderColor: 'activeBorder',
                        boxShadow: '0 12px 30px rgba(16, 24, 40, 0.1)',
                        transform: 'translateY(-1px)',
                      }}
                    >
                      <Link state={returnState} to={`/locations/${region.regionId}`}>
                        <Stack gap="0" minW="0">
                          <Text color="ink.900" fontSize="sm" fontWeight="760">
                            {region.regionLabel}
                          </Text>
                          <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                          {region.totalStock} units · {region.bestValueTier} value tier
                        </Text>
                        </Stack>
                      </Link>
                    </Grid>
                  ))}
                </Stack>
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </PageSectionSurface>
  );
});
