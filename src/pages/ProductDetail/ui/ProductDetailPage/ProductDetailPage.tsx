import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  EmptyState,
  FilterButton,
  FilterCard,
  MetricGrid,
  ProductVisual,
  SelectField,
} from 'src/shared/ui';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

const sectionHeadingProps = {
  color: 'brand.500',
  fontSize: 'xs',
  fontWeight: '800',
  textTransform: 'uppercase',
} as const;

export const ProductDetailPage = observer(function ProductDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new ProductDetailPageViewModel(params.productId));
  const returnState = createReturnState(location);
  const sectionGap = { base: '4', md: '5' } as const;
  const technicalRows = [
    { label: 'Platform', value: vm.product.specs.enclosure },
    { label: 'Security', value: vm.product.specs.ingress },
    { label: 'SLA', value: vm.product.specs.operatingRange },
    { label: 'Network', value: vm.product.specs.connectivity },
  ];

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={sectionGap}>
          <BackNavButton fallbackTo="/catalog" />

          <Grid
            alignItems="stretch"
            gap={sectionGap}
            templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(380px, 460px)' }}
          >
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              justify="space-between"
              p="3"
            >
              <Flex
                align="center"
                color="ink.500"
                fontSize="sm"
                fontWeight="700"
                gap="2"
                wrap="wrap"
              >
                <Text>{vm.product.family}</Text>
                <Badge bg="successBg" borderRadius="8px" color="successText">
                  {vm.product.lifecycle}
                </Badge>
              </Flex>
              <Heading as="h1" color="ink.900" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1">
                {vm.product.name}
              </Heading>
              <Text color="ink.700" fontSize="md" maxW="720px">
                {vm.product.summary}
              </Text>
              <Stack gap="3">
                <Flex gap="2" wrap="wrap">
                  {vm.product.protocols.map((protocol) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={protocol}>
                      {protocol}
                    </Badge>
                  ))}
                </Flex>
                <Stack align="start" gap="2">
                  <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                    <Link state={returnState} to={vm.quotePath}>
                      Request quote
                    </Link>
                  </Button>
                  <Flex gap="2" wrap="wrap">
                    <Button asChild borderRadius="8px" variant="outline">
                      <Link state={returnState} to="/compare">
                        Compare plans
                      </Link>
                    </Button>
                    <Button asChild borderRadius="8px" variant="outline">
                      <Link state={returnState} to="/locations">
                        View regions
                      </Link>
                    </Button>
                  </Flex>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="3"
              h="100%"
              p="3"
            >
              <MetricGrid
                ariaLabel="Product metrics"
                columns={{ base: 2, sm: 2 }}
                metrics={vm.summaryMetrics}
              />
              <Stack
                bg="surface.900"
                borderRadius="8px"
                boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
                color="white"
                gap="2"
                p="3"
              >
                <Text
                  color="darkPanelMutedText"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  Commercial summary
                </Text>
                <Text fontSize="2xl" fontWeight="800" lineHeight="1">
                  ${vm.product.pricing.monthlyUsd}/mo
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {vm.commercialTermLabel}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {vm.product.customerNote}
                </Text>
              </Stack>
            </Stack>
          </Grid>

          <Stack gap={sectionGap}>
            <Grid
              alignItems="stretch"
              gap={sectionGap}
              templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(380px, 460px)' }}
            >
              <Stack gap={sectionGap} h={{ lg: '100%' }} justify={{ lg: 'space-between' }}>
                <FilterCard gap="2">
                  <Heading as="h2" {...sectionHeadingProps}>
                    Availability controls
                  </Heading>
                <Grid gap="4" templateColumns="1fr">
                  <SelectField
                    label="Region sort"
                    labelGap="3"
                    onChange={(value) => vm.setRegionSort(value)}
                    options={vm.regionSortOptions}
                    value={vm.regionSortId}
                  />
                  <SelectField
                    label="Alternative sort"
                    labelGap="3"
                    onChange={(value) => vm.setAlternativeSort(value)}
                    options={vm.alternativeSortOptions}
                    value={vm.alternativeSortId}
                  />
                  </Grid>
                <Flex gap="2" mt="3" wrap="wrap">
                  <FilterButton
                    onClick={() => vm.setInStockRegionsOnly(!vm.inStockRegionsOnly)}
                    selected={vm.inStockRegionsOnly}
                      tone="success"
                    >
                      In-stock regions
                    </FilterButton>
                  </Flex>
                </FilterCard>

                <Stack
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="2"
                  p="3"
                >
                  <Stack gap="2">
                    <Heading as="h3" {...sectionHeadingProps}>
                      Add-ons
                    </Heading>
                    <Flex gap="2" wrap="wrap">
                      {vm.addOnRows.map((addon) => (
                        <Button
                          asChild
                          borderRadius="8px"
                          key={addon.id}
                          size="sm"
                          variant="outline"
                        >
                          <Link state={returnState} to={addon.href}>
                            {addon.label}
                          </Link>
                        </Button>
                      ))}
                    </Flex>
                  </Stack>
                  <Stack gap="2">
                    <Heading as="h3" {...sectionHeadingProps}>
                      Documents
                    </Heading>
                    <Flex gap="3" wrap="wrap">
                      {vm.documentRows.map((document) => (
                        <Button
                          asChild
                          borderRadius="8px"
                          key={document.id}
                          size="sm"
                          variant="outline"
                        >
                          <Link state={returnState} to={document.href}>
                            {document.label}
                          </Link>
                        </Button>
                      ))}
                    </Flex>
                  </Stack>
                  <Flex gap="3" wrap="wrap">
                    <Button asChild borderRadius="8px" size="sm" variant="outline">
                      <Link state={returnState} to="/pricing">
                        Check price rows
                      </Link>
                    </Button>
                  </Flex>
                </Stack>
              </Stack>

              <Stack gap={sectionGap}>
                <SelectionSummaryCard queryRows={vm.queryRows} />

                <TechnicalSpecsCard specRows={technicalRows} />

                <Stack
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="2"
                  p="3"
                >
                  <Heading as="h2" {...sectionHeadingProps}>
                    Plan package
                  </Heading>
                  <Stack gap="1">
                    {vm.packageRows.map((row) => (
                      <Grid
                        gap="3"
                        key={row.label}
                        templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
                      >
                        <Text color="ink.500" fontSize="sm">
                          {row.label}
                        </Text>
                        <Text color="ink.900" fontSize="sm" fontWeight="700" textAlign="left">
                          {row.value}
                        </Text>
                      </Grid>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Stack>

          <Stack gap={sectionGap}>
            <Stack
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="3"
              overflowX={{ base: 'auto', md: 'visible' }}
              p="3"
              pb={{ base: '1', md: '3' }}
            >
              <Heading as="h2" {...sectionHeadingProps}>
                Regional availability
              </Heading>
              {vm.hasNoRegionMatches ? (
                <EmptyState
                  actionLabel="Show all regions"
                  onAction={() => vm.setInStockRegionsOnly(false)}
                  summary="This plan has no in-stock regions under the current availability view."
                  title="No in-stock regions"
                />
              ) : null}
              {vm.visibleRegionRows.map((region) => (
                <Grid
                  alignItems="center"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  columnGap={{ base: '3', md: '6' }}
                  gap="3"
                  key={region.regionId}
                  minW={{ base: '620px', md: '0' }}
                  p="3"
                  templateColumns="minmax(0, 1fr) auto auto auto"
                  w="100%"
                >
                  <Stack gap="1">
                    <Box asChild alignSelf="start" color="ink.900" fontWeight="780">
                      <Link state={returnState} to={region.locationHref}>
                        {region.regionLabel}
                      </Link>
                    </Box>
                    <Text color="ink.500" fontSize="sm">
                      {region.dataCenterCode} · {region.supportWindow}
                    </Text>
                  </Stack>
                  <Text color="ink.900" fontWeight="700">
                    {region.stock} units
                  </Text>
                  <Text color="ink.500" fontSize="sm">
                    setup {region.setupHours}h
                  </Text>
                  <Stack align={{ base: 'start', md: 'end' }} gap="2">
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {region.readinessScore} readiness
                    </Badge>
                    <Button asChild borderRadius="8px" size="xs" variant="outline">
                      <Link state={returnState} to={region.quoteHref}>
                        Quote here
                      </Link>
                    </Button>
                  </Stack>
                </Grid>
              ))}
            </Stack>
          </Stack>

          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="3"
          >
            <Flex align="center" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <Heading as="h2" {...sectionHeadingProps}>
                  Alternative plans
                </Heading>
                <Text color="ink.500" fontSize="sm">
                  Similar capacity in matching regions
                </Text>
              </Stack>
              <Button asChild borderRadius="8px" size="sm" variant="outline">
                <Link state={returnState} to="/catalog">
                  Browse catalog
                </Link>
              </Button>
            </Flex>
            <Grid
              gap="3"
              overflowX={{ base: 'auto', md: 'visible' }}
              pb={{ base: '1', md: '0' }}
              templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}
            >
              {vm.alternativeRows.map((row) => (
                <Grid
                  alignItems="stretch"
                  bg="panelGlassBg"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="3"
                  key={row.plan.id}
                  minW={{ base: '560px', md: '0' }}
                  p="3"
                  templateColumns="88px minmax(0, 1fr) auto"
                >
                  <ProductVisual
                    alt={row.plan.imageAlt}
                    minH="24"
                    radius="control"
                    tone={row.plan.visualTone}
                  />
                  <Stack gap="2">
                    <Stack gap="0">
                      <Text color="ink.900" fontWeight="780">
                        {row.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {row.plan.family} · {row.overlapRegionCount} matching regions · updated{' '}
                        {row.displayUpdatedDate}
                      </Text>
                    </Stack>
                    <Flex gap="2" wrap="wrap">
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        ${row.plan.pricing.monthlyUsd}/mo
                      </Badge>
                      <Badge bg="successBg" borderRadius="8px" color="successText">
                        {row.priceEfficiencyScore} efficiency
                      </Badge>
                    </Flex>
                  </Stack>
                  <Stack align="stretch" gap="2">
                    <Button
                      alignSelf="start"
                      asChild
                      borderRadius="8px"
                      size="sm"
                      variant="outline"
                    >
                      <Link state={returnState} to={row.detailHref}>
                        Open
                      </Link>
                    </Button>
                    <Button
                      alignSelf="start"
                      asChild
                      borderRadius="8px"
                      size="sm"
                      variant="outline"
                    >
                      <Link state={returnState} to={row.quoteHref}>
                        Quote
                      </Link>
                    </Button>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
});

interface KeyValueRow {
  readonly label: string;
  readonly value: string;
}

interface SelectionAndSpecsCardProps {
  readonly queryRows: readonly KeyValueRow[];
  readonly specRows: readonly KeyValueRow[];
}

function SelectionSummaryCard({ queryRows }: Pick<SelectionAndSpecsCardProps, 'queryRows'>) {
  return (
    <Stack bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" gap="2" p="3">
      <Heading as="h2" {...sectionHeadingProps}>
        Query summary
      </Heading>
      <Stack as="dl" gap="1">
        {queryRows.map((row) => (
          <Grid
            as="div"
            gap="3"
            key={`query-${row.label}`}
            templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
          >
            <Text as="dt" color="ink.500" fontSize="sm">
              {row.label}
            </Text>
            <Text as="dd" color="ink.900" fontSize="sm" fontWeight="700" m="0" textAlign="left">
              {row.value}
            </Text>
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
}

function TechnicalSpecsCard({ specRows }: Pick<SelectionAndSpecsCardProps, 'specRows'>) {
  return (
    <Stack bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" gap="2" p="3">
      <Heading as="h2" {...sectionHeadingProps}>
        Technical specs
      </Heading>
      <Stack as="dl" gap="1">
        {specRows.map((row) => (
          <Grid
            as="div"
            gap="3"
            key={`spec-${row.label}`}
            templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
          >
            <Text as="dt" color="ink.500" fontSize="sm">
              {row.label}
            </Text>
            <Text as="dd" color="ink.900" fontSize="sm" fontWeight="700" m="0" textAlign="left">
              {row.value}
            </Text>
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
}
