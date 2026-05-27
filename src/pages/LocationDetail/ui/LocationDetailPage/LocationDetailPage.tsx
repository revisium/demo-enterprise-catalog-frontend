import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterCard,
  PageIntroGrid,
  ProductVisual,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { LocationDetailPageViewModel } from '../../model/LocationDetailPageViewModel';

export const LocationDetailPage = observer(function LocationDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new LocationDetailPageViewModel(params.regionId));
  const returnState = createReturnState(location);
  const { regionSummary } = vm;

  useEffect(() => {
    vm.setRouteRegionId(params.regionId);
  }, [params.regionId, vm]);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '4', md: '5' }}>
          <BackNavButton fallbackTo="/locations" />

          <PageIntroGrid
            eyebrow="Location detail"
            metrics={vm.summaryMetrics}
            metricsLabel="Region summary"
            summary={`Compare every server plan available in ${regionSummary.regionLabel} by stock, setup speed, support window, price efficiency, and recent catalog updates.`}
            title={`${regionSummary.regionLabel} capacity workspace`}
          />

          <Grid
            gap="3"
            templateColumns={{ base: '1fr', xl: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)' }}
          >
            <FilterCard>
              <SectionEyebrow>Plan filters</SectionEyebrow>
              <FieldHint>
                Filter related server plans for this region without leaving the location item.
              </FieldHint>
              <ChipGroup
                label="Families"
                onToggle={(id) => vm.toggleFamily(id)}
                options={vm.familyOptions}
                selectedIds={vm.selectedFamilyIds}
              />
              <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
                <SelectField
                  label="Stock"
                  onChange={(value) => vm.setMinStock(value)}
                  options={vm.stockOptions}
                  value={String(vm.minStock)}
                />
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

            <FilterCard>
              <SectionEyebrow>Region profile</SectionEyebrow>
              <Grid gap="2" templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}>
                <ProfileMetric label="Readiness" value={String(regionSummary.readinessScore)} />
                <ProfileMetric
                  label="Family coverage"
                  value={`${regionSummary.familyCoveragePercent}%`}
                />
                <ProfileMetric
                  label="Enterprise support"
                  value={`${regionSummary.enterpriseCoveragePercent}%`}
                />
                <ProfileMetric
                  label="Data centers"
                  value={String(regionSummary.dataCenterCodes.length)}
                />
              </Grid>
              <Flex gap="2" wrap="wrap">
                {regionSummary.dataCenterCodes.map((code) => (
                  <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700" key={code}>
                    {code}
                  </Badge>
                ))}
              </Flex>
              <Flex gap="2" wrap="wrap">
                {regionSummary.supportWindows.map((window) => (
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={window}>
                    {vm.formatSupportWindow(window)}
                  </Badge>
                ))}
              </Flex>
            </FilterCard>
          </Grid>

          <Grid gap={{ base: '4', lg: '5' }} templateColumns={{ base: '1fr', lg: '1fr 320px' }}>
            <Stack as="section" aria-label="Plans in region" gap="3">
              {vm.hasNoMatches ? (
                <EmptyState
                  actionLabel="Reset filters"
                  onAction={() => vm.resetFilters()}
                  summary="No plan in this region matches the selected family, stock, and support filters."
                  title="No plans match this regional query"
                />
              ) : null}
              {vm.filteredPlanRows.map((row) => (
                <Grid
                  alignItems="stretch"
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  boxShadow="panel"
                  gap="4"
                  key={row.plan.id}
                  p="3"
                  templateColumns={{
                    base: '1fr',
                    md: '96px minmax(0, 1fr) minmax(180px, auto)',
                  }}
                >
                  <ProductVisual
                    alt={row.plan.imageAlt}
                    minH="28"
                    radius="control"
                    tone={row.plan.visualTone}
                  />
                  <Stack gap="3">
                    <Flex align="center" gap="2" justify="space-between" wrap="wrap">
                      <Stack gap="0">
                        <Heading as="h2" color="ink.900" fontSize="xl">
                          {row.plan.name}
                        </Heading>
                        <Text color="ink.500" fontSize="sm">
                          {row.plan.family} · {row.dataCenterCode} · updated{' '}
                          {row.displayUpdatedDate}
                        </Text>
                      </Stack>
                      <Badge bg="successBg" borderRadius="8px" color="successText">
                        {row.priceEfficiencyScore} efficiency
                      </Badge>
                    </Flex>
                    <Text color="ink.500" fontSize="sm">
                      {row.plan.summary}
                    </Text>
                    <Flex gap="2" wrap="wrap">
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        {row.plan.hardware.cpuCores} cores
                      </Badge>
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        {row.plan.hardware.ramGb} GB RAM
                      </Badge>
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        {row.plan.supportTier}
                      </Badge>
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        revision {row.plan.system.revision}
                      </Badge>
                    </Flex>
                  </Stack>
                  <Stack align="start" color="ink.500" fontSize="sm" gap="2">
                    <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                      ${row.effectiveMonthlyPrice}/mo
                    </Text>
                    <Text>{row.stock} units available</Text>
                    <Text>
                      setup {row.setupHours}h · {vm.formatSupportWindow(row.supportWindow)}
                    </Text>
                    <Button asChild borderRadius="8px" mt="2" variant="outline">
                      <Link state={returnState} to={row.planHref}>
                        Open server
                      </Link>
                    </Button>
                  </Stack>
                </Grid>
              ))}
            </Stack>

            <StickyPanel as="aside">
              <FilterCard>
                <SectionEyebrow>Related regions</SectionEyebrow>
                <FieldHint>
                  Alternative regions are ranked by shared server families, readiness, and stock.
                </FieldHint>
                {vm.relatedRegions.map((region) => (
                  <Grid
                    alignItems="center"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="3"
                    key={region.regionId}
                    p="3"
                    templateColumns="minmax(0, 1fr) auto"
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontWeight="760">
                        {region.regionLabel}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
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
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

function ProfileMetric({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="panelGlassBg"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="3"
    >
      <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
        {value}
      </Text>
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
