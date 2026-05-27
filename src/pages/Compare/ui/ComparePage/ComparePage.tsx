import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { ComparePageViewModel } from '../../model/ComparePageViewModel';

export const ComparePage = observer(function ComparePage() {
  const [vm] = useState(() => new ComparePageViewModel());
  const recommendation = vm.recommendation;
  const location = useLocation();
  const returnState = createReturnState(location);
  const comparisonColumnTemplate = `180px repeat(${vm.comparedProducts.length}, minmax(164px, 1fr))`;
  const comparisonMinWidth = `${180 + vm.comparedProducts.length * 164}px`;

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Server comparison"
          metrics={vm.highlights}
          metricsLabel="Comparison summary"
          summary="Choose up to four server plans, narrow them to a region, then compare price, hardware, stock, and setup time before sending a quote request."
          title="Build a short list for the next quote"
        />

        <Grid
          alignItems="stretch"
          gap={{ base: '4', md: '5' }}
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
        >
          <FilterCard gridColumn={{ xl: 'span 2' }}>
            <SectionEyebrow>Comparison setup</SectionEyebrow>
            <FieldHint>
              Select plans from the catalog. Picking a fifth plan replaces the oldest selected plan.
            </FieldHint>
            <ChipGroup
              label="Plans"
              onToggle={(id) => vm.toggleProduct(id)}
              options={vm.productOptions}
              selectedIds={vm.selectedProductIds}
            />
            <Grid gap="3" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
              <SelectField
                compact
                label="Region"
                onChange={(value) => vm.setRegion(value)}
                options={vm.regionOptions}
                value={vm.selectedRegionId}
              />
              <SelectField
                compact
                label="Scenario"
                onChange={(value) => vm.setScenario(value)}
                options={vm.scenarioOptions}
                value={vm.selectedScenarioId}
              />
              <SelectField
                compact
                label="Support"
                onChange={(value) => vm.setSupportTier(value)}
                options={vm.supportTierOptions}
                value={vm.selectedSupportTier}
              />
            </Grid>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr auto auto' }}>
              <Stack gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Billing term
                </Text>
                <Flex gap="2" wrap="wrap">
                  <FilterButton
                    onClick={() => vm.setBillingTerm('monthly')}
                    selected={vm.billingTermId === 'monthly'}
                    tone="neutral"
                  >
                    Monthly
                  </FilterButton>
                  <FilterButton
                    onClick={() => vm.setBillingTerm('yearly')}
                    selected={vm.billingTermId === 'yearly'}
                    tone="neutral"
                  >
                    Yearly
                  </FilterButton>
                </Flex>
              </Stack>
              <Stack gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Availability
                </Text>
                <FilterButton
                  onClick={() => vm.setStockOnly(!vm.stockOnly)}
                  selected={vm.stockOnly}
                  tone="success"
                >
                  In stock
                </FilterButton>
              </Stack>
              <Stack align="start" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Preset
                </Text>
                <FilterButton onClick={() => vm.resetComparison()} selected={false} tone="neutral">
                  Reset
                </FilterButton>
              </Stack>
            </Grid>
            <ChipGroup
              label="Required add-ons"
              onToggle={(id) => vm.toggleAddon(id)}
              options={vm.addonOptions}
              selectedIds={vm.requiredAddonIds}
            />
            <QuerySummary rows={vm.queryRows} />
          </FilterCard>

          <FilterCard bg="panelDarkBg" borderColor="darkPanelBorder" color="white">
            <SectionEyebrow>Quote fit</SectionEyebrow>
            <FieldHint>
              Best available option in {vm.selectedRegionLabel}. The card changes as filters change.
            </FieldHint>
            <Stack gap="3" h="100%" justify="space-between">
              <Text color="white" fontSize="2xl" fontWeight="800" lineHeight="1.1">
                {recommendation?.name ?? 'No plan selected'}
              </Text>
              <Text color="darkPanelText" fontSize="sm">
                {recommendation?.summary ?? 'Select at least one plan with matching stock.'}
              </Text>
              {recommendation ? (
                <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                  <CompareFact label="Family" value={recommendation.family} />
                  <CompareFact label="Support" value={recommendation.supportTier} />
                  <CompareFact label="Score" value={String(vm.bestFitRows[0]?.fitScore ?? 0)} />
                  <CompareFact label="Region" value={vm.bestFitRows[0]?.bestRegionLabel ?? '-'} />
                </Grid>
              ) : null}
              <Button asChild bg="reserveButtonBg" borderRadius="8px" color="ink.900">
                <RouterLink state={returnState} to={vm.quotePath}>
                  Request quote
                </RouterLink>
              </Button>
            </Stack>
          </FilterCard>
        </Grid>

        {vm.hasNoComparedProducts ? (
          <EmptyState
            actionLabel="Reset comparison"
            onAction={() => vm.resetComparison()}
            summary="No selected plan has stock for this region and availability mode."
            title="No plans match the comparison filters"
          />
        ) : (
          <Box overflowX={{ base: 'auto', lg: 'visible' }} pb={{ base: '1', lg: '0' }}>
            <Stack
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="0"
              minW={{ base: comparisonMinWidth, lg: '0' }}
              overflow="hidden"
            >
              <Flex
                align="center"
                borderBottomColor="surface.200"
                borderBottomWidth="1px"
                gap="3"
                justify="space-between"
                p="3"
                wrap="wrap"
              >
                <Stack gap="1">
                  <SectionEyebrow>Comparison matrix</SectionEyebrow>
                  <Heading as="h2" color="ink.900" fontSize="2xl">
                    Plan differences
                  </Heading>
                </Stack>
                <Text color="ink.500" fontSize="sm">
                  Ranked by {vm.selectedScenarioLabel.toLowerCase()}
                </Text>
              </Flex>
              <Grid
                bg="surface.50"
                borderBottomColor="surface.200"
                borderBottomWidth="1px"
                gap="0"
                templateColumns={comparisonColumnTemplate}
              >
                <Box p="3">
                  <Text color="ink.500" fontSize="sm" fontWeight="760">
                    Metric
                  </Text>
                </Box>
                {vm.comparedProducts.map((product) => (
                  <Stack
                    borderLeftColor="surface.200"
                    borderLeftWidth="1px"
                    gap="2"
                    key={product.id}
                    p="3"
                  >
                    <Text color="ink.900" fontWeight="780" overflowWrap="anywhere">
                      {product.name}
                    </Text>
                    <Flex gap="2" wrap="wrap">
                      <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                        {product.family}
                      </Badge>
                      <Box asChild color="brand.500" fontSize="sm" fontWeight="760">
                        <RouterLink state={returnState} to={`/catalog/${product.id}`}>
                          Open plan
                        </RouterLink>
                      </Box>
                    </Flex>
                  </Stack>
                ))}
              </Grid>

              {vm.metrics.map((metric) => (
                <Grid
                  borderBottomColor="surface.200"
                  borderBottomWidth="1px"
                  gap="0"
                  key={metric.id}
                  templateColumns={comparisonColumnTemplate}
                >
                  <Box p="3">
                    <Text color="ink.700" fontWeight="760">
                      {metric.label}
                    </Text>
                  </Box>
                  {metric.values.map((value, index) => (
                    <Flex
                      align="center"
                      borderLeftColor="surface.200"
                      borderLeftWidth="1px"
                      key={`${metric.id}-${vm.comparedProducts[index]?.id ?? index}`}
                      minH="14"
                      p="3"
                    >
                      <Text color="ink.900" fontWeight="760" overflowWrap="anywhere">
                        {value}
                      </Text>
                    </Flex>
                  ))}
                </Grid>
              ))}
            </Stack>
          </Box>
        )}

        <Grid
          alignItems="start"
          gap={{ base: '4', md: '5' }}
          mt="4"
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
        >
          <Stack gap="2" gridColumn={{ xl: 'span 2' }} overflowX={{ base: 'auto', md: 'visible' }}>
            {vm.bestFitRows.map((row) => (
              <Grid
                alignItems="center"
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={row.id}
                minW={{ base: '680px', md: '0' }}
                p="3"
                templateColumns="minmax(0, 1fr) 82px 106px 146px"
              >
                <Stack gap="0" minW="0">
                  <Box asChild color="ink.900" fontWeight="760">
                    <RouterLink state={returnState} to={row.detailHref}>
                      {row.label}
                    </RouterLink>
                  </Box>
                  <Text color="ink.500" fontSize="sm">
                    Best region: {row.bestRegionLabel}
                  </Text>
                </Stack>
                <Text color="ink.900" fontSize="sm" fontWeight="760">
                  score {row.fitScore}
                </Text>
                <Text color="ink.700" fontSize="sm" fontWeight="650">
                  {row.stockLabel}
                </Text>
                <Text color="ink.500" fontSize="sm">
                  {row.setupLabel} · {row.monthlyPriceLabel}
                </Text>
              </Grid>
            ))}
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
            <FilterCard>
              <SectionEyebrow>Quote action</SectionEyebrow>
              <FieldHint>Carry the best fit and selected term into a quote request.</FieldHint>
              <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                <RouterLink state={returnState} to={vm.quotePath}>
                  Request quote
                </RouterLink>
              </Button>
            </FilterCard>
          </StickyPanel>
        </Grid>
      </Container>
    </Box>
  );
});

function CompareFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="darkBadgeBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="3"
    >
      <Text color="white" fontSize="lg" fontWeight="800" lineHeight="1.1" overflowWrap="anywhere">
        {value}
      </Text>
      <Text color="darkPanelMutedText" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
