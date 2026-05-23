import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import { ProductVisual } from 'src/shared/ui';
import { CatalogPageViewModel } from '../../model/CatalogPageViewModel';

export const CatalogPage = observer(function CatalogPage() {
  const [vm] = useState(() => new CatalogPageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          alignItems="end"
          gap={{ base: '4', md: '6' }}
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 360px' }}
        >
          <Stack as="header" gap="3">
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Servers
            </Text>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              Browse cloud and dedicated server plans.
            </Heading>
            <Text color="ink.500" fontSize="md" maxW="720px">
              Compare server plans by availability, region, contract term, documentation, support,
              and commercial readiness.
            </Text>
          </Stack>

          <SimpleGrid aria-label="Catalog summary" columns={{ base: 2, sm: 3 }} gap="2">
            {vm.summaryMetrics.map((metric) => (
              <Box
                bg="panelGlassBg"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                key={metric.label}
                p="3"
              >
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {metric.value}
                </Text>
                <Text color="ink.500" fontSize="xs">
                  {metric.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Grid>

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' }}
        >
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Flex align="center" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="0">
                <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                  Filter logic
                </Text>
                <Heading as="h2" color="ink.900" fontSize="xl">
                  Find matching server plans
                </Heading>
              </Stack>
              <Flex gap="2" wrap="wrap">
                <Button
                  bg={vm.filterMode === 'all' ? 'brand.50' : 'white'}
                  borderColor={vm.filterMode === 'all' ? 'activeBorder' : 'surface.200'}
                  borderRadius="8px"
                  borderWidth="1px"
                  color="ink.900"
                  onClick={() => vm.setFilterMode('all')}
                  size="sm"
                  variant="ghost"
                >
                  Match all
                </Button>
                <Button
                  bg={vm.filterMode === 'any' ? 'brand.50' : 'white'}
                  borderColor={vm.filterMode === 'any' ? 'activeBorder' : 'surface.200'}
                  borderRadius="8px"
                  borderWidth="1px"
                  color="ink.900"
                  onClick={() => vm.setFilterMode('any')}
                  size="sm"
                  variant="ghost"
                >
                  Match any
                </Button>
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
                    <Button
                      bg={selected ? 'brand.50' : 'white'}
                      borderColor={selected ? 'activeBorder' : 'surface.200'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color={selected ? 'brand.500' : 'ink.700'}
                      key={family.id}
                      onClick={() => vm.toggleFamily(family.id)}
                      size="sm"
                      variant="ghost"
                    >
                      {family.label}
                    </Button>
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
                    <Button
                      bg={selected ? 'brand.50' : 'white'}
                      borderColor={selected ? 'activeBorder' : 'surface.200'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color={selected ? 'brand.500' : 'ink.700'}
                      key={region.id}
                      onClick={() => vm.toggleRegion(region.id)}
                      size="sm"
                      variant="ghost"
                    >
                      {region.label}
                    </Button>
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
                    <Button
                      bg={selected ? 'brand.50' : 'white'}
                      borderColor={selected ? 'activeBorder' : 'surface.200'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color={selected ? 'brand.500' : 'ink.700'}
                      key={addon.id}
                      onClick={() => vm.toggleAddon(addon.id)}
                      size="sm"
                      variant="ghost"
                    >
                      {addon.label}
                    </Button>
                  );
                })}
              </Flex>
            </Stack>
          </Stack>

          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Nested fields and sort
            </Text>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Memory
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setMinRamGb(event.currentTarget.value)}
                  p="2.5"
                  value={String(vm.minRamGb)}
                >
                  {vm.ramOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Monthly price
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setMaxMonthlyPrice(event.currentTarget.value)}
                  p="2.5"
                  value={String(vm.maxMonthlyPrice)}
                >
                  {vm.priceOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
            </Grid>

            <Stack as="label" gap="1.5">
              <Text color="ink.700" fontWeight="650">
                Sort
              </Text>
              <chakra.select
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                onChange={(event) => vm.setSort(event.currentTarget.value)}
                p="2.5"
                value={vm.sortId}
              >
                {vm.sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </chakra.select>
            </Stack>

            <Flex gap="2" wrap="wrap">
              <Button
                bg={vm.stockOnly ? 'successBg' : 'white'}
                borderColor={vm.stockOnly ? 'successBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                color="ink.900"
                onClick={() => vm.setStockOnly(!vm.stockOnly)}
                size="sm"
                variant="ghost"
              >
                In stock only
              </Button>
              <Button
                bg={vm.requireCompliance ? 'successBg' : 'white'}
                borderColor={vm.requireCompliance ? 'successBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                color="ink.900"
                onClick={() => vm.setRequireCompliance(!vm.requireCompliance)}
                size="sm"
                variant="ghost"
              >
                Compliance docs
              </Button>
            </Flex>
          </Stack>
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
