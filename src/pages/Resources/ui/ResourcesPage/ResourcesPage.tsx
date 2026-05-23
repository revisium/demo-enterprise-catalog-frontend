import { Badge, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { PrototypePage } from 'src/shared/ui';
import { ResourcesPageViewModel } from '../../model/ResourcesPageViewModel';

export const ResourcesPage = observer(function ResourcesPage() {
  const [vm] = useState(() => new ResourcesPageViewModel());
  const featured = vm.featuredArticle;

  return (
    <PrototypePage
      asideSummary={featured?.summary ?? ''}
      asideTitle={featured?.title}
      eyebrow="Docs and guides"
      summary="Read server planning guides, networking rules, backup policies, SLA notes, billing details, and API documentation."
      title="Find the operational answer before you buy."
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} gap="3" mt={{ base: '5', md: '6' }}>
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
        {vm.articles.map((article) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            key={article.title}
            minH="210px"
            p="4"
          >
            <Flex align="center" gap="2" justify="space-between">
              <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                {article.category}
              </Badge>
              <Text color="ink.500" fontSize="sm">
                {article.readTime}
              </Text>
            </Flex>
            <Heading as="h2" color="ink.900" fontSize="2xl">
              {article.title}
            </Heading>
            <Text color="ink.600" fontSize="sm">
              {article.summary}
            </Text>
            <Flex gap="2" mt="auto" wrap="wrap">
              {article.tags.map((tag) => (
                <Badge bg="surface.100" borderRadius="8px" color="ink.600" key={tag}>
                  {tag}
                </Badge>
              ))}
            </Flex>
          </Stack>
        ))}
      </SimpleGrid>
    </PrototypePage>
  );
});
