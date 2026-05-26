import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import { FieldHint, FilterCard, PageIntroGrid, SectionEyebrow, StickyPanel } from 'src/shared/ui';
import { ResourceDetailPageViewModel } from '../../model/ResourceDetailPageViewModel';

export const ResourceDetailPage = observer(function ResourceDetailPage() {
  const params = useParams();
  const [vm] = useState(() => new ResourceDetailPageViewModel(params.articleId));

  useEffect(() => {
    vm.setArticleId(params.articleId);
  }, [params.articleId, vm]);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
            <Link to="/resources">Back to resources</Link>
          </Button>

          <PageIntroGrid
            eyebrow={vm.article.category}
            metrics={vm.metrics}
            metricsLabel="Guide summary"
            summary={vm.article.summary}
            title={vm.article.title}
          />

          <Grid gap="4" templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 330px' }}>
            <Stack gap="4">
              <FilterCard>
                <Flex align="center" gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {vm.article.role}
                  </Badge>
                  <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                    by {vm.article.author}
                  </Badge>
                  {vm.article.tags.map((tag) => (
                    <Badge bg="surface.100" borderRadius="8px" color="ink.700" key={tag}>
                      {tag}
                    </Badge>
                  ))}
                </Flex>
                {vm.detailSections.map((section) => (
                  <Stack gap="1" key={section.title}>
                    <Heading as="h2" color="ink.900" fontSize="2xl">
                      {section.title}
                    </Heading>
                    <Text color="ink.700" fontSize="sm">
                      {section.body}
                    </Text>
                  </Stack>
                ))}
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Checklist</SectionEyebrow>
                <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                  {vm.checklistItems.map((item, index) => (
                    <Stack
                      bg="panelGlassBg"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="1"
                      key={item}
                      p="3"
                    >
                      <Text color="brand.500" fontSize="xs" fontWeight="780">
                        Step {index + 1}
                      </Text>
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {item}
                      </Text>
                    </Stack>
                  ))}
                </Grid>
              </FilterCard>
            </Stack>

            <StickyPanel as="aside">
              <FilterCard>
                <SectionEyebrow>Guide actions</SectionEyebrow>
                <FieldHint>
                  Save this guide or mark it helpful while planning the next server request.
                </FieldHint>
                <Flex gap="2" wrap="wrap">
                  <Button
                    aria-pressed={vm.isHelpful}
                    borderRadius="8px"
                    onClick={() => vm.toggleHelpful()}
                    size="sm"
                    variant={vm.isHelpful ? 'solid' : 'outline'}
                  >
                    Helpful
                  </Button>
                  <Button
                    aria-pressed={vm.isSaved}
                    borderRadius="8px"
                    onClick={() => vm.toggleSaved()}
                    size="sm"
                    variant={vm.isSaved ? 'solid' : 'outline'}
                  >
                    Save
                  </Button>
                </Flex>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Next paths</SectionEyebrow>
                {vm.quickLinks.map((link) => (
                  <Stack
                    borderTopColor="surface.200"
                    borderTopWidth="1px"
                    gap="1"
                    key={link.href}
                    pt="3"
                  >
                    <Button
                      alignSelf="start"
                      asChild
                      borderRadius="8px"
                      size="sm"
                      variant="outline"
                    >
                      <Link to={link.href}>{link.label}</Link>
                    </Button>
                    <Text color="ink.500" fontSize="sm">
                      {link.summary}
                    </Text>
                  </Stack>
                ))}
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Related guides</SectionEyebrow>
                {vm.relatedArticles.map((article) => (
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
                      <Link to={`/resources/${article.id}`}>Open guide</Link>
                    </Button>
                  </Stack>
                ))}
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});
