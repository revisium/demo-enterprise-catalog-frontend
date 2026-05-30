import { Badge, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  DarkSummaryPanel,
  DetailHeroPanel,
  EmptyState,
  FieldHint,
  FilterCard,
  PageSectionSurface,
  ResetButton,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { LocationDetailPageViewModel } from '../../model/LocationDetailPageViewModel';
import { PlanRow } from '../PlanRow/PlanRow';

export const LocationDetailPage = observer(function LocationDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new LocationDetailPageViewModel(params.regionId));
  const returnState = createReturnState(location);
  const { regionSummary } = vm;
  const featuredPlan = vm.featuredPlanRow;

  useEffect(() => {
    vm.setRouteRegionId(params.regionId);
  }, [params.regionId, vm]);

  return (
    <PageSectionSurface flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/locations" />

          <Grid
            alignItems="stretch"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          >
            <DetailHeroPanel
              actions={
                <Stack gap="3">
                  <Flex gap="2" wrap="wrap">
                    {regionSummary.dataCenterCodes.map((code) => (
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700" key={code}>
                        {code}
                      </Badge>
                    ))}
                    {regionSummary.supportWindows.map((supportWindow) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={supportWindow}>
                        {vm.formatSupportWindow(supportWindow)}
                      </Badge>
                    ))}
                  </Flex>
                  <Flex gap="2" wrap="wrap">
                    {featuredPlan ? (
                      <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                        <Link state={returnState} to={featuredPlan.quoteHref}>
                          Start quote
                        </Link>
                      </Button>
                    ) : null}
                    <Button asChild borderRadius="8px" variant="outline">
                      <Link state={returnState} to="/locations">
                        All locations
                      </Link>
                    </Button>
                  </Flex>
                </Stack>
              }
              eyebrow="Location detail"
              summary="Compare available server plans, stock, setup windows, support coverage, and regional alternatives before starting a quote."
              title={`${regionSummary.regionLabel} capacity`}
            />

            <DarkSummaryPanel
              eyebrow="Region snapshot"
              metrics={[
                { label: 'Server plans', value: String(regionSummary.planCount) },
                { label: 'Total stock', value: String(regionSummary.totalStock) },
                { label: 'Fastest setup', value: `${regionSummary.fastestSetupHours}h` },
                { label: 'Best value tier', value: String(regionSummary.bestValueTier) },
                { label: 'Family coverage', value: `${regionSummary.familyCoveragePercent}%` },
              ]}
              summary="Value tier across stock, setup speed, family coverage, and support."
              value={regionSummary.bestValueTier}
            />
          </Grid>

          <Grid
            alignItems="stretch"
            gap={{ base: '4', md: '5' }}
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          >
            <FilterCard gridColumn={{ xl: 'span 2' }}>
              <SectionEyebrow>Plan controls</SectionEyebrow>
              <FieldHint>Filter regional plan rows without leaving this location.</FieldHint>
              <ChipGroup
                label="Families"
                onToggle={(id) => vm.toggleFamily(id)}
                options={vm.familyOptions}
                selectedIds={vm.selectedFamilyIds}
              />
              <Grid gap="3" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                <SelectField
                  compact
                  label="Stock"
                  onChange={(value) => vm.setMinStock(value)}
                  options={vm.stockOptions}
                  value={String(vm.minStock)}
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
          </Grid>

          <Grid
            alignItems="start"
            gap={{ base: '4', md: '5' }}
            minW="0"
            overflowX="hidden"
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
                <SectionEyebrow>Available plans</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Regional server plans
                </Heading>
                <Text color="ink.500" fontSize="sm">
                  {vm.filteredPlanRows.length} plans ·{' '}
                  {vm.filteredPlanRows.reduce((total, row) => total + row.stock, 0)} units visible
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
              aria-label="Plans in region"
              gap="4"
              gridColumn={{ xl: 'span 2' }}
              gridRow={{ xl: '2' }}
              minW="0"
              overflowX={{ base: 'auto', md: 'visible' }}
              pb={{ base: '1', md: '0' }}
              w="100%"
            >
              {vm.hasNoMatches ? (
                <EmptyState
                  actionLabel="Reset filters"
                  onAction={() => vm.resetFilters()}
                  summary="No plan in this region matches the selected family, stock, and support filters."
                  title="No plans match this regional query"
                />
              ) : null}
              {vm.filteredPlanRows.map((row) => (
                <PlanRow key={row.plan.id} returnState={returnState} row={row} vm={vm} />
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
              <FilterCard>
                <SectionEyebrow>Best visible plan</SectionEyebrow>
                {featuredPlan ? (
                  <Stack gap="3">
                    <Stack gap="1">
                      <Text color="ink.900" fontSize="lg" fontWeight="780">
                        {featuredPlan.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {featuredPlan.dataCenterCode} · ${featuredPlan.effectiveMonthlyPrice}/mo ·{' '}
                        {featuredPlan.stock} units
                      </Text>
                    </Stack>
                    <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                      <RegionFact
                        label="Value tier"
                        value={featuredPlan.valueTier}
                      />
                      <RegionFact label="Setup" value={`${featuredPlan.setupHours}h`} />
                      <RegionFact label="$/core" value={vm.formatPricePerCore(featuredPlan.pricePerCore)} />
                      <RegionFact
                        label="$/GB"
                        value={vm.formatPricePerGbRam(featuredPlan.pricePerGbRam)}
                      />
                    </Grid>
                    <Flex gap="2" wrap="wrap">
                      <Button asChild borderRadius="8px" size="sm" variant="outline">
                        <Link state={returnState} to={featuredPlan.planHref}>
                          Open server
                        </Link>
                      </Button>
                      <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                        <Link state={returnState} to={featuredPlan.quoteHref}>
                          Quote
                        </Link>
                      </Button>
                    </Flex>
                  </Stack>
                ) : (
                  <FieldHint>Reset filters to restore the regional plan shortlist.</FieldHint>
                )}
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Related regions</SectionEyebrow>
                <FieldHint>
                  Alternatives are ranked by shared server families, value tier, and stock.
                </FieldHint>
                <Stack gap="2">
                  {vm.relatedRegions.map((region) => (
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
                        <Text color="ink.900" fontWeight="760">
                          {region.regionLabel}
                        </Text>
                        <Text color="ink.500" fontSize="sm" overflowWrap="anywhere">
                          {region.matchingFamilyCount} shared families · {region.totalStock} units
                        </Text>
                      </Stack>
                      <Button asChild borderRadius="8px" size="xs" variant="outline">
                        <Link state={returnState} to={region.href}>
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
    </PageSectionSurface>
  );
});

function RegionFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="panelGlassBg"
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
