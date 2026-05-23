import { Badge, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { PrototypePage } from 'src/shared/ui';
import { ReleasesPageViewModel } from '../../model/ReleasesPageViewModel';

export const ReleasesPage = observer(function ReleasesPage() {
  const [vm] = useState(() => new ReleasesPageViewModel());
  const latest = vm.latestUpdate;

  return (
    <PrototypePage
      asideSummary={latest?.summary ?? ''}
      asideTitle={latest?.title}
      eyebrow="Product updates"
      summary="Follow the changes that affect server selection, quote timing, regional availability, billing terms, and customer documentation."
      title="Track catalog, region, docs, and price changes."
    >
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="3" mt={{ base: '5', md: '6' }}>
        {vm.updateCounts.map((metric) => (
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

      <Stack gap="3" mt={{ base: '5', md: '6' }}>
        {vm.updates.map((update) => (
          <Grid
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            key={update.title}
            p="4"
            templateColumns={{ base: '1fr', lg: '120px minmax(0, 1fr) 260px' }}
          >
            <Stack gap="2">
              <Text color="ink.500" fontSize="sm" fontWeight="760">
                {update.date}
              </Text>
              <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                {update.type}
              </Badge>
            </Stack>
            <Stack gap="2">
              <Heading as="h2" color="ink.900" fontSize="2xl">
                {update.title}
              </Heading>
              <Text color="ink.600" fontSize="sm">
                {update.summary}
              </Text>
            </Stack>
            <Stack bg="surface.50" borderRadius="8px" gap="1.5" p="3">
              <Text color="ink.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                Customer impact
              </Text>
              <Text color="ink.800" fontSize="sm">
                {update.impact}
              </Text>
            </Stack>
          </Grid>
        ))}
      </Stack>
    </PrototypePage>
  );
});
