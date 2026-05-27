import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  FilterCard,
  SectionEyebrow,
  StickyPanel,
} from 'src/shared/ui';
import { ResourceDetailPageViewModel } from '../../model/ResourceDetailPageViewModel';

export const ResourceDetailPage = observer(function ResourceDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new ResourceDetailPageViewModel(params.articleId));
  const returnState = createReturnState(location);

  useEffect(() => {
    vm.setArticleId(params.articleId);
  }, [params.articleId, vm]);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/resources" />

          <Grid
            alignItems="start"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
            w="100%"
          >
            <Stack gap="4" gridColumn={{ xl: 'span 2' }} minW="0">
              <Stack
                bg="recommendationBg"
                borderColor="panelBorderStrong"
                borderRadius="8px"
                borderWidth="1px"
                boxShadow="panel"
                gap="4"
                justify="space-between"
                minW="0"
                p="3"
              >
                <Stack gap="3">
                  <SectionEyebrow>{vm.article.category}</SectionEyebrow>
                  <Heading
                    as="h1"
                    color="ink.900"
                    fontSize={{ base: '3xl', md: '5xl' }}
                    lineHeight="1"
                  >
                    {vm.article.title}
                  </Heading>
                  <Text color="ink.700" fontSize="md" maxW="760px">
                    {vm.article.summary}
                  </Text>
                </Stack>
                <Flex gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {vm.article.role}
                  </Badge>
                </Flex>
              </Stack>

              <FilterCard>
                <SectionEyebrow>Guide body</SectionEyebrow>
                {vm.detailSections.map((section) => (
                  <Stack gap="1" key={section.title}>
                    <Text color="ink.900" fontSize="lg" fontWeight="780">
                      {section.title}
                    </Text>
                    <Text color="ink.700" fontSize="sm" lineHeight="1.55">
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

              <FilterCard>
                <SectionEyebrow>Related guides</SectionEyebrow>
                <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                  {vm.relatedArticles.map((article) => (
                    <Grid
                      bg="panelGlassBg"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="2"
                      gridTemplateRows={{ base: 'auto auto auto', md: '2.75rem 1.25rem auto' }}
                      h="100%"
                      key={article.id}
                      minH={{ md: '8rem' }}
                      p="3"
                    >
                      <Text color="ink.900" fontSize="sm" fontWeight="760" lineHeight="1.35">
                        {article.title}
                      </Text>
                      <Text color="ink.500" fontSize="xs" lineHeight="1.35">
                        {article.category} · {article.readTimeMinutes} min
                      </Text>
                      <Button
                        alignSelf="start"
                        asChild
                        borderRadius="8px"
                        justifySelf="start"
                        size="sm"
                        variant="outline"
                      >
                        <Link state={returnState} to={`/resources/${article.id}`}>
                          Open guide
                        </Link>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </FilterCard>
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
              <Stack
                bg="panelDarkBg"
                borderColor="darkPanelBorder"
                borderRadius="8px"
                borderWidth="1px"
                boxShadow="panel"
                color="white"
                gap="4"
                justify="space-between"
                minW="0"
                p="3"
                w="100%"
              >
                <Stack gap="1">
                  <Text
                    color="darkPanelMutedText"
                    fontSize="xs"
                    fontWeight="800"
                    textTransform="uppercase"
                  >
                    Guide summary
                  </Text>
                  <Flex align="end" gap="2">
                    <Text color="white" fontSize="5xl" fontWeight="800" lineHeight="1">
                      {vm.article.readTimeMinutes}
                    </Text>
                    <Text color="darkPanelText" fontSize="sm" fontWeight="760">
                      min
                    </Text>
                  </Flex>
                </Stack>
                <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                  {vm.metrics.map((metric) => (
                    <DarkFact key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </Grid>
              </Stack>

              <FilterCard>
                <SectionEyebrow>Guide actions</SectionEyebrow>
                <Flex gap="2" wrap="wrap">
                  <GuideActionButton
                    active={vm.isHelpful}
                    activeLabel="Marked helpful"
                    inactiveLabel="Mark helpful"
                    onClick={() => vm.toggleHelpful()}
                    tone="success"
                  />
                  <GuideActionButton
                    active={vm.isSaved}
                    activeLabel="Saved"
                    inactiveLabel="Save guide"
                    onClick={() => vm.toggleSaved()}
                    tone="brand"
                  />
                </Flex>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Next paths</SectionEyebrow>
                <Flex gap="2" wrap="wrap">
                  {vm.quickLinks.map((link) => (
                    <Button
                      asChild
                      borderRadius="8px"
                      key={link.href}
                      size="sm"
                      variant="outline"
                    >
                      <Link state={returnState} to={link.href}>
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </Flex>
              </FilterCard>
            </StickyPanel>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

interface GuideActionButtonProps {
  readonly active: boolean;
  readonly activeLabel: string;
  readonly inactiveLabel: string;
  readonly onClick: () => void;
  readonly tone: 'brand' | 'success';
}

function GuideActionButton({
  active,
  activeLabel,
  inactiveLabel,
  onClick,
  tone,
}: GuideActionButtonProps) {
  const selectedStyles =
    tone === 'success'
      ? { bg: 'successBg', borderColor: 'successBorder', color: 'successText' }
      : { bg: 'brand.50', borderColor: 'activeBorder', color: 'brand.500' };
  const idleStyles = { bg: 'white', borderColor: 'surface.200', color: 'ink.700' };
  const styles = active ? selectedStyles : idleStyles;

  return (
    <Button
      aria-pressed={active}
      bg={styles.bg}
      borderColor={styles.borderColor}
      borderRadius="8px"
      borderWidth="1px"
      color={styles.color}
      fontWeight="760"
      onClick={onClick}
      size="sm"
      variant="outline"
      _hover={{
        bg: active ? styles.bg : 'surface.50',
        borderColor: active ? styles.borderColor : 'brandBorderMuted',
        color: active ? styles.color : 'ink.900',
      }}
    >
      {active ? activeLabel : inactiveLabel}
    </Button>
  );
}

function DarkFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="darkBadgeBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="2"
    >
      <Text color="white" fontSize="lg" fontWeight="800" lineHeight="1.1" overflowWrap="anywhere">
        {value}
      </Text>
      <Text color="darkPanelMutedText" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
