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
import { ResourcesPageViewModel } from '../../model/ResourcesPageViewModel';

export const ResourcesPage = observer(function ResourcesPage() {
  const [vm] = useState(() => new ResourcesPageViewModel());
  const featured = vm.featuredArticle;

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Docs and guides"
          metrics={vm.summaryMetrics}
          metricsLabel="Resource summary"
          summary="Read planning guides, networking rules, backup policies, security checklists, billing notes, and partner API documentation."
          title="Find the operational answer before you buy."
        />

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 360px' }}
        >
          <FilterCard>
            <SectionEyebrow>Library filters</SectionEyebrow>
            <FieldHint>
              Narrow the library by customer task, team role, topic tag, and reading preference.
            </FieldHint>
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
                label="Team role"
                onChange={(value) => vm.selectRole(value)}
                options={vm.roleOptions}
                value={vm.selectedRole}
              />
              <SelectField
                label="Topic"
                onChange={(value) => vm.selectTag(value)}
                options={vm.tagOptions}
                value={vm.selectedTag}
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
              Featured answer
            </Text>
            {featured ? (
              <Stack gap="3">
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
                <Button asChild borderRadius="8px" color="ink.900" size="sm" variant="solid">
                  <Link to={`/resources/${featured.id}`}>Open guide</Link>
                </Button>
              </Stack>
            ) : (
              <Text color="darkPanelText" fontSize="sm">
                No article matches the current filters.
              </Text>
            )}
          </FilterCard>
        </Grid>

        <Grid gap="4" templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 320px' }}>
          <Stack gap="3">
            <Flex align="end" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <SectionEyebrow>Articles</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  Customer knowledge base
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
                summary="No docs match this combination. Reset filters to return to the full library."
                title="No articles found"
              />
            ) : null}

            {vm.filteredArticles.map((article) => (
              <Grid
                bg="white"
                borderColor={vm.isSaved(article.id) ? 'activeBorder' : 'surface.200'}
                borderRadius="8px"
                borderWidth="1px"
                gap="4"
                key={article.id}
                p="4"
                templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 190px' }}
              >
                <Stack gap="3">
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
                    <Heading as="h3" color="ink.900" fontSize="2xl">
                      {article.title}
                    </Heading>
                    <Text color="ink.600" fontSize="sm">
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

                <Stack align={{ base: 'start', lg: 'end' }} gap="3">
                  <Stack align={{ base: 'start', lg: 'end' }} gap="0">
                    <Text color="ink.900" fontWeight="780">
                      {article.readTimeMinutes} min read
                    </Text>
                    <Text color="ink.500" fontSize="sm">
                      by {article.author}
                    </Text>
                  </Stack>
                  <Text color="ink.500" fontSize="sm">
                    {vm.getHelpfulCount(article)} helpful votes
                  </Text>
                  <Flex gap="2" justify={{ base: 'start', lg: 'end' }} wrap="wrap">
                    <Button asChild borderRadius="8px" size="sm" variant="outline">
                      <Link to={`/resources/${article.id}`}>Open guide</Link>
                    </Button>
                    <Button
                      aria-pressed={vm.isHelpful(article.id)}
                      borderRadius="8px"
                      onClick={() => vm.toggleHelpful(article.id)}
                      size="sm"
                      variant={vm.isHelpful(article.id) ? 'solid' : 'outline'}
                    >
                      Helpful
                    </Button>
                    <Button
                      aria-pressed={vm.isSaved(article.id)}
                      borderRadius="8px"
                      onClick={() => vm.toggleSaved(article.id)}
                      size="sm"
                      variant={vm.isSaved(article.id) ? 'solid' : 'outline'}
                    >
                      Save
                    </Button>
                  </Flex>
                </Stack>
              </Grid>
            ))}
          </Stack>

          <Stack gap="3">
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
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="1"
                  key={article.id}
                  p="3"
                >
                  <Text color="ink.900" fontSize="sm" fontWeight="760">
                    {article.title}
                  </Text>
                  <Text color="ink.500" fontSize="xs">
                    {article.category} · {article.readTimeMinutes} min
                  </Text>
                  <Button alignSelf="start" asChild borderRadius="8px" size="xs" variant="ghost">
                    <Link to={`/resources/${article.id}`}>Open</Link>
                  </Button>
                </Stack>
              ))}
              {vm.savedArticles.length === 0 ? (
                <Text color="ink.500" fontSize="sm">
                  No saved articles yet.
                </Text>
              ) : null}
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Library sections</SectionEyebrow>
              <Grid gap="2" templateColumns={{ base: '1fr 1fr', xl: '1fr' }}>
                {vm.categorySummaries.map((category) => (
                  <Flex
                    bg="panelGlassBg"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="2"
                    justify="space-between"
                    key={category.label}
                    p="3"
                  >
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      {category.label}
                    </Text>
                    <Text color="ink.500" fontSize="sm">
                      {category.count}
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
