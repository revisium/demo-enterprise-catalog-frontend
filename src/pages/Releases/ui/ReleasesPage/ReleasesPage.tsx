import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  EmptyState,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  QuerySummary,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { ReleasesPageViewModel } from '../../model/ReleasesPageViewModel';

export const ReleasesPage = observer(function ReleasesPage() {
  const [vm] = useState(() => new ReleasesPageViewModel());
  const latest = vm.latestUpdate;
  const location = useLocation();
  const returnState = createReturnState(location);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Product updates"
          metrics={vm.summaryMetrics}
          metricsLabel="Update summary"
          summary="Catalog, region, pricing, and documentation changes in one feed."
          title="Product updates"
        />

        <Grid
          alignItems="start"
          gap={{ base: '4', md: '5' }}
          minW="0"
          my={{ base: '6', md: '8' }}
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          w="100%"
        >
          <Stack gap="4" gridColumn={{ xl: 'span 2' }} minW="0">
            <FilterCard>
              <SectionEyebrow>Feed filters</SectionEyebrow>
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
                  compact
                  label="Audience"
                  onChange={(value) => vm.selectAudience(value)}
                  options={vm.audienceOptions}
                  value={vm.selectedAudience}
                />
                <SelectField
                  compact
                  label="Priority"
                  onChange={(value) => vm.selectPriority(value)}
                  options={vm.priorityOptions}
                  value={vm.selectedPriority}
                />
                <SelectField
                  compact
                  label="Sort"
                  onChange={(value) => vm.selectSort(value)}
                  options={vm.sortOptions}
                  value={vm.sortId}
                />
              </Grid>
              <QuerySummary rows={vm.queryRows} />
            </FilterCard>

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
                minW="0"
                p="3"
                templateColumns={{ base: '1fr', lg: '112px minmax(0, 1fr) 190px' }}
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

                <Stack gap="3" minW="0">
                  <Stack gap="1">
                    <Heading as="h3" color="ink.900" fontSize="xl">
                      {update.title}
                    </Heading>
                    <Text color="ink.600" fontSize="sm" lineHeight="1.45">
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
                      <Link state={returnState} to={`/releases/${update.id}`}>
                        Open update
                      </Link>
                    </Button>
                  </Flex>
                </Stack>

                <Stack bg="surface.50" borderRadius="8px" gap="1.5" minW="0" p="3">
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

          <StickyPanel
            as="aside"
            gridColumn={{ xl: '3' }}
            maxH="none"
            overscrollBehavior="auto"
            overflowY="visible"
            pb="0"
            position={{ xl: 'static' }}
            pr="0"
            w="100%"
          >
            <FilterCard
              bg="panelDarkBg"
              borderColor="darkPanelBorder"
              color="white"
              justify="space-between"
              w="100%"
            >
              <Text
                color="darkPanelMutedText"
                fontSize="xs"
                fontWeight="800"
                textTransform="uppercase"
              >
                Latest visible update
              </Text>
              {latest ? (
                <>
                  <Stack gap="3">
                    <Heading as="h2" fontSize="2xl">
                      {latest.title}
                    </Heading>
                    <Text color="darkPanelText" fontSize="sm">
                      {latest.summary}
                    </Text>
                  </Stack>
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
                  <Button
                    asChild
                    bg="reserveButtonBg"
                    borderRadius="8px"
                    color="ink.900"
                    size="sm"
                    w="100%"
                  >
                    <Link state={returnState} to={`/releases/${latest.id}`}>
                      Open update
                    </Link>
                  </Button>
                </>
              ) : (
                <Stack flex="1" justify="center">
                  <Heading as="h2" fontSize="2xl">
                    No update matches the current filters.
                  </Heading>
                  <Text color="darkPanelText" fontSize="sm">
                    Adjust feed filters to return to the full announcement feed.
                  </Text>
                </Stack>
              )}
            </FilterCard>

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
                    <Link state={returnState} to={`/releases/${update.id}`}>
                      Open
                    </Link>
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
          </StickyPanel>
        </Grid>
      </Container>
    </Box>
  );
});
