import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router';

import { pricingIntroImage } from 'src/shared/assets';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  PageSectionSurface,
  PageIntroGrid,
  ResetButton,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { PricingPageViewModel } from '../../model/PricingPageViewModel';

export const PricingPage = observer(function PricingPage() {
  const [vm] = useState(() => new PricingPageViewModel());
  const location = useLocation();
  const returnState = createReturnState(location);

  return (
    <PageSectionSurface tone="pricing" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Pricing"
          image={{ src: pricingIntroImage }}
          metrics={vm.summaryMetrics}
          metricsLabel="Pricing summary"
          summary="Active rows price one server plan in one region; price books are versioned commercial sources."
          title="Pricing workspace"
        />

        <Grid
          gap={{ base: '4', md: '5' }}
          my={{ base: '6', md: '8' }}
          alignItems={{ base: 'start', lg: 'stretch' }}
          templateColumns={{
            base: '1fr',
            lg: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          }}
        >
          <FilterCard>
            <SectionEyebrow>Commercial view</SectionEyebrow>
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
            <Box maxW={{ base: '100%', md: '50%', lg: '100%', xl: '100%' }} w="100%">
              <SelectField
                label="Add-on matching"
                onChange={(value) => vm.setAddonMatchMode(value)}
                options={vm.addOnMatchOptions}
                value={vm.addonMatchMode}
              />
            </Box>
            <ChipGroup
              label="Add-ons"
              onToggle={(id) => vm.toggleAddon(id)}
              options={vm.addons}
              selectedIds={vm.selectedAddonIds}
            />
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Server filters</SectionEyebrow>
            <ChipGroup
              label="Families"
              onToggle={(id) => vm.toggleFamily(id)}
              options={vm.families}
              selectedIds={vm.selectedFamilyIds}
            />
            <Box maxW={{ base: '100%', md: '50%', lg: '100%', xl: '100%' }} w="100%">
              <SelectField
                label="Minimum memory"
                onChange={(value) => vm.setMinRamGb(value)}
                options={vm.minRamOptions}
                value={String(vm.minRamGb)}
              />
            </Box>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Regional price rows</SectionEyebrow>
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
            <Grid
              gap="3"
              maxW={{ base: '100%', md: '50%', lg: '100%', xl: '100%' }}
              templateColumns="1fr"
              w="100%"
            >
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
          </FilterCard>
          <Box
            display="flex"
            h={{ base: 'auto', lg: '100%' }}
            alignSelf="stretch"
            gridColumn={{ base: 'auto', lg: '2', xl: '1 / span 3' }}
          >
            <FilterCard h="100%" w="100%">
              <SectionEyebrow>Query summary</SectionEyebrow>
              <Grid
                gap={{ base: '2', xl: '8' }}
                templateColumns={{ base: '1fr', xl: 'repeat(2, 1fr)' }}
              >
                <Stack gap="2">
                  {vm.firstSummaryColumn.map((row) => (
                    <Grid key={row.label} templateColumns="minmax(0, 1fr) auto" gap="3">
                      <Text color="ink.500" fontSize="sm">
                        {row.label}
                      </Text>
                      <Text color="ink.900" fontSize="sm" fontWeight="760" textAlign="right">
                        {row.value}
                      </Text>
                    </Grid>
                  ))}
                </Stack>
                <Stack gap="2">
                  {vm.secondSummaryColumn.map((row) => (
                    <Grid key={row.label} templateColumns="minmax(0, 1fr) auto" gap="3">
                      <Text color="ink.500" fontSize="sm">
                        {row.label}
                      </Text>
                      <Text color="ink.900" fontSize="sm" fontWeight="760" textAlign="right">
                        {row.value}
                      </Text>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
            </FilterCard>
          </Box>
        </Grid>

        <Grid
          alignItems="start"
          gap={{ base: '4', md: '5' }}
          minW="0"
          overflowX="hidden"
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          w="100%"
        >
          <Flex
            align="end"
            gap="3"
            gridColumn={{ xl: 'span 2' }}
            justify="space-between"
            minW="0"
            wrap="wrap"
          >
            <Stack gap="1">
              <SectionEyebrow>Active regional price rows</SectionEyebrow>
              <Heading as="h2" color="ink.900" fontSize="2xl">
                Plan-region prices
              </Heading>
              <FieldHint>
                One row is one server plan in one region for the selected billing term.
              </FieldHint>
              <Flex align="center" gap="2" wrap="wrap">
                <Badge bg="brand.50" borderRadius="8px" color="brand.700">
                  Active book
                </Badge>
                <Text color="ink.500" fontSize="sm">
                  {vm.activePriceBook.title}
                </Text>
              </Flex>
            </Stack>
            {vm.hasUserFilters ? (
              <ResetButton onClick={() => vm.resetFilters()}>
                Reset filters
              </ResetButton>
            ) : null}
          </Flex>

          <Stack
            gap="4"
            gridColumn={{ xl: 'span 2' }}
            gridRow={{ xl: '2' }}
            minW="0"
            overflowX={{ base: 'auto', md: 'visible' }}
            pb={{ base: '1', md: '0' }}
            w="100%"
          >
            {vm.hasNoMatches ? (
              <EmptyState
                actionLabel="Reset filters"
                onAction={() => vm.resetFilters()}
                summary="There are no price rows for this combination. Reset filters to return to the full regional price list."
                title="No price rows match these filters"
              />
            ) : null}
            {vm.filteredRows.length > 0 ? (
              <Stack borderColor="surface.200" borderRadius="8px" borderWidth="1px" gap="0" w="100%">
                <Grid
                  bg="surface.50"
                  borderBottomColor="surface.200"
                  borderBottomWidth="1px"
                  gap="3"
                  minW={{ base: '720px', md: '0' }}
                  p="2.5"
                  templateColumns="28px minmax(0, 1fr) 104px 120px 88px 96px auto"
                  w="100%"
                >
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    #
                  </Text>
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    Plan
                  </Text>
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    Price
                  </Text>
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    Region
                  </Text>
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    Stock
                  </Text>
                  <Text color="ink.500" fontSize="xs" fontWeight="760">
                    Actions
                  </Text>
                </Grid>
                {vm.filteredRows.map((row, index) => {
                  const selected = vm.isRowSelected(row.id);
                  let rowBg: 'brand.50' | 'white' | 'panelGlassBg' = 'panelGlassBg';

                  if (selected) {
                    rowBg = 'brand.50';
                  } else if (index % 2 === 0) {
                    rowBg = 'white';
                  }

                  return (
                    <Grid
                      alignItems="center"
                      bg={rowBg}
                      borderBottomColor="surface.200"
                      borderBottomWidth="1px"
                      gap="3"
                      key={`${row.id}-${vm.billingTermId}`}
                      minW={{ base: '720px', md: '0' }}
                      p="3"
                      templateColumns="28px minmax(0, 1fr) 104px 120px 88px 96px auto"
                      transition="background 0.18s ease, border-color 0.18s ease"
                      w="100%"
                    >
                      <Text color="ink.500" fontSize="sm">
                        {index + 1}
                      </Text>
                      <Stack gap="0" minW="0">
                        <Box asChild alignSelf="start" color="ink.900" fontWeight="760">
                          <RouterLink state={returnState} to={row.detailHref}>
                            {row.plan.name}
                          </RouterLink>
                        </Box>
                        <Text
                          color="ink.500"
                          fontSize="sm"
                          lineHeight="1.4"
                          minH="10"
                          overflowWrap="anywhere"
                        >
                          {row.family} · {row.plan.hardware.cpuCores} vCPU · {row.plan.hardware.ramGb} GB RAM
                        </Text>
                        <Flex gap="1.5" mt="2" wrap="wrap">
                          {row.plan.addons.slice(0, 2).map((addon) => (
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
                      <Stack gap="0" minW="0">
                        <Text color="ink.900" fontWeight="760">
                          ${row.billingTermPrice}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          +{row.region.setupHours}h setup
                        </Text>
                      </Stack>
                      <Stack gap="0" minW="0">
                        <Text color="ink.900" fontWeight="700" overflowWrap="anywhere">
                          {row.region.regionLabel}
                        </Text>
                        <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                          {row.region.supportWindow}
                        </Text>
                      </Stack>
                      <Stack align="start" gap="1" minW="0">
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
                      <Box>
                        <Button
                          aria-pressed={selected}
                          borderRadius="8px"
                          onClick={() => vm.toggleRow(row.id)}
                          size="sm"
                          variant={selected ? 'solid' : 'outline'}
                        >
                          {selected ? 'Selected' : 'Select'}
                        </Button>
                      </Box>
                    </Grid>
                  );
                })}
              </Stack>
            ) : null}
          </Stack>

          <StickyPanel
            as="aside"
            overscrollBehavior="auto"
            overflowY="visible"
            position={{ xl: 'static' }}
            gridColumn={{ xl: '3' }}
            gridRow={{ xl: '2' }}
            maxH="none"
            minW="0"
            pb="0"
            pr="0"
            w="100%"
          >
            <FilterCard>
              <SectionEyebrow>Price book versions</SectionEyebrow>
              <FieldHint>Versioned commercial sources for active and upcoming terms.</FieldHint>
              <Stack gap="2">
                {vm.priceBooks.map((book) => (
                  <Grid
                    asChild
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    color="inherit"
                    cursor="pointer"
                    gap="3"
                    key={book.id}
                    minW="0"
                    p="3"
                    textDecoration="none"
                    templateColumns="minmax(0, 1fr)"
                    transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
                    _focusVisible={{
                      boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
                      outline: 'none',
                    }}
                    _hover={{
                      borderColor: 'activeBorder',
                      boxShadow: '0 12px 30px rgba(16, 24, 40, 0.1)',
                      transform: 'translateY(-1px)',
                    }}
                  >
                    <RouterLink state={returnState} to={book.href}>
                      <Stack gap="2" minW="0">
                        <Flex align="start" gap="2" justify="space-between" minW="0">
                          <Text
                            color="ink.900"
                            fontSize="sm"
                            fontWeight="760"
                            overflowWrap="anywhere"
                          >
                            {book.title}
                          </Text>
                          <Badge
                            bg={book.status === 'Active' ? 'successBg' : 'panelGlassBg'}
                            borderRadius="8px"
                            color={book.status === 'Active' ? 'successText' : 'ink.700'}
                            flexShrink="0"
                          >
                            {book.status}
                          </Badge>
                        </Flex>
                        <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                          {book.summary}
                        </Text>
                        <Flex align="center" color="ink.500" fontSize="xs" gap="2" wrap="wrap">
                          <Badge bg="brand.50" borderRadius="8px" color="brand.700">
                            Source book
                          </Badge>
                          <Text>Applies from</Text>
                          <Text color="ink.900" fontWeight="700">
                            {book.effectiveFrom}
                          </Text>
                        </Flex>
                      </Stack>
                    </RouterLink>
                  </Grid>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Quote draft</SectionEyebrow>
              <FieldHint>
                Select regional rows to prepare the server list that will move into the quote flow.
              </FieldHint>
              <Stack gap="2">
                {vm.quoteSummary.map((row) => (
                  <Grid key={row.label} templateColumns="minmax(0, 1fr) auto" gap="3">
                    <Text color="ink.500" fontSize="sm">
                      {row.label}
                    </Text>
                    <Text color="ink.900" fontSize="sm" fontWeight="760" textAlign="right">
                      {row.value}
                    </Text>
                  </Grid>
                ))}
              </Stack>
              <Stack gap="2">
                {vm.selectedRows.length === 0 ? (
                  <Text color="ink.500" fontSize="sm">
                    No rows selected yet.
                  </Text>
                ) : null}
                {vm.selectedRows.map((row) => (
                  <Grid
                    alignItems="center"
                    gap="2"
                    key={row.id}
                    minW="0"
                    templateColumns="minmax(0, 1fr) auto"
                  >
                    <Stack gap="0" minW="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760" overflowWrap="anywhere">
                        {row.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
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
                <RouterLink state={returnState} to={vm.quotePath}>
                  Continue to quote
                </RouterLink>
              </Box>
            </FilterCard>
          </StickyPanel>
        </Grid>
      </Container>
    </PageSectionSurface>
  );
});
