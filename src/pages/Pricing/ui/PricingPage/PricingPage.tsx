import { Badge, Box, Container, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import {
  FilterButton,
  FilterCard,
  PageIntroGrid,
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
          summary="Filter price-book rows by server family, data-center region, stock, contract term, and effective monthly price."
          title="Regional price rows by plan, term, and location."
        />

        <Grid gap="3" my={{ base: '5', md: '6' }} templateColumns={{ base: '1fr', xl: '1fr 1fr' }}>
          <FilterCard>
            <SectionEyebrow>Filters</SectionEyebrow>
            <Flex gap="2" wrap="wrap">
              <FilterButton
                onClick={() => vm.setBillingTerm('monthly')}
                selected={vm.billingTermId === 'monthly'}
              >
                Monthly
              </FilterButton>
              <FilterButton
                onClick={() => vm.setBillingTerm('yearly')}
                selected={vm.billingTermId === 'yearly'}
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

            <Stack gap="2">
              <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
                Families
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
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Price-book view</SectionEyebrow>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <SelectField
                label="Max price"
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
            </Grid>
          </FilterCard>
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
