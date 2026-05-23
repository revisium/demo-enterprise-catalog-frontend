import {
  Badge,
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { ProductVisual } from 'src/shared/ui';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const params = useParams();
  const vm = useMemo(() => new ProductDetailPageViewModel(params.productId), [params.productId]);
  const { product } = vm;

  return (
    <Container maxW="1240px" px="4" py={{ base: '8', md: '16' }}>
      <Grid
        alignItems="stretch"
        gap={{ base: '6', lg: '10' }}
        templateColumns={{ base: '1fr', lg: 'minmax(0, 1.3fr) minmax(300px, 0.7fr)' }}
      >
        <Stack gap="5">
          <Flex
            align="center"
            color="ink.500"
            fontSize="sm"
            fontWeight="700"
            justify="space-between"
          >
            <Text>{product.family}</Text>
            <Badge bg="surface.200" borderRadius="full" color="brand.700">
              {product.lifecycle}
            </Badge>
          </Flex>
          <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1">
            {product.name}
          </Heading>
          <Text color="ink.500" fontSize="lg" maxW="720px">
            {product.summary}
          </Text>
          <Flex gap="2" wrap="wrap">
            {product.protocols.map((protocol) => (
              <Badge bg="surface.200" color="brand.700" key={protocol}>
                {protocol}
              </Badge>
            ))}
          </Flex>
        </Stack>
        <ProductVisual alt={product.imageAlt} minH="320px" tone={product.visualTone} />
      </Grid>

      <SimpleGrid
        aria-label="Product metrics"
        bg="white"
        borderRadius="panel"
        borderWidth="1px"
        boxShadow="panel"
        columns={{ base: 1, md: 3 }}
        gap="3"
        mt="5"
        p="4"
      >
        {product.metrics.map((metric) => (
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

      <Grid gap={{ base: '6', lg: '10' }} mt="10" templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        <Stack bg="white" borderRadius="panel" borderWidth="1px" boxShadow="panel" gap="4" p="4">
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
        <Stack bg="white" borderRadius="panel" borderWidth="1px" boxShadow="panel" gap="4" p="4">
          <Heading as="h2" color="ink.900" fontSize="2xl">
            Documents
          </Heading>
          <Flex gap="3" wrap="wrap">
            {product.documents.map((document) => (
              <Badge
                bg="surface.50"
                borderColor="brandBorderMuted"
                borderRadius="control"
                borderWidth="1px"
                color="brand.700"
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
    </Container>
  );
});
