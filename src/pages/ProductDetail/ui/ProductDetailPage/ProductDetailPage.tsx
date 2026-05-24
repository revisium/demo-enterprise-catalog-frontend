import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useParams } from 'react-router';

import {
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  MetricGrid,
  ProductVisual,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const params = useParams();
  const [vm] = useState(() => new ProductDetailPageViewModel(params.productId));

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          alignItems="stretch"
          bg="recommendationBg"
          borderColor="panelBorderStrong"
          borderRadius="8px"
          borderWidth="1px"
          boxShadow="0 28px 90px rgba(16, 24, 40, 0.1)"
          gap={{ base: '5', lg: '8' }}
          p={{ base: '4', md: '5' }}
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1.25fr) minmax(300px, 0.75fr)' }}
        >
          <Stack gap="4">
            <Flex align="center" color="ink.500" fontSize="sm" fontWeight="700" gap="2" wrap="wrap">
              <Text>{vm.product.family}</Text>
              <Badge bg="successBg" borderRadius="8px" color="successText">
                {vm.product.lifecycle}
              </Badge>
            </Flex>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              {vm.product.name}
            </Heading>
            <Text color="ink.700" fontSize="md" maxW="720px">
              {vm.product.summary}
            </Text>
            <Flex gap="2" wrap="wrap">
              {vm.product.protocols.map((protocol) => (
                <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={protocol}>
                  {protocol}
                </Badge>
              ))}
            </Flex>
            <Flex gap="2" wrap="wrap">
              <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                <Link to={vm.quotePath}>Request quote</Link>
              </Button>
              <Button asChild borderRadius="8px" variant="outline">
                <Link to="/compare">Compare plans</Link>
              </Button>
              <Button asChild borderRadius="8px" variant="outline">
                <Link to="/locations">View regions</Link>
              </Button>
            </Flex>
          </Stack>
          <ProductVisual
            alt={vm.product.imageAlt}
            minH="320px"
            radius="8px"
            tone={vm.product.visualTone}
          />
        </Grid>

        <Box bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" mt="5" p="4">
          <MetricGrid ariaLabel="Product metrics" metrics={vm.summaryMetrics} />
        </Box>

        <Grid
          gap="3"
          mt={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1.05fr) minmax(320px, 0.95fr)' }}
        >
          <FilterCard>
            <SectionEyebrow>Availability controls</SectionEyebrow>
            <FieldHint>
              Compare this plan across regions, setup windows, and stock levels before opening a
              quote.
            </FieldHint>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <SelectField
                label="Region sort"
                onChange={(value) => vm.setRegionSort(value)}
                options={vm.regionSortOptions}
                value={vm.regionSortId}
              />
              <SelectField
                label="Alternative sort"
                onChange={(value) => vm.setAlternativeSort(value)}
                options={vm.alternativeSortOptions}
                value={vm.alternativeSortId}
              />
            </Grid>
            <Flex gap="2" wrap="wrap">
              <FilterButton
                onClick={() => vm.setInStockRegionsOnly(!vm.inStockRegionsOnly)}
                selected={vm.inStockRegionsOnly}
                tone="success"
              >
                In-stock regions
              </FilterButton>
            </Flex>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Plan summary</SectionEyebrow>
            <QuerySummary rows={vm.queryRows} />
          </FilterCard>
        </Grid>

        <Grid
          gap={{ base: '5', lg: '6' }}
          mt={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        >
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Heading as="h2" color="ink.900" fontSize="2xl">
              Technical specs
            </Heading>
            <Grid as="dl" gap="2" templateColumns={{ base: '1fr', md: '150px minmax(0, 1fr)' }}>
              <Text as="dt" color="ink.500">
                Platform
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {vm.product.specs.enclosure}
              </Text>
              <Text as="dt" color="ink.500">
                Security
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {vm.product.specs.ingress}
              </Text>
              <Text as="dt" color="ink.500">
                SLA
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {vm.product.specs.operatingRange}
              </Text>
              <Text as="dt" color="ink.500">
                Network
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {vm.product.specs.connectivity}
              </Text>
            </Grid>
          </Stack>
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Heading as="h2" color="ink.900" fontSize="2xl">
              Documents
            </Heading>
            <Flex gap="3" wrap="wrap">
              {vm.product.documents.map((document) => (
                <Badge
                  bg="brand.50"
                  borderColor="brandBorderMuted"
                  borderRadius="8px"
                  borderWidth="1px"
                  color="brand.500"
                  key={document}
                  px="3"
                  py="2"
                >
                  {document}
                </Badge>
              ))}
            </Flex>
          </Stack>
        </Grid>

        <Grid
          gap={{ base: '5', lg: '6' }}
          mt={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }}
        >
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="4"
          >
            <SectionEyebrow>Regional availability</SectionEyebrow>
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
                gap="3"
                key={region.regionId}
                p="3"
                templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 90px 110px 120px' }}
              >
                <Stack gap="1">
                  <Text color="ink.900" fontWeight="780">
                    {region.regionLabel}
                  </Text>
                  <Text color="ink.500" fontSize="sm">
                    {region.dataCenterCode} · {region.supportWindow}
                  </Text>
                </Stack>
                <Text color="ink.900" fontWeight="760">
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
                    <Link to={region.locationHref}>Open region</Link>
                  </Button>
                </Stack>
              </Grid>
            ))}
          </Stack>
          <Stack
            bg="surface.900"
            borderRadius="8px"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
            color="white"
            gap="3"
            p="4"
          >
            <Text
              color="darkPanelMutedText"
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
            >
              Commercial summary
            </Text>
            <Text fontSize="3xl" fontWeight="800" lineHeight="1">
              ${vm.product.pricing.monthlyUsd}/mo
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              {vm.commercialTermLabel}
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              {vm.product.customerNote}
            </Text>
          </Stack>
        </Grid>

        <Stack
          bg="white"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="3"
          mt={{ base: '5', md: '6' }}
          p="4"
        >
          <Flex align="center" justify="space-between" gap="3" wrap="wrap">
            <Stack gap="1">
              <SectionEyebrow>Alternative plans</SectionEyebrow>
              <Heading as="h2" color="ink.900" fontSize="2xl">
                Similar capacity in matching regions
              </Heading>
            </Stack>
            <Button asChild borderRadius="8px" size="sm" variant="outline">
              <Link to="/catalog">Browse catalog</Link>
            </Button>
          </Flex>
          <Grid gap="3" templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}>
            {vm.alternativeRows.map((row) => (
              <Grid
                alignItems="stretch"
                bg="panelGlassBg"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={row.plan.id}
                p="3"
                templateColumns={{ base: '1fr', md: '88px minmax(0, 1fr) auto' }}
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
                    <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                      {row.totalStock} units
                    </Badge>
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {row.priceEfficiencyScore} efficiency
                    </Badge>
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                      {row.priceDeltaLabel}
                    </Badge>
                  </Flex>
                </Stack>
                <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
                  <Link to={row.detailHref}>Open</Link>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});
