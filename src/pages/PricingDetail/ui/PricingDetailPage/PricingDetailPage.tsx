import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  ChipGroup,
  PageSectionSurface,
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  ResetButton,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { PricingDetailPageViewModel } from '../../model/PricingDetailPageViewModel';

export const PricingDetailPage = observer(function PricingDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new PricingDetailPageViewModel(params.priceBookId));
  const returnState = createReturnState(location);

  useEffect(() => {
    vm.setPriceBookId(params.priceBookId);
  }, [params.priceBookId, vm]);

  return (
    <PageSectionSurface flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '4', md: '5' }}>
          <BackNavButton fallbackTo="/pricing" />

          <PageIntroGrid
            eyebrow="Price book"
            metrics={vm.metrics}
            metricsLabel="Price book summary"
            summary={vm.book.summary}
            title={vm.book.title}
          />

          <Grid
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
            w="100%"
          >
            <FilterCard gridColumn={{ xl: 'span 2' }}>
              <SectionEyebrow>Price row controls</SectionEyebrow>
              <FieldHint>
                Filter by family, region, stock, and value tier; then sort the active rows.
              </FieldHint>
              <Flex gap="2" wrap="wrap">
                <FilterButton
                  onClick={() => vm.setTerm('monthly')}
                  selected={vm.selectedTermId === 'monthly'}
                  tone="neutral"
                >
                  Monthly
                </FilterButton>
                <FilterButton
                  onClick={() => vm.setTerm('yearly')}
                  selected={vm.selectedTermId === 'yearly'}
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
              <ChipGroup
                label="Families"
                onToggle={(id) => vm.toggleFamily(id)}
                options={vm.familyOptions}
                selectedIds={vm.selectedFamilyIds}
              />
              <ChipGroup
                label="Regions"
                onToggle={(id) => vm.toggleRegion(id)}
                options={vm.regionOptions}
                selectedIds={vm.selectedRegionIds}
              />
              <Grid
                gap="3"
                maxW={{ base: '100%', md: '50%', xl: '100%' }}
                templateColumns="1fr"
                w="100%"
              >
                <SelectField
                  label="Minimum value tier"
                  onChange={(value) => vm.setMinValueTier(value)}
                  options={vm.valueTierOptions}
                  value={String(vm.selectedValueTier)}
                />
                <SelectField
                  label="Sort rows"
                  onChange={(value) => vm.setSort(value)}
                  options={vm.sortOptions}
                  value={vm.sortId}
                />
              </Grid>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Book status</SectionEyebrow>
              <Grid gap="2" templateColumns="1fr 1fr">
                <BookFact label="Status" value={vm.book.status} />
                <BookFact label="Owner" value={vm.book.owner} />
                <BookFact label="Effective" value={vm.book.effectiveFrom} />
                <BookFact label="Updated" value={vm.book.updatedAt} />
              </Grid>
            </FilterCard>
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
              <Stack gap="1" maxW="620px">
                <SectionEyebrow>Rows in this book</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Book regional rows
                </Heading>
                <FieldHint>Rows belong to the selected price book version.</FieldHint>
              </Stack>
              {vm.hasUserFilters ? (
                <ResetButton onClick={() => vm.resetFilters()}>
                  Reset filters
                </ResetButton>
              ) : null}
            </Flex>

            <Stack
              as="section"
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
                  summary="No price rows match the selected family, region, stock, and value-tier filters."
                  title="No rows match this query"
                />
              ) : null}
              {vm.filteredRows.map((row) => (
                <Grid
                  alignItems="center"
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="3"
                  key={row.id}
                  minW={{ base: '760px', md: '0' }}
                  p="3"
                  templateColumns="minmax(0, 1fr) 104px 150px 82px auto"
                  w="100%"
                >
                  <Stack gap="0" minW="0">
                    <Box asChild alignSelf="start" color="ink.900" fontWeight="760">
                      <Link state={returnState} to={row.rowHref}>
                        {row.plan.name}
                      </Link>
                    </Box>
                    <Text
                      color="ink.500"
                      fontSize="sm"
                      lineHeight="1.4"
                      minH="10"
                      overflowWrap="anywhere"
                    >
                      {row.family} · {row.region.regionLabel} · updated {row.updatedAtDisplay}
                    </Text>
                    <Flex gap="1.5" mt="2" wrap="wrap">
                      <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                        {row.plan.hardware.cpuCores} cores
                      </Badge>
                      <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                        {row.plan.hardware.ramGb} GB RAM
                      </Badge>
                    </Flex>
                  </Stack>
                  <Stack gap="0" minW="0">
                    <Text color="ink.900" fontWeight="760">
                      ${row.effectiveMonthlyUsd}/mo
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      save ${row.yearlySavingsUsd}/yr
                    </Text>
                  </Stack>
                  <Stack gap="0" minW="0">
                    <Text color="ink.900" fontWeight="700" overflowWrap="anywhere">
                      {row.region.regionLabel}
                    </Text>
                    <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                      setup {row.region.setupHours}h
                    </Text>
                  </Stack>
                  <Stack align="end" gap="1" minW="0">
                    <Badge
                      bg={row.region.stock > 0 ? 'successBg' : 'amberBg'}
                      borderRadius="8px"
                      color={row.region.stock > 0 ? 'successText' : 'amberText'}
                    >
                      {row.region.stock} units
                    </Badge>
                    <Text color="ink.500" fontSize="xs">
                      {row.valueTier}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {row.pricePerCore === null ? '—' : `$${row.pricePerCore.toFixed(2)}/core`}
                    </Text>
                  </Stack>
                  <Flex gap="2" justify="end" minW="0" wrap="wrap">
                    <Button asChild borderRadius="8px" size="sm" variant="outline">
                      <Link state={returnState} to={row.locationHref}>
                        Region
                      </Link>
                    </Button>
                    <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                      <Link state={returnState} to={row.quoteHref}>
                        Quote
                      </Link>
                    </Button>
                  </Flex>
                </Grid>
              ))}
            </Stack>

            <StickyPanel
              as="aside"
              gridColumn={{ xl: '3' }}
              gridRow={{ xl: '2' }}
              maxH="none"
              minW="0"
              overscrollBehavior="auto"
              overflowY="visible"
              pb="0"
              position={{ xl: 'static' }}
              pr="0"
              w="100%"
            >
              <FilterCard>
                <SectionEyebrow>Other price book versions</SectionEyebrow>
                <FieldHint>Switch to another effective date or draft book.</FieldHint>
                <Stack gap="2">
                  {vm.relatedBooks.map((book) => (
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
                      templateColumns="minmax(0, 1fr) auto"
                      textDecoration="none"
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
                      <Link state={returnState} to={book.href}>
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
                      </Link>
                    </Grid>
                  ))}
                </Stack>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Next step</SectionEyebrow>
                <FieldHint>
                  Move selected server rows into a quote or compare them against the full pricing
                  workspace.
                </FieldHint>
                <Flex gap="2" wrap="wrap">
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <Link state={returnState} to="/pricing">
                      All pricing
                    </Link>
                  </Button>
                  <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                    <Link state={returnState} to="/quote">
                      New quote
                    </Link>
                  </Button>
                </Flex>
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </PageSectionSurface>
  );
});

function BookFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack bg="panelGlassBg" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
      <Text color="ink.900" fontSize="sm" fontWeight="760">
        {value}
      </Text>
    </Stack>
  );
}
