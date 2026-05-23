import { Badge, Button, Flex, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FilterButton, MetricGrid, PrototypePage, SectionEyebrow } from 'src/shared/ui';
import { ResourcesPageViewModel } from '../../model/ResourcesPageViewModel';

export const ResourcesPage = observer(function ResourcesPage() {
  const [vm] = useState(() => new ResourcesPageViewModel());
  const featured = vm.featuredArticle;

  return (
    <PrototypePage
      asideSummary={featured?.summary ?? 'Select a category to focus the documentation index.'}
      asideTitle={featured?.title ?? 'No article selected'}
      eyebrow="Docs and guides"
      summary="Read server planning guides, networking rules, backup policies, SLA notes, billing details, and API documentation."
      title="Find the operational answer before you buy."
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
              <SectionEyebrow>Browse docs</SectionEyebrow>
              <Heading as="h2" color="ink.900" fontSize="xl">
                Filter articles by customer task
              </Heading>
            </Stack>
            <Flex gap="2" wrap="wrap">
              {vm.categoryOptions.map((category) => (
                <FilterButton
                  key={category}
                  onClick={() => vm.selectCategory(category)}
                  selected={vm.selectedCategory === category}
                  tone="neutral"
                >
                  {category}
                </FilterButton>
              ))}
            </Flex>
          </Flex>
          <MetricGrid ariaLabel="Resources metrics" metrics={vm.summaryMetrics} />
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
            Dictionary tags
          </Text>
          <Flex gap="2" wrap="wrap">
            {vm.popularTags.map((tag) => (
              <Badge bg="darkBadgeBg" borderRadius="8px" color="white" key={tag.label}>
                {tag.label} · {tag.count}
              </Badge>
            ))}
          </Flex>
          <Text color="darkPanelText" fontSize="sm">
            These labels become CMS dictionary rows later; the public page only shows customer
            terms.
          </Text>
        </Stack>
      </Grid>

      <SimpleGrid columns={{ base: 1, md: 4 }} gap="3" mt="4">
        {vm.categories.map((category) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="1"
            key={category.label}
            p="4"
          >
            <Text color="ink.900" fontWeight="780">
              {category.label}
            </Text>
            <Text color="ink.500" fontSize="sm">
              {category.count} article
            </Text>
          </Stack>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="4" mt={{ base: '5', md: '6' }}>
        {vm.filteredArticles.map((article) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            key={article.title}
            minH="260px"
            p="4"
          >
            <Flex align="center" gap="2" justify="space-between">
              <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                {article.category}
              </Badge>
              <Text color="ink.500" fontSize="sm">
                {article.readTime} · {article.publishedAt}
              </Text>
            </Flex>
            <Heading as="h2" color="ink.900" fontSize="2xl">
              {article.title}
            </Heading>
            <Text color="ink.600" fontSize="sm">
              {article.summary}
            </Text>
            <Text color="ink.500" fontSize="sm">
              By {article.author}
            </Text>
            <Flex gap="2" mt="auto" wrap="wrap">
              {article.tags.map((tag) => (
                <Badge bg="surface.100" borderRadius="8px" color="ink.600" key={tag}>
                  {tag}
                </Badge>
              ))}
            </Flex>
            <Flex align="center" gap="3" justify="space-between" pt="2" wrap="wrap">
              <Text color="ink.500" fontSize="sm">
                {vm.getHelpfulCount(article)} people found this helpful
              </Text>
              <Button
                borderRadius="8px"
                onClick={() => vm.toggleHelpful(article.title)}
                size="sm"
                variant={vm.isHelpful(article.title) ? 'solid' : 'outline'}
              >
                Helpful
              </Button>
            </Flex>
          </Stack>
        ))}
      </SimpleGrid>
    </PrototypePage>
  );
});
