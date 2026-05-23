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
    <Container maxW="1240px" px="4" py={{ base: '8', md: '16' }}>
      <Stack as="header" gap="4">
        <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
          Catalog
        </Text>
        <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1">
          Browse product families with contract-shaped mock data.
        </Heading>
        <Text color="ink.500" fontSize="lg" maxW="720px">
          Dense rows show the fields that need to survive into Revisium schemas: availability,
          lifecycle, documents, protocols, and pricing signals.
        </Text>
      </Stack>

      <SimpleGrid aria-label="Catalog summary" columns={{ base: 1, md: 3 }} gap="3" my="7">
        {vm.summaryMetrics.map((metric) => (
          <Box bg="surface.100" borderRadius="control" key={metric.label} p="4">
            <Text color="ink.900" fontSize="2xl" fontWeight="780">
              {metric.value}
            </Text>
            <Text color="ink.500" fontSize="sm">
              {metric.label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Flex aria-label="Catalog family filters" gap="2" mb="5" wrap="wrap">
        {vm.families.map((family) => (
          <Badge
            bg="surface.200"
            borderRadius="full"
            color="brand.700"
            key={family}
            px="3"
            py="1.5"
          >
            {family}
          </Badge>
        ))}
      </Flex>

      <Stack as="section" aria-label="Catalog products" gap="3">
        {vm.products.map((product) => (
          <Grid
            alignItems="stretch"
            bg="white"
            borderRadius="panel"
            borderWidth="1px"
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
                <Badge bg="surface.200" borderRadius="full" color="brand.700">
                  {product.lifecycle}
                </Badge>
              </Flex>
              <Heading as="h2" color="ink.900" fontSize="xl">
                {product.name}
              </Heading>
              <Text color="ink.500">{product.summary}</Text>
              <Flex gap="2" wrap="wrap">
                {product.protocols.map((protocol) => (
                  <Badge bg="surface.200" color="brand.700" key={protocol}>
                    {protocol}
                  </Badge>
                ))}
              </Flex>
            </Stack>
            <Stack align="start" color="ink.500" fontSize="sm" gap="2">
              <Text>{product.availability}</Text>
              <Text>{product.regionCount} source regions</Text>
              <Text>{product.documents.length} documents</Text>
              <Button asChild borderRadius="control" mt="2" variant="outline">
                <Link to={product.detailHref}>Open</Link>
              </Button>
            </Stack>
          </Grid>
        ))}
      </Stack>
    </Container>
  );
});
