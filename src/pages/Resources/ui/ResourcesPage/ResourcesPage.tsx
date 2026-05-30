import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import { resourcesIntroImage } from 'src/shared/assets';
import { type ResourceArticle } from 'src/entities/content';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  EmptyState,
  FilterButton,
  FilterCard,
  PageSectionSurface,
  PageIntroGrid,
  ResetButton,
  SectionEyebrow,
  SelectField,
  StickyPanel,
} from 'src/shared/ui';
import { ResourcesPageViewModel } from '../../model/ResourcesPageViewModel';

export const ResourcesPage = observer(function ResourcesPage() {
  const [vm] = useState(() => new ResourcesPageViewModel());
  const featured = vm.featuredArticle;
  const location = useLocation();
  const returnState = createReturnState(location);

  return (
    <PageSectionSurface tone="resources" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Docs and guides"
          image={{ src: resourcesIntroImage }}
          metrics={vm.summaryMetrics}
          metricsLabel="Resource summary"
          summary="Guides for choosing, pricing, and operating HelioStack servers."
          title="Knowledge base"
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
              <SectionEyebrow>Library filters</SectionEyebrow>
              <Flex gap="2" wrap="wrap">
                {vm.categoryOptions.map((category) => (
                  <FilterButton
                    key={category.id}
                    onClick={() => vm.selectCategory(category.id)}
                    selected={vm.selectedCategory === category.id}
                    tone="neutral"
                  >
                    {category.label}
                  </FilterButton>
                ))}
              </Flex>
              <Grid gap="3" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                <SelectField
                  compact
                  label="Team role"
                  onChange={(value) => vm.selectRole(value)}
                  options={vm.roleOptions}
                  value={vm.selectedRole}
                />
                <SelectField
                  compact
                  label="Topic"
                  onChange={(value) => vm.selectTag(value)}
                  options={vm.tagOptions}
                  value={vm.selectedTag}
                />
                <SelectField
                  compact
                  label="Sort"
                  onChange={(value) => vm.selectSort(value)}
                  options={vm.sortOptions}
                  value={vm.sortId}
                />
              </Grid>
            </FilterCard>

            <Flex align="end" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Articles</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Customer knowledge base
                </Heading>
              </Stack>
              {vm.hasUserFilters ? (
                <ResetButton onClick={() => vm.resetFilters()}>
                  Reset filters
                </ResetButton>
              ) : null}
            </Flex>

            {vm.hasNoMatches ? (
              <EmptyState
                actionLabel="Reset filters"
                onAction={() => vm.resetFilters()}
                summary="No docs match this combination. Reset filters to return to the full library."
                title="No articles found"
              />
            ) : null}

            {vm.filteredArticles.map((article) => (
              <ResourceArticleCard
                article={article}
                getHelpfulCount={vm.getHelpfulCount(article)}
                isHelpful={vm.isHelpful(article.id)}
                isSaved={vm.isSaved(article.id)}
                key={article.id}
                onHelpful={() => vm.toggleHelpful(article.id)}
                onSaved={() => vm.toggleSaved(article.id)}
                returnState={returnState}
              />
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
            <FilterCard bg="panelDarkBg" borderColor="darkPanelBorder" color="white" w="100%">
              <Text
                color="darkPanelMutedText"
                fontSize="xs"
                fontWeight="800"
                textTransform="uppercase"
              >
                Featured answer
              </Text>
              {featured ? (
                <Stack
                  asChild
                  color="inherit"
                  cursor="pointer"
                  gap="3"
                  textDecoration="none"
                  transition="transform 0.18s ease"
                  _focusVisible={{
                    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.28)',
                    outline: 'none',
                  }}
                  _hover={{ transform: 'translateY(-1px)' }}
                >
                  <Link state={returnState} to={`/resources/${featured.id}`}>
                    <Heading as="h2" fontSize="2xl">
                      {featured.title}
                    </Heading>
                    <Text color="darkPanelText" fontSize="sm">
                      {featured.summary}
                    </Text>
                    <Flex gap="2" wrap="wrap">
                      <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                        {featured.category}
                      </Badge>
                      <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                        {featured.readTimeMinutes} min
                      </Badge>
                      <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                        {featured.relatedTopic}
                      </Badge>
                    </Flex>
                  </Link>
                </Stack>
              ) : (
                <Text color="darkPanelText" fontSize="sm">
                  No article matches the current filters.
                </Text>
              )}
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Topics</SectionEyebrow>
              <Flex gap="2" wrap="wrap">
                {vm.popularTags.slice(0, 8).map((tag) => (
                  <FilterButton
                    key={tag.label}
                    onClick={() => vm.selectTag(tag.label)}
                    selected={vm.selectedTag === tag.label}
                    tone="neutral"
                  >
                    {tag.label} · {tag.count}
                  </FilterButton>
                ))}
              </Flex>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Saved reads</SectionEyebrow>
              {vm.savedArticles.map((article) => (
                <Stack
                  asChild
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  color="inherit"
                  cursor="pointer"
                  gap="1"
                  key={article.id}
                  p="3"
                  textDecoration="none"
                  transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
                  _focusVisible={{
                    boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
                    outline: 'none',
                  }}
                  _hover={{
                    borderColor: 'activeBorder',
                    boxShadow: '0 12px 30px rgba(16, 24, 40, 0.1)',
                    transform: 'translateY(-1px)',
                  }}
                >
                  <Link state={returnState} to={`/resources/${article.id}`}>
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      {article.title}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {article.category} · {article.readTimeMinutes} min
                    </Text>
                  </Link>
                </Stack>
              ))}
              {vm.savedArticles.length === 0 ? (
                <Text color="ink.500" fontSize="sm">
                  No saved articles yet.
                </Text>
              ) : null}
            </FilterCard>

          </StickyPanel>
        </Grid>
      </Container>
    </PageSectionSurface>
  );
});

interface ResourceArticleCardProps {
  readonly article: ResourceArticle;
  readonly getHelpfulCount: number;
  readonly isHelpful: boolean;
  readonly isSaved: boolean;
  readonly onHelpful: () => void;
  readonly onSaved: () => void;
  readonly returnState: ReturnType<typeof createReturnState>;
}

function ResourceArticleCard({
  article,
  getHelpfulCount,
  isHelpful,
  isSaved,
  onHelpful,
  onSaved,
  returnState,
}: ResourceArticleCardProps) {
  const categoryBadgeIcon = getCategoryIcon(article.category);

  return (
    <Grid
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      cursor="pointer"
      gap="4"
      minW="0"
      overflow="hidden"
      p="3"
      position="relative"
      templateColumns={{ base: '1fr', lg: '56px minmax(0, 1fr) 204px' }}
      transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
      _hover={{
        borderColor: 'activeBorder',
        boxShadow: '0 18px 50px rgba(16, 24, 40, 0.12)',
        transform: 'translateY(-1px)',
      }}
    >
      <Box
        alignItems="center"
        as="aside"
        bg="panelSubtleBg"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        color="ink.500"
        display={{ base: 'none', md: 'flex' }}
        h="72px"
        justifyContent="center"
        p="2"
        minW="56px"
        textAlign="center"
      >
        <Stack align="center" color="brand.700" gap="0.5">
          {categoryBadgeIcon}
          <Text color="brand.700" fontSize="9px" fontWeight="760">
            DOC
          </Text>
          <Text color="ink.600" fontSize="9px">
            GUIDE
          </Text>
        </Stack>
      </Box>

      <Box
        asChild
        borderRadius="8px"
        inset="0"
        position="absolute"
        zIndex="1"
        _focusVisible={{
          boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
          outline: 'none',
        }}
      >
        <Link aria-label={`Open guide: ${article.title}`} state={returnState} to={`/resources/${article.id}`} />
      </Box>

      <Stack gap="3" minW="0" pointerEvents="none">
        <Flex align="center" gap="2" wrap="wrap">
          <Badge bg="brand.50" borderRadius="8px" color="brand.500">
            {article.category}
          </Badge>
          <Badge bg="surface.100" borderRadius="8px" color="ink.700">
            {article.role}
          </Badge>
          <Text color="ink.500" fontSize="sm">
            Updated {article.updatedAt}
          </Text>
        </Flex>
        <Stack gap="1">
          <Heading as="h3" color="ink.900" fontSize="xl">
            {article.title}
          </Heading>
          <Text color="ink.600" fontSize="sm" lineHeight="1.45">
            {article.summary}
          </Text>
        </Stack>
        <Flex gap="2" wrap="wrap">
          {article.tags.map((tag) => (
            <Badge bg="panelGlassBg" borderRadius="8px" color="ink.600" key={tag}>
              {tag}
            </Badge>
          ))}
        </Flex>
      </Stack>

      <Stack align={{ base: 'start', lg: 'end' }} gap="3" minW="0" pointerEvents="none">
        <Stack align={{ base: 'start', lg: 'end' }} gap="0">
          <Text color="ink.900" fontWeight="780">
            {article.readTimeMinutes} min read
          </Text>
          <Text color="ink.500" fontSize="sm">
            by {article.author}
          </Text>
          <Text color="ink.500" fontSize="sm">
            {getHelpfulCount} helpful votes
          </Text>
        </Stack>
        <Flex
          gap="2"
          justify={{ base: 'start', lg: 'end' }}
          pointerEvents="auto"
          position="relative"
          wrap="wrap"
          zIndex="2"
        >
          <Button
            aria-pressed={isHelpful}
            borderRadius="8px"
            onClick={onHelpful}
            size="sm"
            variant={isHelpful ? 'solid' : 'outline'}
          >
            Helpful
          </Button>
          <Button
            aria-pressed={isSaved}
            borderRadius="8px"
            onClick={onSaved}
            size="sm"
            variant={isSaved ? 'solid' : 'outline'}
          >
            Save
          </Button>
        </Flex>
      </Stack>
    </Grid>
  );
}

function getCategoryIcon(category: ResourceArticle['category']) {
  switch (category) {
    case 'Buying guide': {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 3.25h8.5a1.5 1.5 0 0 1 1.5 1.5v10.5l-4-2.2-4 2.2V4.75A1.5 1.5 0 0 1 11.5 3.25H13A1.5 1.5 0 0 1 14.5 4.75V16a1 1 0 0 1-1 1H5a1.5 1.5 0 0 1-1-1V4.75A1.5 1.5 0 0 1 5.5 3.25H13.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.4"
            />
            <path d="M7 6.5h6M7 9.5h5.5M7 12.5h4" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </Box>
      );
    }
    case 'Networking': {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4.75" cy="4.75" r="1.8" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="14.75" cy="4.75" r="1.8" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="14.75" cy="14.75" r="1.8" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M6.55 4.75h5.95M14.75 6.55v5.95M12.95 14.75H4.75M4.75 6.55v7.2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.4"
            />
          </svg>
        </Box>
      );
    }
    case 'Operations': {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <rect x="3.25" y="3.5" width="5.5" height="13" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9.25" y="6.25" width="5.5" height="10.25" rx="1" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11.5 8h4.25M13 13h2.75" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M8.25 5.8l.9.9M8.25 9.7l.9.9M11.2 3.7l.9.9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.4"
            />
          </svg>
        </Box>
      );
    }
    case 'API': {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5.75 3.5 10l3.5 4.25M13 5.75l3.5 4.25-3.5 4.25" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9.75 4l0 12" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 16.25h2.75M11 3.75h2.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          </svg>
        </Box>
      );
    }
    case 'Security': {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 2.2l-5.8 2.15v6.05c0 3.5 2.2 6.8 5.8 8 3.6-1.2 5.8-4.5 5.8-8V4.35L10 2.2Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.4 9.5h3.2v2.25c0 .6-.6 1.1-1.15 1.1h-.9c-.55 0-1.15-.5-1.15-1.1V9.5Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M10 6.75v2.25" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </Box>
      );
    }
    default: {
      return (
        <Box as="span" aria-hidden="true" color="currentColor" role="presentation">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.5 3.75h9.5A1.5 1.5 0 0 1 15.75 5.25v11.5a1.5 1.5 0 0 1-1.5 1.5H4.75A1.5 1.5 0 0 1 3.25 16.75V4.75A1.5 1.5 0 0 1 4.75 3.25h-.25Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M5.5 6.75h7M5.5 9.75h7M5.5 12.75h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
          </svg>
        </Box>
      );
    }
  }
}
