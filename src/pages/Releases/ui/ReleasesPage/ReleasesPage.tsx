import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  EmptyState,
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
} from 'src/shared/ui';
import { ReleasesPageViewModel } from '../../model/ReleasesPageViewModel';

export const ReleasesPage = observer(function ReleasesPage() {
  const [vm] = useState(() => new ReleasesPageViewModel());
  const latest = vm.latestUpdate;

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Product updates"
          metrics={vm.summaryMetrics}
          metricsLabel="Update summary"
          summary="Follow the changes that affect server selection, quote timing, regional availability, billing terms, and customer documentation."
          title="Track catalog, region, docs, and price changes."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 360px' }}
        >
          <FilterCard>
            <SectionEyebrow>Feed filters</SectionEyebrow>
            <FieldHint>
              Filter updates by change area, team audience, and priority before forwarding them to a
              quote or planning thread.
            </FieldHint>
            <Flex gap="2" wrap="wrap">
              {vm.typeOptions.map((type) => (
                <FilterButton
                  key={type.id}
                  onClick={() => vm.selectType(type.id)}
                  selected={vm.selectedType === type.id}
                  tone="neutral"
                >
                  {type.label}
                </FilterButton>
              ))}
            </Flex>
            <Grid gap="3" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
              <SelectField
                label="Audience"
                onChange={(value) => vm.selectAudience(value)}
                options={vm.audienceOptions}
                value={vm.selectedAudience}
              />
              <SelectField
                label="Priority"
                onChange={(value) => vm.selectPriority(value)}
                options={vm.priorityOptions}
                value={vm.selectedPriority}
              />
              <SelectField
                label="Sort"
                onChange={(value) => vm.selectSort(value)}
                options={vm.sortOptions}
                value={vm.sortId}
              />
            </Grid>
            <QuerySummary rows={vm.queryRows} />
          </FilterCard>

          <FilterCard bg="surface.900" color="white">
            <Text
              color="darkPanelMutedText"
              fontSize="xs"
              fontWeight="760"
              textTransform="uppercase"
            >
              Latest visible update
            </Text>
            {latest ? (
              <Stack gap="3">
                <Heading as="h2" fontSize="2xl">
                  {latest.title}
                </Heading>
                <Text color="darkPanelText" fontSize="sm">
                  {latest.summary}
                </Text>
                <Flex gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {latest.type}
                  </Badge>
                  <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                    {latest.priority}
                  </Badge>
                  <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                    {latest.audience}
                  </Badge>
                </Flex>
                <Button asChild borderRadius="8px" color="ink.900" size="sm" variant="solid">
                  <Link to={`/releases/${latest.id}`}>Open update</Link>
                </Button>
              </Stack>
            ) : (
              <Text color="darkPanelText" fontSize="sm">
                No update matches the current filters.
              </Text>
            )}
          </FilterCard>
        </Grid>

        <Grid gap="4" templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 320px' }}>
          <Stack gap="3">
            <Flex align="end" gap="3" justify="space-between" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Update feed</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Customer-facing announcements
                </Heading>
              </Stack>
              <Button
                borderRadius="8px"
                onClick={() => vm.resetFilters()}
                size="sm"
                variant="outline"
              >
                Reset filters
              </Button>
            </Flex>

            {vm.hasNoMatches ? (
              <EmptyState
                actionLabel="Reset filters"
                onAction={() => vm.resetFilters()}
                summary="No updates match this combination. Reset filters to return to the full announcement feed."
                title="No updates found"
              />
            ) : null}

            {vm.filteredUpdates.map((update) => (
              <Grid
                bg="white"
                borderColor={vm.isSaved(update.id) ? 'activeBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                gap="4"
                key={update.id}
                p="4"
                templateColumns={{ base: '1fr', lg: '136px minmax(0, 1fr) 230px' }}
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
                  <Badge
                    alignSelf="start"
                    bg={update.priority === 'Important' ? 'amberBg' : 'panelGlassBg'}
                    borderRadius="8px"
                    color={update.priority === 'Important' ? 'amberText' : 'ink.700'}
                  >
                    {update.priority}
                  </Badge>
                </Stack>

                <Stack gap="3">
                  <Stack gap="1">
                    <Heading as="h3" color="ink.900" fontSize="2xl">
                      {update.title}
                    </Heading>
                    <Text color="ink.600" fontSize="sm">
                      {update.summary}
                    </Text>
                  </Stack>
                  <Flex gap="2" wrap="wrap">
                    {update.tags.map((tag) => (
                      <Badge bg="panelGlassBg" borderRadius="8px" color="ink.600" key={tag}>
                        {tag}
                      </Badge>
                    ))}
                  </Flex>
                  <Flex align="center" gap="3" wrap="wrap">
                    <Text color="ink.500" fontSize="sm">
                      {vm.getLikedCount(update)} customer reactions
                    </Text>
                    <Button
                      aria-pressed={vm.isLiked(update.id)}
                      borderRadius="8px"
                      onClick={() => vm.toggleLike(update.id)}
                      size="sm"
                      variant={vm.isLiked(update.id) ? 'solid' : 'outline'}
                    >
                      Like
                    </Button>
                    <Button
                      aria-pressed={vm.isSaved(update.id)}
                      borderRadius="8px"
                      onClick={() => vm.toggleSaved(update.id)}
                      size="sm"
                      variant={vm.isSaved(update.id) ? 'solid' : 'outline'}
                    >
                      Save
                    </Button>
                    <Button asChild borderRadius="8px" size="sm" variant="outline">
                      <Link to={`/releases/${update.id}`}>Open update</Link>
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

          <Stack gap="3">
            <FilterCard>
              <SectionEyebrow>Saved updates</SectionEyebrow>
              {vm.savedUpdates.map((update) => (
                <Stack
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="1"
                  key={update.id}
                  p="3"
                >
                  <Text color="ink.900" fontSize="sm" fontWeight="760">
                    {update.title}
                  </Text>
                  <Text color="ink.500" fontSize="xs">
                    {update.type} · {update.priority}
                  </Text>
                  <Button alignSelf="start" asChild borderRadius="8px" size="xs" variant="ghost">
                    <Link to={`/releases/${update.id}`}>Open</Link>
                  </Button>
                </Stack>
              ))}
              {vm.savedUpdates.length === 0 ? (
                <Text color="ink.500" fontSize="sm">
                  No saved updates yet.
                </Text>
              ) : null}
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Feed mix</SectionEyebrow>
              <Grid gap="2" templateColumns={{ base: '1fr 1fr', xl: '1fr' }}>
                {vm.updateCounts.map((metric) => (
                  <Flex
                    bg="panelGlassBg"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="2"
                    justify="space-between"
                    key={metric.label}
                    p="3"
                  >
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      {metric.label}
                    </Text>
                    <Text color="ink.500" fontSize="sm">
                      {metric.value}
                    </Text>
                  </Flex>
                ))}
              </Grid>
            </FilterCard>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});
