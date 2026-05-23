import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router';

import { MetricGrid, ProductVisual, SectionEyebrow } from 'src/shared/ui';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const params = useParams();
  const vm = useMemo(() => new ProductDetailPageViewModel(params.productId), [params.productId]);
  const { product } = vm;

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
              <Text>{product.family}</Text>
              <Badge bg="successBg" borderRadius="8px" color="successText">
                {product.lifecycle}
              </Badge>
            </Flex>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              {product.name}
            </Heading>
            <Text color="ink.700" fontSize="md" maxW="720px">
              {product.summary}
            </Text>
            <Flex gap="2" wrap="wrap">
              {product.protocols.map((protocol) => (
                <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={protocol}>
                  {protocol}
                </Badge>
              ))}
            </Flex>
            <Flex gap="2" wrap="wrap">
              <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                <Link to={`/quote?plan=${product.id}`}>Request quote</Link>
              </Button>
              <Button asChild borderRadius="8px" variant="outline">
                <Link to="/compare">Compare plans</Link>
              </Button>
            </Flex>
          </Stack>
          <ProductVisual
            alt={product.imageAlt}
            minH="320px"
            radius="8px"
            tone={product.visualTone}
          />
        </Grid>

        <Box bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" mt="5" p="4">
          <MetricGrid ariaLabel="Product metrics" metrics={vm.summaryMetrics} />
        </Box>

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
                {product.specs.enclosure}
              </Text>
              <Text as="dt" color="ink.500">
                Security
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {product.specs.ingress}
              </Text>
              <Text as="dt" color="ink.500">
                SLA
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {product.specs.operatingRange}
              </Text>
              <Text as="dt" color="ink.500">
                Network
              </Text>
              <Text as="dd" color="ink.900" m="0">
                {product.specs.connectivity}
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
              {product.documents.map((document) => (
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
            {product.availabilityByRegion.map((region) => (
              <Grid
                alignItems="center"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={region.regionId}
                p="3"
                templateColumns={{ base: '1fr', md: '1fr 90px 110px' }}
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
              ${product.pricing.monthlyUsd}/mo
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              ${product.pricing.yearlyMonthlyUsd}/mo on yearly term · ${product.pricing.setupUsd}{' '}
              setup fee.
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              {product.customerNote}
            </Text>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});
