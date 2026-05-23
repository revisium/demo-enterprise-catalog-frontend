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

import { PricingPageViewModel } from '../../model/PricingPageViewModel';

export const PricingPage = observer(function PricingPage() {
  const [vm] = useState(() => new PricingPageViewModel());

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
              Pricing
            </Text>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              Regional price rows by plan, term, and location.
            </Heading>
            <Text color="ink.500" fontSize="md" maxW="720px">
              Filter price-book rows by server family, data-center region, stock, contract term, and
              effective monthly price.
            </Text>
          </Stack>

          <SimpleGrid aria-label="Pricing summary" columns={{ base: 2, sm: 3 }} gap="2">
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

        <Grid gap="3" my={{ base: '5', md: '6' }} templateColumns={{ base: '1fr', xl: '1fr 1fr' }}>
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Filters
            </Text>
            <Flex gap="2" wrap="wrap">
              <Button
                bg={vm.billingTermId === 'monthly' ? 'brand.50' : 'white'}
                borderColor={vm.billingTermId === 'monthly' ? 'activeBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                color="ink.900"
                onClick={() => vm.setBillingTerm('monthly')}
                size="sm"
                variant="ghost"
              >
                Monthly
              </Button>
              <Button
                bg={vm.billingTermId === 'yearly' ? 'brand.50' : 'white'}
                borderColor={vm.billingTermId === 'yearly' ? 'activeBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                color="ink.900"
                onClick={() => vm.setBillingTerm('yearly')}
                size="sm"
                variant="ghost"
              >
                Yearly
              </Button>
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
                In stock
              </Button>
            </Flex>

            <Stack gap="2">
              <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                Families
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
              Price-book view
            </Text>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Max price
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
            </Grid>
          </Stack>
        </Grid>

        <Stack gap="2">
          {vm.filteredRows.map((row) => (
            <Grid
              alignItems="center"
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="3"
              key={`${row.plan.id}-${row.region.regionId}-${vm.billingTermId}`}
              p="3"
              templateColumns={{ base: '1fr', lg: '1fr 150px 150px 120px' }}
            >
              <Stack gap="0">
                <Text color="ink.900" fontWeight="760">
                  {row.plan.name}
                </Text>
                <Text color="ink.500" fontSize="sm">
                  {row.region.regionLabel} · {row.family} · {row.plan.hardware.ramGb} GB RAM
                </Text>
              </Stack>
              <Text color="ink.900" fontWeight="760">
                ${row.billingTermPrice}/mo
              </Text>
              <Text color="ink.500" fontSize="sm">
                Setup ${row.plan.pricing.setupUsd} · {row.region.setupHours}h
              </Text>
              <Badge
                alignSelf="center"
                bg={row.region.stock > 0 ? 'successBg' : 'amberBg'}
                borderRadius="8px"
                color={row.region.stock > 0 ? 'successText' : 'amberText'}
              >
                {row.region.stock} units
              </Badge>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
});
