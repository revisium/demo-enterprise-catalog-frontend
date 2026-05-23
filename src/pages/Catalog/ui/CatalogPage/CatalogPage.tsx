import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  FilterButton,
  FilterCard,
  PageIntroGrid,
  ProductVisual,
  SectionEyebrow,
  SelectField,
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
          summary="Compare server plans by availability, region, contract term, documentation, support, and commercial readiness."
          title="Browse cloud and dedicated server plans."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' }}
        >
          <FilterCard>
            <Flex align="center" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="0">
                <SectionEyebrow>Filter logic</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="xl">
                  Find matching server plans
                </Heading>
              </Stack>
              <Flex gap="2" wrap="wrap">
                <FilterButton
                  onClick={() => vm.setFilterMode('all')}
                  selected={vm.filterMode === 'all'}
                >
                  Match all
                </FilterButton>
                <FilterButton
                  onClick={() => vm.setFilterMode('any')}
                  selected={vm.filterMode === 'any'}
                >
                  Match any
                </FilterButton>
              </Flex>
            </Flex>

            <Stack gap="2">
              <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                Plan families
              </Text>
              <Flex gap="2" wrap="wrap">
                {vm.families.map((family) => {
                  const selected = vm.selectedFamilyIds.includes(family.id);

                  return (
                    <FilterButton
                      key={family.id}
                      onClick={() => vm.toggleFamily(family.id)}
                      selected={selected}
                    >
                      {family.label}
                    </FilterButton>
                  );
                })}
              </Flex>
            </Stack>

            <Stack gap="2">
              <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                Regions
              </Text>
              <Flex gap="2" wrap="wrap">
                {vm.regions.map((region) => {
                  const selected = vm.selectedRegionIds.includes(region.id);

                  return (
                    <FilterButton
                      key={region.id}
                      onClick={() => vm.toggleRegion(region.id)}
                      selected={selected}
                    >
                      {region.label}
                    </FilterButton>
                  );
                })}
              </Flex>
            </Stack>

            <Stack gap="2">
              <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                Add-ons and capabilities
              </Text>
              <Flex gap="2" wrap="wrap">
                {vm.addons.map((addon) => {
                  const selected = vm.selectedAddonIds.includes(addon.id);

                  return (
                    <FilterButton
                      key={addon.id}
                      onClick={() => vm.toggleAddon(addon.id)}
                      selected={selected}
                    >
                      {addon.label}
                    </FilterButton>
                  );
                })}
              </Flex>
            </Stack>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Nested fields and sort</SectionEyebrow>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
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
            </Grid>

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
                In stock only
              </FilterButton>
              <FilterButton
                onClick={() => vm.setRequireCompliance(!vm.requireCompliance)}
                selected={vm.requireCompliance}
                tone="success"
              >
                Compliance docs
              </FilterButton>
            </Flex>
          </FilterCard>
        </Grid>

        <Stack as="section" aria-label="Catalog products" gap="3">
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
              p="4"
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
                <Heading as="h2" color="ink.900" fontSize="xl">
                  {product.name}
                </Heading>
                <Text color="ink.500">{product.summary}</Text>
                <Flex gap="2" wrap="wrap">
                  {product.protocols.map((protocol) => (
                    <Badge bg="panelSubtleBg" color="ink.700" key={protocol}>
                      {protocol}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
              <Stack align="start" color="ink.500" fontSize="sm" gap="2">
                <Text>{product.availability}</Text>
                <Text>
                  {product.hardware.cpuCores} cores · {product.hardware.ramGb} GB RAM ·{' '}
                  {product.hardware.networkGbps} Gbps
                </Text>
                <Text>
                  ${product.pricing.monthlyUsd}/mo · {product.totalStock} units · updated{' '}
                  {product.displayUpdatedDate}
                </Text>
                <Button asChild borderRadius="8px" mt="2" variant="outline">
                  <Link to={product.detailHref}>Open</Link>
                </Button>
              </Stack>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
});
