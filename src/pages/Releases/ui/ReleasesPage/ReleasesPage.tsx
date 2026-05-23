import { Badge, Button, Flex, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FilterButton, MetricGrid, PrototypePage, SectionEyebrow } from 'src/shared/ui';
import { ReleasesPageViewModel } from '../../model/ReleasesPageViewModel';

export const ReleasesPage = observer(function ReleasesPage() {
  const [vm] = useState(() => new ReleasesPageViewModel());
  const latest = vm.latestUpdate;

  return (
    <PrototypePage
      asideSummary={latest?.summary ?? 'Select an update type to focus the feed.'}
      asideTitle={latest?.title ?? 'No update selected'}
      eyebrow="Product updates"
      summary="Follow the changes that affect server selection, quote timing, regional availability, billing terms, and customer documentation."
      title="Track catalog, region, docs, and price changes."
    >
      <Grid gap="4" mt={{ base: '5', md: '6' }} templateColumns={{ base: '1fr', lg: '1fr 320px' }}>
        <Stack
          bg="white"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="4"
          p="4"
        >
          <Flex align="center" gap="3" justify="space-between" wrap="wrap">
            <Stack gap="1">
              <SectionEyebrow>Update feed</SectionEyebrow>
              <Heading as="h2" color="ink.900" fontSize="xl">
                Filter by customer impact
              </Heading>
            </Stack>
            <Flex gap="2" wrap="wrap">
              {vm.typeOptions.map((type) => (
                <FilterButton
                  key={type}
                  onClick={() => vm.selectType(type)}
                  selected={vm.selectedType === type}
                  tone="neutral"
                >
                  {type}
                </FilterButton>
              ))}
            </Flex>
          </Flex>
          <MetricGrid ariaLabel="Update metrics" metrics={vm.summaryMetrics} />
        </Stack>

        <Stack
          bg="surface.900"
          borderRadius="8px"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
          color="white"
          gap="3"
          p="4"
        >
          <Text color="darkPanelMutedText" fontSize="xs" fontWeight="700" textTransform="uppercase">
            Runtime feedback
          </Text>
          <Text fontSize="2xl" fontWeight="800" lineHeight="1.1">
            Likes stay user-owned
          </Text>
          <Text color="darkPanelText" fontSize="sm">
            The feed content is CMS-owned later; reactions and per-user preferences belong to the
            backend runtime layer.
          </Text>
        </Stack>
      </Grid>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap="3" mt="4">
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
        {vm.filteredUpdates.map((update) => (
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
              <Badge alignSelf="start" bg="surface.100" borderRadius="8px" color="ink.600">
                {update.audience}
              </Badge>
            </Stack>
            <Stack gap="2">
              <Heading as="h2" color="ink.900" fontSize="2xl">
                {update.title}
              </Heading>
              <Text color="ink.600" fontSize="sm">
                {update.summary}
              </Text>
              <Flex align="center" gap="3" wrap="wrap">
                <Text color="ink.500" fontSize="sm">
                  {vm.getLikedCount(update)} customer reactions
                </Text>
                <Button
                  aria-pressed={vm.isLiked(update.title)}
                  borderRadius="8px"
                  onClick={() => vm.toggleLike(update.title)}
                  size="sm"
                  variant={vm.isLiked(update.title) ? 'solid' : 'outline'}
                >
                  Like
                </Button>
              </Flex>
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
