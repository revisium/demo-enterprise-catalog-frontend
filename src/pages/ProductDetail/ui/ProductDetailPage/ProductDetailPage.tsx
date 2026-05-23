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
          </Stack>
          <ProductVisual
            alt={product.imageAlt}
            minH="320px"
            radius="8px"
            tone={product.visualTone}
          />
        </Grid>

        <SimpleGrid aria-label="Product metrics" columns={{ base: 1, md: 3 }} gap="3" mt="5">
          {product.metrics.map((metric) => (
            <Box
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              key={metric.label}
              p="4"
            >
              <Text color="ink.900" fontSize="2xl" fontWeight="780">
                {metric.value}
              </Text>
              <Text color="ink.500" fontSize="sm">
                {metric.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

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
      </Container>
    </Box>
  );
});
