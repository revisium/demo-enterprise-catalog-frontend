import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  FieldHint,
  FilterCard,
  SectionEyebrow,
  StickyPanel,
} from 'src/shared/ui';
import { ReleaseDetailPageViewModel } from '../../model/ReleaseDetailPageViewModel';

export const ReleaseDetailPage = observer(function ReleaseDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new ReleaseDetailPageViewModel(params.updateId));
  const returnState = createReturnState(location);

  useEffect(() => {
    vm.setUpdateId(params.updateId);
  }, [params.updateId, vm]);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <BackNavButton fallbackTo="/releases" />

          <Grid
            alignItems="stretch"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          >
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              gridColumn={{ xl: 'span 2' }}
              h="100%"
              justify="space-between"
              minW="0"
              p="3"
            >
              <Stack gap="3">
                <SectionEyebrow>{vm.update.type} update</SectionEyebrow>
                <Heading
                  as="h1"
                  color="ink.900"
                  fontSize={{ base: '3xl', md: '5xl' }}
                  lineHeight="1"
                >
                  {vm.update.title}
                </Heading>
                <Text color="ink.700" fontSize="md" maxW="760px">
                  {vm.update.summary}
                </Text>
              </Stack>
              <Flex gap="2" wrap="wrap">
                <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                  {vm.update.type}
                </Badge>
                <Badge
                  bg={vm.update.priority === 'Important' ? 'amberBg' : 'panelSubtleBg'}
                  borderRadius="8px"
                  color={vm.update.priority === 'Important' ? 'amberText' : 'ink.700'}
                >
                  {vm.update.priority}
                </Badge>
                {vm.update.tags.map((tag) => (
                  <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700" key={tag}>
                    {tag}
                  </Badge>
                ))}
              </Flex>
            </Stack>

            <Stack
              bg="panelDarkBg"
              borderColor="darkPanelBorder"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              color="white"
              gap="4"
              h="100%"
              justify="space-between"
              minW="0"
              p="3"
            >
              <Stack gap="1">
                <Text
                  color="darkPanelMutedText"
                  fontSize="xs"
                  fontWeight="800"
                  textTransform="uppercase"
                >
                  Update summary
                </Text>
                <Text color="white" fontSize="5xl" fontWeight="800" lineHeight="1">
                  {vm.update.priority}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  priority for customers affected by this release note.
                </Text>
              </Stack>
              <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
                {vm.metrics.map((metric) => (
                  <DarkFact key={metric.label} label={metric.label} value={metric.value} />
                ))}
              </Grid>
            </Stack>
          </Grid>

          <Grid
            alignItems="start"
            gap={{ base: '4', md: '5' }}
            minW="0"
            templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
            w="100%"
          >
            <Stack gap="4" gridColumn={{ xl: 'span 2' }} minW="0">
              <FilterCard>
                <SectionEyebrow>Impact detail</SectionEyebrow>
                <Stack bg="panelGlassBg" borderRadius="8px" gap="1" p="3">
                  <Text color="ink.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                    Customer impact
                  </Text>
                  <Text color="ink.900" fontSize="sm">
                    {vm.update.impact}
                  </Text>
                </Stack>
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
                <SectionEyebrow>Affected workspaces</SectionEyebrow>
                <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
                  {vm.affectedPaths.map((path) => (
                    <Stack
                      bg="panelGlassBg"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="2"
                      key={path.href}
                      p="3"
                    >
                      <Button
                        alignSelf="start"
                        asChild
                        borderRadius="8px"
                        size="sm"
                        variant="outline"
                      >
                        <Link state={returnState} to={path.href}>
                          {path.label}
                        </Link>
                      </Button>
                      <Text color="ink.500" fontSize="sm">
                        {path.summary}
                      </Text>
                    </Stack>
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
              <FilterCard>
                <SectionEyebrow>Update actions</SectionEyebrow>
                <FieldHint>
                  Mark updates as useful or keep them saved for the account planning thread.
                </FieldHint>
                <Flex gap="2" wrap="wrap">
                  <Button
                    aria-pressed={vm.isLiked}
                    borderRadius="8px"
                    onClick={() => vm.toggleLike()}
                    size="sm"
                    variant={vm.isLiked ? 'solid' : 'outline'}
                  >
                    Like
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
                <SectionEyebrow>Related updates</SectionEyebrow>
                {vm.relatedUpdates.map((update) => (
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
                      {update.type} · {update.date}
                    </Text>
                    <Button alignSelf="start" asChild borderRadius="8px" size="xs" variant="ghost">
                      <Link state={returnState} to={`/releases/${update.id}`}>
                        Open update
                      </Link>
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

function DarkFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="darkBadgeBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="3"
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
