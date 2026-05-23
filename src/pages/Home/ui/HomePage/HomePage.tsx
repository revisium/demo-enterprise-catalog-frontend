import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import { ProductVisual } from 'src/shared/ui';
import { HomePageViewModel } from '../../model/HomePageViewModel';

export const HomePage = observer(function HomePage() {
  const [vm] = useState(() => new HomePageViewModel());

  return (
    <Container maxW="1240px" px="4" py={{ base: '8', md: '16' }}>
      <Grid
        alignItems="center"
        gap={{ base: '6', lg: '10' }}
        minH={{ base: 'auto', lg: 'calc(100dvh - 86px)' }}
        templateColumns={{ base: '1fr', lg: 'minmax(0, 1.3fr) minmax(300px, 0.7fr)' }}
      >
        <Stack gap="5">
          <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
            Nexora Systems industrial catalog
          </Text>
          <Heading
            as="h1"
            color="ink.900"
            fontSize={{ base: '4xl', md: '6xl', xl: '7xl' }}
            lineHeight="0.98"
          >
            Industrial telemetry products for asset-heavy operations.
          </Heading>
          <Text color="ink.500" fontSize="lg" maxW="720px">
            Nexora Systems sells edge devices, condition-monitoring sensors, SaaS plans, and partner
            APIs for asset-heavy teams. Browse products, compare availability, and plan regional
            rollouts from one industrial catalog.
          </Text>
          <Flex gap="3" wrap="wrap">
            <Button asChild bg="brand.500" borderRadius="control" color="white">
              <Link to="/catalog">Browse catalog</Link>
            </Button>
            <Button asChild borderRadius="control" variant="outline">
              <Link to="/releases">View releases</Link>
            </Button>
          </Flex>
        </Stack>

        <Stack
          aria-label="Catalog status summary"
          bg="panelDarkBg"
          borderColor="blackAlpha.200"
          borderRadius="panel"
          borderWidth="1px"
          boxShadow="panel"
          color="surface.50"
          gap="3"
          p="4"
        >
          <Flex color="whiteAlpha.700" fontSize="sm" justify="space-between">
            <Text>Catalog snapshot</Text>
            <Text as="strong" color="white">
              2026 planning
            </Text>
          </Flex>
          {vm.heroMetrics.map((metric) => (
            <Box
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.200"
              borderRadius="control"
              borderWidth="1px"
              key={metric.label}
              p="3"
            >
              <Text color="surface.50" fontSize="3xl" fontWeight="780">
                {metric.value}
              </Text>
              <Text color="whiteAlpha.700" fontSize="sm">
                {metric.label}
              </Text>
            </Box>
          ))}
          <Stack bg="whiteAlpha.100" borderRadius="control" gap="2" p="3">
            <Text color="whiteAlpha.700" fontSize="xs" fontWeight="700" textTransform="uppercase">
              Company model
            </Text>
            <Text color="white">{vm.companySnapshot.market}</Text>
            <Text color="whiteAlpha.700" fontSize="sm">
              {vm.companySnapshot.customers}
            </Text>
          </Stack>
        </Stack>
      </Grid>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap="4" mt="10">
        {vm.heroProducts.map((product) => (
          <Stack
            bg="white"
            borderRadius="panel"
            borderWidth="1px"
            key={product.id}
            overflow="hidden"
          >
            <ProductVisual
              alt={product.imageAlt}
              radius="0.5rem 0.5rem 0 0"
              tone={product.visualTone}
            />
            <Stack gap="4" p="4">
              <Flex
                align="center"
                color="ink.500"
                fontSize="sm"
                fontWeight="700"
                justify="space-between"
              >
                <Text>{product.family}</Text>
                <Badge bg="surface.200" color="brand.700" borderRadius="full">
                  {product.lifecycle}
                </Badge>
              </Flex>
              <Stack gap="2">
                <Heading as="h2" color="ink.900" fontSize="xl">
                  {product.name}
                </Heading>
                <Text color="ink.500">{product.summary}</Text>
                <Text color="ink.700" fontSize="sm" fontWeight="650">
                  {product.buyerFit}
                </Text>
              </Stack>
              <SimpleGrid columns={2} gap="3">
                {product.previewMetrics.map((metric) => (
                  <Box bg="surface.100" borderRadius="control" key={metric.label} p="3">
                    <Text color="ink.900" fontSize="lg" fontWeight="760">
                      {metric.value}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {metric.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
              <Flex gap="2" wrap="wrap">
                {product.previewProtocols.map((protocol) => (
                  <Badge bg="surface.200" color="brand.700" key={protocol}>
                    {protocol}
                  </Badge>
                ))}
              </Flex>
              <Text color="ink.500" fontSize="sm">
                {product.customerNote}
              </Text>
              <ChakraLink asChild color="brand.500" fontWeight="700">
                <Link to={product.detailHref}>Inspect product</Link>
              </ChakraLink>
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>

      <Grid gap={{ base: '6', lg: '10' }} mt="10" templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        <Stack gap="4">
          <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
            Product updates
          </Text>
          <Heading as="h2" color="ink.900" fontSize={{ base: '2xl', md: '4xl' }}>
            Catalog and price-book changes stay clear for buyers and partners.
          </Heading>
          <Stack gap="3">
            {vm.releases.map((release) => (
              <Stack bg="white" borderRadius="panel" borderWidth="1px" key={release.id} p="4">
                <Text as="strong" color="ink.900">
                  {release.label}
                </Text>
                <Badge alignSelf="start" bg="surface.200" color="brand.700">
                  {release.scope}
                </Badge>
                <Text color="ink.500">{release.summary}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack bg="white" borderRadius="panel" borderWidth="1px" gap="4" p="5">
          <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
            Enablement
          </Text>
          <Heading as="h2" color="ink.900" fontSize={{ base: '2xl', md: '3xl' }}>
            Built for product, service, procurement, and partner teams.
          </Heading>
          <Stack gap="3">
            {vm.enablementItems.map((item) => (
              <Box bg="surface.100" borderRadius="control" key={item} p="3">
                <Text color="ink.700">{item}</Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Grid>
    </Container>
  );
});
