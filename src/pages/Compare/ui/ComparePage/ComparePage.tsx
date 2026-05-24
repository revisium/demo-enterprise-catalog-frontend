import { Badge, Box, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';

import {
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { ComparePageViewModel } from '../../model/ComparePageViewModel';

export const ComparePage = observer(function ComparePage() {
  const [vm] = useState(() => new ComparePageViewModel());
  const recommendation = vm.recommendation;

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Server comparison"
          metrics={vm.highlights}
          metricsLabel="Comparison summary"
          summary="Choose up to four server plans, narrow them to a region, then compare price, hardware, stock, and setup time before sending a quote request."
          title="Build a short list for the next quote."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: '1.4fr 1fr' }}
        >
          <FilterCard>
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
                label="Region"
                onChange={(value) => vm.setRegion(value)}
                options={vm.regionOptions}
                value={vm.selectedRegionId}
              />
              <SelectField
                label="Scenario"
                onChange={(value) => vm.setScenario(value)}
                options={vm.scenarioOptions}
                value={vm.selectedScenarioId}
              />
              <SelectField
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

          <FilterCard>
            <SectionEyebrow>Quote fit</SectionEyebrow>
            <FieldHint>
              Best available option in {vm.selectedRegionLabel}. The card changes as filters change.
            </FieldHint>
            <Stack
              bg="panelGlassBg"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="2"
              p="3"
            >
              <Text color="ink.900" fontSize="xl" fontWeight="780">
                {recommendation?.name ?? 'No plan selected'}
              </Text>
              <Text color="ink.500" fontSize="sm">
                {recommendation?.summary ?? 'Select at least one plan with matching stock.'}
              </Text>
              {recommendation ? (
                <Flex gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {recommendation.family}
                  </Badge>
                  <Badge bg="successBg" borderRadius="8px" color="successText">
                    {recommendation.supportTier}
                  </Badge>
                  <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                    score {vm.bestFitRows[0]?.fitScore ?? 0}
                  </Badge>
                </Flex>
              ) : null}
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
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="0"
            overflow="hidden"
          >
            <Flex
              align="center"
              borderBottomColor="surface.200"
              borderBottomWidth="1px"
              gap="3"
              justify="space-between"
              p="4"
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
              display={{ base: 'none', lg: 'grid' }}
              gap="0"
              templateColumns={`180px repeat(${vm.comparedProducts.length}, minmax(0, 1fr))`}
            >
              <Box p="4">
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
                  p="4"
                >
                  <Text color="ink.900" fontWeight="780">
                    {product.name}
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                      {product.family}
                    </Badge>
                    <Box asChild color="brand.500" fontSize="sm" fontWeight="760">
                      <RouterLink to={`/catalog/${product.id}`}>Open plan</RouterLink>
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
                templateColumns={{
                  base: '1fr',
                  lg: `180px repeat(${vm.comparedProducts.length}, minmax(0, 1fr))`,
                }}
              >
                <Box bg={{ base: 'surface.50', lg: 'transparent' }} p="4">
                  <Text color="ink.700" fontWeight="760">
                    {metric.label}
                  </Text>
                </Box>
                {metric.values.map((value, index) => (
                  <Flex
                    align="center"
                    borderLeftColor={{ base: 'transparent', lg: 'surface.200' }}
                    borderLeftWidth={{ base: '0', lg: '1px' }}
                    borderTopColor={{ base: 'surface.200', lg: 'transparent' }}
                    borderTopWidth={{ base: index === 0 ? '0' : '1px', lg: '0' }}
                    justify="space-between"
                    key={`${metric.id}-${vm.comparedProducts[index]?.id ?? index}`}
                    minH="14"
                    p="4"
                  >
                    <Text color="ink.500" display={{ base: 'block', lg: 'none' }} fontSize="sm">
                      {vm.comparedProducts[index]?.name}
                    </Text>
                    <Text color="ink.900" fontWeight="760">
                      {value}
                    </Text>
                  </Flex>
                ))}
              </Grid>
            ))}
          </Stack>
        )}

        <Grid gap="3" mt="4" templateColumns={{ base: '1fr', lg: '1fr auto' }}>
          <Stack gap="2">
            {vm.bestFitRows.map((row) => (
              <Grid
                alignItems="center"
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={row.id}
                p="3"
                templateColumns={{ base: '1fr', md: '1fr 120px 140px 120px' }}
              >
                <Stack gap="0">
                  <Box asChild color="ink.900" fontWeight="760">
                    <RouterLink to={row.detailHref}>{row.label}</RouterLink>
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

          <Box
            asChild
            alignSelf="start"
            bg="ctaBg"
            borderRadius="8px"
            color="white"
            fontSize="sm"
            fontWeight="760"
            px="4"
            py="2.5"
          >
            <RouterLink to={vm.quotePath}>Request quote</RouterLink>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
});
