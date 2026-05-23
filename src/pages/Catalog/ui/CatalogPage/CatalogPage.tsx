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

        <Flex aria-label="Catalog family filters" gap="2" mb="4" mt="7" wrap="wrap">
          {vm.families.map((family) => (
            <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family} px="3" py="1.5">
              {family}
            </Badge>
          ))}
        </Flex>

        <Stack as="section" aria-label="Catalog products" gap="3">
          {vm.products.map((product) => (
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
                <Text>{product.regionCount} regions</Text>
                <Text>{product.documents.length} documents</Text>
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
