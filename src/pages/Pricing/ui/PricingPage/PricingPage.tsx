import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';

import {
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  MetricGrid,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { PricingPageViewModel } from '../../model/PricingPageViewModel';

export const PricingPage = observer(function PricingPage() {
  const [vm] = useState(() => new PricingPageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Pricing"
          metrics={vm.summaryMetrics}
          metricsLabel="Pricing summary"
          summary="Review monthly and yearly server prices across regions before building a quote."
          title="Compare regional price rows."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
        >
          <FilterCard>
            <SectionEyebrow>Commercial view</SectionEyebrow>
            <FieldHint>
              Choose the price term, keep available stock, and decide how selected add-ons should
              match.
            </FieldHint>
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
              <FilterButton
                onClick={() => vm.setStockOnly(!vm.stockOnly)}
                selected={vm.stockOnly}
                tone="success"
              >
                In stock
              </FilterButton>
            </Flex>
            <SelectField
              label="Add-on matching"
              onChange={(value) => vm.setAddonMatchMode(value)}
              options={vm.addOnMatchOptions}
              value={vm.addonMatchMode}
            />
            <ChipGroup
              label="Add-ons"
              onToggle={(id) => vm.toggleAddon(id)}
              options={vm.addons}
              selectedIds={vm.selectedAddonIds}
            />
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Server filters</SectionEyebrow>
            <FieldHint>
              Narrow by server family and memory while preserving multiple selected values.
            </FieldHint>
            <ChipGroup
              label="Families"
              onToggle={(id) => vm.toggleFamily(id)}
              options={vm.families}
              selectedIds={vm.selectedFamilyIds}
            />
            <SelectField
              label="Minimum memory"
              onChange={(value) => vm.setMinRamGb(value)}
              options={vm.minRamOptions}
              value={String(vm.minRamGb)}
            />
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Regional price rows</SectionEyebrow>
            <FieldHint>
              Filter by location, support window, setup time, and price; then choose the sort
              policy.
            </FieldHint>
            <ChipGroup
              label="Regions"
              onToggle={(id) => vm.toggleRegion(id)}
              options={vm.regions}
              selectedIds={vm.selectedRegionIds}
            />
            <ChipGroup
              label="Support windows"
              onToggle={(id) => vm.toggleSupportWindow(id)}
              options={vm.supportWindows}
              selectedIds={vm.selectedSupportWindows}
            />
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <SelectField
                label="Max price"
                onChange={(value) => vm.setMaxMonthlyPrice(value)}
                options={vm.priceOptions}
                value={String(vm.maxMonthlyPrice)}
              />
              <SelectField
                label="Max setup"
                onChange={(value) => vm.setMaxSetupHours(value)}
                options={vm.maxSetupOptions}
                value={String(vm.maxSetupHours)}
              />
              <SelectField
                label="Sort rows"
                onChange={(value) => vm.setSort(value)}
                options={vm.sortOptions}
                value={vm.sortId}
              />
            </Grid>
            <QuerySummary rows={vm.queryRows} />
          </FilterCard>
        </Grid>

        <Grid
          alignItems="start"
          gap="3"
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 360px' }}
        >
          <Stack gap="2">
            <Flex align="end" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Price-book rows</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Regional server prices
                </Heading>
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
            {vm.hasNoMatches ? (
              <EmptyState
                actionLabel="Reset filters"
                onAction={() => vm.resetFilters()}
                summary="There are no price rows for this combination. Reset filters to return to the full regional price list."
                title="No price rows match these filters"
              />
            ) : null}
            {vm.filteredRows.map((row) => {
              const selected = vm.isRowSelected(row.id);

              return (
                <Grid
                  alignItems="center"
                  bg={selected ? 'brand.50' : 'white'}
                  borderColor={selected ? 'activeBorder' : 'surface.200'}
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="3"
                  key={`${row.id}-${vm.billingTermId}`}
                  p="3"
                  templateColumns={{ base: '1fr', lg: 'minmax(0, 1.3fr) 120px 180px 130px 132px' }}
                >
                  <Stack gap="0">
                    <Box asChild alignSelf="start" color="ink.900" fontWeight="760">
                      <RouterLink to={row.detailHref}>{row.plan.name}</RouterLink>
                    </Box>
                    <Text color="ink.500" fontSize="sm">
                      {row.family} · {row.plan.hardware.cpuCores} vCPU · {row.plan.hardware.ramGb}{' '}
                      GB RAM
                    </Text>
                    <Flex gap="1.5" mt="2" wrap="wrap">
                      {row.plan.addons.slice(0, 3).map((addon) => (
                        <Badge
                          bg="panelGlassBg"
                          borderColor="surface.200"
                          borderRadius="8px"
                          borderWidth="1px"
                          color="ink.600"
                          key={addon}
                        >
                          {addon}
                        </Badge>
                      ))}
                    </Flex>
                  </Stack>
                  <Stack gap="0">
                    <Text color="ink.900" fontWeight="760">
                      ${row.billingTermPrice}/mo
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      save ${row.yearlySavingsUsd}/yr
                    </Text>
                  </Stack>
                  <Stack gap="0">
                    <Text color="ink.900" fontWeight="700">
                      {row.region.regionLabel}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {row.region.supportWindow} · setup {row.region.setupHours}h
                    </Text>
                  </Stack>
                  <Stack align={{ base: 'start', lg: 'end' }} gap="1">
                    <Badge
                      bg={row.region.stock > 0 ? 'successBg' : 'amberBg'}
                      borderRadius="8px"
                      color={row.region.stock > 0 ? 'successText' : 'amberText'}
                    >
                      {row.region.stock} units
                    </Badge>
                    <Text color="ink.500" fontSize="xs">
                      score {row.priceEfficiencyScore}
                    </Text>
                  </Stack>
                  <Button
                    aria-pressed={selected}
                    borderRadius="8px"
                    justifySelf={{ base: 'start', lg: 'end' }}
                    onClick={() => vm.toggleRow(row.id)}
                    size="sm"
                    variant={selected ? 'solid' : 'outline'}
                  >
                    {selected ? 'Selected' : 'Select'}
                  </Button>
                </Grid>
              );
            })}
          </Stack>

          <Stack as="aside" gap="3" position={{ xl: 'sticky' }} top="76px">
            <FilterCard>
              <SectionEyebrow>Price books</SectionEyebrow>
              <FieldHint>
                Open one price book to inspect regional rows, computed fields, and contract status.
              </FieldHint>
              <Stack gap="2">
                {vm.priceBooks.map((book) => (
                  <Grid
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="3"
                    key={book.id}
                    p="3"
                    templateColumns="minmax(0, 1fr) auto"
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {book.title}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {book.rowCount} rows · effective {book.effectiveFrom}
                      </Text>
                    </Stack>
                    <Button asChild borderRadius="8px" size="xs" variant="outline">
                      <RouterLink to={book.href}>Open</RouterLink>
                    </Button>
                  </Grid>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Quote draft</SectionEyebrow>
              <FieldHint>
                Select regional rows to prepare the server list that will move into the quote flow.
              </FieldHint>
              <MetricGrid ariaLabel="Quote draft summary" metrics={vm.quoteSummary} />
              <Stack gap="2">
                {vm.selectedRows.length === 0 ? (
                  <Text color="ink.500" fontSize="sm">
                    No rows selected yet.
                  </Text>
                ) : null}
                {vm.selectedRows.map((row) => (
                  <Grid
                    alignItems="center"
                    bg="panelGlassBg"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="2"
                    key={row.id}
                    p="3"
                    templateColumns="1fr auto"
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {row.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {row.region.regionLabel} · ${row.billingTermPrice}/mo
                      </Text>
                    </Stack>
                    <Button
                      borderRadius="8px"
                      onClick={() => vm.removeSelectedRow(row.id)}
                      size="xs"
                      variant="ghost"
                    >
                      Remove
                    </Button>
                  </Grid>
                ))}
              </Stack>
              <Box
                asChild
                bg="ctaBg"
                borderRadius="8px"
                color="white"
                fontSize="sm"
                fontWeight="760"
                px="4"
                py="2.5"
                textAlign="center"
              >
                <RouterLink to={vm.quotePath}>Continue to quote</RouterLink>
              </Box>
            </FilterCard>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});
