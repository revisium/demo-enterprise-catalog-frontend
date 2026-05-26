import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  ChipGroup,
  EmptyState,
  FilterButton,
  FilterCard,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { CatalogPageViewModel } from '../../model/CatalogPageViewModel';

export const CatalogPage = observer(function CatalogPage() {
  const [vm] = useState(() => new CatalogPageViewModel());

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack as="header" gap={{ base: '3', md: '4' }} maxW="820px" pb={{ base: '2', md: '3' }}>
          <SectionEyebrow>Servers</SectionEyebrow>
          <Heading
            as="h1"
            color="ink.900"
            fontSize={{ base: '4xl', md: '6xl' }}
            lineHeight="0.98"
          >
            Server catalog.
          </Heading>
          <Text color="ink.600" fontSize={{ base: 'sm', md: 'md' }} maxW="620px">
            Filter server plans by region, stock, price, docs, and hardware.
          </Text>
        </Stack>

        <Grid
          alignItems="start"
          gap={{ base: '5', xl: '6' }}
          mt={{ base: '3', md: '4' }}
          templateColumns={{ base: '1fr', lg: '390px minmax(0, 1fr)' }}
        >
          <Stack alignSelf="start" aria-label="Catalog filters" as="aside" gap="3">
            <FilterCard p="3">
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

            <FilterCard p="3">
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
          </Stack>

          <Stack as="section" aria-label="Catalog products" gap="4">
            <Flex align="end" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Results</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Server plans
                </Heading>
                <Flex color="ink.500" fontSize="sm" gap="2" wrap="wrap">
                  <Text as="span">Matches</Text>
                  <Text as="span">{vm.filteredProducts.length}</Text>
                  {vm.hasNoMatches ? null : (
                    <>
                      <Text as="span">Stock</Text>
                      <Text as="span">{vm.filteredTotalStock}</Text>
                      <Text as="span">units</Text>
                    </>
                  )}
                  {vm.hasUserFilters ? (
                    <>
                      <Text as="span">Active filters</Text>
                      <Text as="span">{vm.activeFilterCount}</Text>
                    </>
                  ) : null}
                </Flex>
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
                p="3"
                templateColumns={{
                  base: '1fr',
                  md: 'minmax(355px, 1fr) minmax(0, 1fr)',
                }}
              >
                <Stack gap="3">
                  <Flex
                    align="center"
                    color="ink.500"
                    fontSize="sm"
                    fontWeight="700"
                    gap="2"
                    minW="0"
                    wrap="wrap"
                  >
                    <Text>{product.category}</Text>
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {product.lifecycle}
                    </Badge>
                  </Flex>
                  <Heading as="h3" color="ink.900" fontSize="xl">
                    {product.name}
                  </Heading>
                  <Text color="ink.500" fontSize="sm" minH={{ md: '12' }}>
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
                <Stack align="start" color="ink.500" fontSize="sm" gap="2" h="100%" minW="0">
                  <Text minH={{ md: '10' }}>{product.availability}</Text>
                  <Text>
                    {product.hardware.cpuCores} cores · {product.hardware.ramGb} GB RAM ·{' '}
                    {product.hardware.networkGbps} Gbps
                  </Text>
                  <Text>
                    ${product.pricing.monthlyUsd}/mo · {product.totalStock} units
                  </Text>
                  <Button asChild alignSelf="end" borderRadius="8px" mt="auto" variant="outline">
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
