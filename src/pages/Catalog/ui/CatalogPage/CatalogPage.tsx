import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  ChipGroup,
  EmptyState,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  ProductVisual,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { CatalogPageViewModel } from '../../model/CatalogPageViewModel';

export const CatalogPage = observer(function CatalogPage() {
  const [vm] = useState(() => new CatalogPageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Servers"
          metrics={vm.summaryMetrics}
          metricsLabel="Catalog summary"
          summary="Filter server plans by region, stock, price, docs, and hardware."
          title="Server catalog."
        />

        <Grid
          alignItems="start"
          gap={{ base: '5', xl: '6' }}
          mt={{ base: '6', md: '8' }}
          templateColumns={{ base: '1fr', xl: '340px minmax(0, 1fr)' }}
        >
          <StickyPanel aria-label="Catalog filters" as="aside">
            <FilterCard>
              <Stack gap="3">
                <SectionEyebrow>Filters</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="xl">
                  Find a server
                </Heading>
              </Stack>
              <Flex gap="2" wrap="wrap">
                <FilterButton
                  onClick={() => vm.setFilterMode('all')}
                  selected={vm.filterMode === 'all'}
                  tone="neutral"
                >
                  Match all
                </FilterButton>
                <FilterButton
                  onClick={() => vm.setFilterMode('any')}
                  selected={vm.filterMode === 'any'}
                  tone="neutral"
                >
                  Match any
                </FilterButton>
              </Flex>

              <ChipGroup
                label="Families"
                onToggle={(id) => vm.toggleFamily(id)}
                options={vm.families}
                selectedIds={vm.selectedFamilyIds}
              />
              <ChipGroup
                label="Regions"
                onToggle={(id) => vm.toggleRegion(id)}
                options={vm.regions}
                selectedIds={vm.selectedRegionIds}
              />
              <ChipGroup
                label="Capabilities"
                onToggle={(id) => vm.toggleAddon(id)}
                options={vm.addons}
                selectedIds={vm.selectedAddonIds}
              />
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Specs</SectionEyebrow>
              <SelectField
                label="Memory"
                onChange={(value) => vm.setMinRamGb(value)}
                options={vm.ramOptions}
                value={String(vm.minRamGb)}
              />
              <SelectField
                label="Monthly price"
                onChange={(value) => vm.setMaxMonthlyPrice(value)}
                options={vm.priceOptions}
                value={String(vm.maxMonthlyPrice)}
              />
              <SelectField
                label="Sort"
                onChange={(value) => vm.setSort(value)}
                options={vm.sortOptions}
                value={vm.sortId}
              />

              <Flex gap="2" wrap="wrap">
                <FilterButton
                  onClick={() => vm.setStockOnly(!vm.stockOnly)}
                  selected={vm.stockOnly}
                  tone="success"
                >
                  In stock
                </FilterButton>
                <FilterButton
                  onClick={() => vm.setRequireCompliance(!vm.requireCompliance)}
                  selected={vm.requireCompliance}
                  tone="success"
                >
                  Docs
                </FilterButton>
              </Flex>

              <QuerySummary rows={vm.queryRows} />
            </FilterCard>
          </StickyPanel>

          <Stack as="section" aria-label="Catalog products" gap="4">
            <Flex align="end" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Results</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  {vm.filteredProducts.length} server plans
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
                summary="Reset filters or switch to match any."
                title="No server plans match"
              />
            ) : null}
            {vm.filteredProducts.map((product) => (
              <Grid
                alignItems="stretch"
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                boxShadow="panel"
                gap="4"
                key={product.id}
                p={{ base: '4', md: '5' }}
                templateColumns={{ base: '1fr', md: '112px minmax(0, 1fr) minmax(220px, auto)' }}
              >
                <ProductVisual
                  alt={product.imageAlt}
                  minH="32"
                  radius="control"
                  tone={product.visualTone}
                />
                <Stack gap="3">
                  <Flex
                    align="center"
                    color="ink.500"
                    fontSize="sm"
                    fontWeight="700"
                    justify="space-between"
                  >
                    <Text>{product.category}</Text>
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {product.lifecycle}
                    </Badge>
                  </Flex>
                  <Heading as="h3" color="ink.900" fontSize="xl">
                    {product.name}
                  </Heading>
                  <Text color="ink.500" fontSize="sm">
                    {product.summary}
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    {product.protocols.map((protocol) => (
                      <Badge bg="panelSubtleBg" color="ink.700" key={protocol}>
                        {protocol}
                      </Badge>
                    ))}
                  </Flex>
                </Stack>
                <Stack align="start" color="ink.500" fontSize="sm" gap="2" minW="0">
                  <Text>{product.availability}</Text>
                  <Text>
                    {product.hardware.cpuCores} cores · {product.hardware.ramGb} GB RAM ·{' '}
                    {product.hardware.networkGbps} Gbps
                  </Text>
                  <Text>
                    ${product.pricing.monthlyUsd}/mo · {product.totalStock} units
                  </Text>
                  <Button asChild borderRadius="8px" mt="2" variant="outline">
                    <Link to={product.detailHref}>Open</Link>
                  </Button>
                </Stack>
              </Grid>
            ))}
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});
