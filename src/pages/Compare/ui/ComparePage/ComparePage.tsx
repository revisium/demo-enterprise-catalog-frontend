import { Badge, Box, Flex, Grid, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';

import { PrototypePage } from 'src/shared/ui';
import { ComparePageViewModel } from '../../model/ComparePageViewModel';

export const ComparePage = observer(function ComparePage() {
  const [vm] = useState(() => new ComparePageViewModel());
  const recommendation = vm.recommendation;

  return (
    <PrototypePage
      asideSummary="Strong stock coverage with production-ready support and predictable regional pricing."
      asideTitle={recommendation?.name}
      eyebrow="Server comparison"
      summary="Review CPU, memory, storage, network, regional stock, setup time, and monthly price in one dense product view."
      title="Compare plans before building a quote."
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="3" mt={{ base: '5', md: '6' }}>
        {vm.highlights.map((metric) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="1"
            key={metric.label}
            p="4"
          >
            <Text color="ink.900" fontSize="2xl" fontWeight="780">
              {metric.value}
            </Text>
            <Text color="ink.500" fontSize="sm">
              {metric.label}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>

      <Stack
        bg="white"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        gap="0"
        mt={{ base: '5', md: '6' }}
        overflow="hidden"
      >
        <Grid
          bg="surface.50"
          borderBottomColor="surface.200"
          borderBottomWidth="1px"
          display={{ base: 'none', lg: 'grid' }}
          gap="0"
          templateColumns={`180px repeat(${vm.products.length}, minmax(0, 1fr))`}
        >
          <Box p="4">
            <Text color="ink.500" fontSize="sm" fontWeight="760">
              Metric
            </Text>
          </Box>
          {vm.products.map((product) => (
            <Stack
              borderLeftColor="surface.200"
              borderLeftWidth="1px"
              gap="2"
              key={product.id}
              p="4"
            >
              <Text color="ink.900" fontWeight="780">
                {product.name}
              </Text>
              <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                {product.family}
              </Badge>
            </Stack>
          ))}
        </Grid>

        {vm.metrics.map((metric) => (
          <Grid
            borderBottomColor="surface.200"
            borderBottomWidth="1px"
            gap="0"
            key={metric.id}
            templateColumns={{
              base: '1fr',
              lg: `180px repeat(${vm.products.length}, minmax(0, 1fr))`,
            }}
          >
            <Box bg={{ base: 'surface.50', lg: 'transparent' }} p="4">
              <Text color="ink.700" fontWeight="760">
                {metric.label}
              </Text>
            </Box>
            {metric.values.map((value, index) => (
              <Flex
                align="center"
                borderLeftColor={{ base: 'transparent', lg: 'surface.200' }}
                borderLeftWidth={{ base: '0', lg: '1px' }}
                borderTopColor={{ base: 'surface.200', lg: 'transparent' }}
                borderTopWidth={{ base: index === 0 ? '0' : '1px', lg: '0' }}
                justify="space-between"
                key={`${metric.id}-${vm.products[index]?.id ?? index}`}
                minH="14"
                p="4"
              >
                <Text color="ink.500" display={{ base: 'block', lg: 'none' }} fontSize="sm">
                  {vm.products[index]?.name}
                </Text>
                <Text color="ink.900" fontWeight="760">
                  {value}
                </Text>
              </Flex>
            ))}
          </Grid>
        ))}
      </Stack>

      <Flex justify="flex-end" mt="4">
        <Box
          asChild
          bg="ctaBg"
          borderRadius="8px"
          color="white"
          fontSize="sm"
          fontWeight="760"
          px="4"
          py="2.5"
        >
          <RouterLink to="/quote">Request quote</RouterLink>
        </Box>
      </Flex>
    </PrototypePage>
  );
});
