import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterCard,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { LocationDetailPageViewModel } from '../../model/LocationDetailPageViewModel';

type PlanResult = LocationDetailPageViewModel['filteredPlanRows'][number];
type ReturnState = ReturnType<typeof createReturnState>;

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
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/locations" />

          <Grid
            alignItems="stretch"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          >
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              gridColumn={{ xl: 'span 2' }}
              h="100%"
              justify="space-between"
              minW="0"
              p="3"
            >
              <Stack gap="3">
                <SectionEyebrow>Location detail</SectionEyebrow>
                <Heading
                  as="h1"
                  color="ink.900"
                  fontSize={{ base: '3xl', md: '5xl' }}
                  lineHeight="1"
                >
                  {regionSummary.regionLabel} capacity
                </Heading>
                <Text color="ink.700" fontSize="md" maxW="700px">
                  Compare available server plans, stock, setup windows, support coverage, and
                  regional alternatives before starting a quote.
                </Text>
              </Stack>

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
            </Stack>

            <Stack
              bg="panelDarkBg"
              borderColor="darkPanelBorder"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              color="white"
              gap="4"
              h="100%"
              justify="space-between"
              minW="0"
              p="3"
            >
              <Stack gap="1">
                <Text
                  color="darkPanelMutedText"
                  fontSize="xs"
                  fontWeight="800"
                  textTransform="uppercase"
                >
                  Region snapshot
                </Text>
                <Text fontSize="5xl" fontWeight="800" lineHeight="1">
                  {regionSummary.readinessScore}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  readiness score across stock, setup speed, family coverage, and support.
                </Text>
              </Stack>
              <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                <DarkFact label="Server plans" value={String(regionSummary.planCount)} />
                <DarkFact label="Total stock" value={String(regionSummary.totalStock)} />
                <DarkFact label="Fastest setup" value={`${regionSummary.fastestSetupHours}h`} />
                <DarkFact
                  label="Family coverage"
                  value={`${regionSummary.familyCoveragePercent}%`}
                />
              </Grid>
            </Stack>
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

            <FilterCard>
              <SectionEyebrow>Active view</SectionEyebrow>
              <QuerySummary rows={vm.queryRows} />
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
                        label="Efficiency"
                        value={String(featuredPlan.priceEfficiencyScore)}
                      />
                      <RegionFact label="Setup" value={`${featuredPlan.setupHours}h`} />
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
                  Alternatives are ranked by shared server families, readiness, and stock.
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
    </Box>
  );
});

interface PlanRowProps {
  readonly returnState: ReturnState;
  readonly row: PlanResult;
  readonly vm: LocationDetailPageViewModel;
}

function PlanRow({ returnState, row, vm }: PlanRowProps) {
  return (
    <Grid
      alignItems="center"
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      gap="3"
      minW={{ base: '680px', sm: '720px', md: '0' }}
      p="3"
      templateColumns="minmax(0, 1fr) 82px 68px 72px 78px"
      w="100%"
    >
      <Stack gap="1" minW="0">
        <Box asChild alignSelf="start" color="ink.900" fontWeight="780">
          <Link state={returnState} to={row.planHref}>
            {row.plan.name}
          </Link>
        </Box>
        <Text color="ink.500" fontSize="sm" lineHeight="1.4" minH="10" overflowWrap="anywhere">
          {row.plan.summary}
        </Text>
        <Flex gap="1.5" wrap="wrap">
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.family}
          </Badge>
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.hardware.cpuCores} cores
          </Badge>
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.hardware.ramGb} GB RAM
          </Badge>
        </Flex>
      </Stack>
      <Stack gap="0" minW="0">
        <Text color="ink.900" fontWeight="760">
          ${row.effectiveMonthlyPrice}/mo
        </Text>
        <Text color="ink.500" fontSize="xs">
          score {row.priceEfficiencyScore}
        </Text>
      </Stack>
      <Stack align="start" gap="1" minW="0">
        <Badge
          bg={row.stock > 0 ? 'successBg' : 'amberBg'}
          borderRadius="8px"
          color={row.stock > 0 ? 'successText' : 'amberText'}
        >
          {row.stock} units
        </Badge>
        <Text color="ink.500" fontSize="xs">
          {row.dataCenterCode}
        </Text>
      </Stack>
      <Stack gap="0" minW="0">
        <Text color="ink.900" fontWeight="700">
          {row.setupHours}h
        </Text>
        <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
          {vm.formatSupportWindow(row.supportWindow)}
        </Text>
      </Stack>
      <Stack align="stretch" gap="2" minW="0">
        <Button asChild borderRadius="8px" size="xs" variant="outline">
          <Link state={returnState} to={row.planHref}>
            Open
          </Link>
        </Button>
        <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="xs">
          <Link state={returnState} to={row.quoteHref}>
            Quote
          </Link>
        </Button>
      </Stack>
    </Grid>
  );
}

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
