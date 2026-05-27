import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link, useFetcher, useLocation, useParams } from 'react-router';

import type { PortalDemoSession } from 'src/entities/portal';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  FieldHint,
  FilterCard,
  SectionEyebrow,
  StickyPanel,
} from 'src/shared/ui';
import { PortalQuoteDetailPageViewModel } from '../../model/PortalQuoteDetailPageViewModel';
import { QuoteAccessState } from '../QuoteAccessState/QuoteAccessState';

interface PortalActionResponse {
  readonly message: string;
  readonly status: 'accepted' | 'rejected';
}

export const PortalQuoteDetailPage = observer(function PortalQuoteDetailPage({
  session,
}: {
  readonly session: PortalDemoSession;
}) {
  const commentFetcher = useFetcher<PortalActionResponse>();
  const location = useLocation();
  const params = useParams();
  const vm = useMemo(
    () => new PortalQuoteDetailPageViewModel(params.quoteId, session),
    [params.quoteId, session],
  );
  const returnState = createReturnState(location);
  const quote = vm.quote;

  if (!vm.canViewQuote || !quote) {
    return <QuoteAccessState vm={vm} />;
  }

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '4', md: '5' }}>
          <BackNavButton fallbackTo="/app" />

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
                <SectionEyebrow>{vm.organization.name}</SectionEyebrow>
                <Heading
                  as="h1"
                  color="ink.900"
                  fontSize={{ base: '3xl', md: '5xl' }}
                  lineHeight="1"
                >
                  {quote.plan} in {quote.region}
                </Heading>
                <Text color="ink.700" fontSize="md" maxW="760px">
                  {quote.summary}
                </Text>
              </Stack>
              <Flex gap="2" wrap="wrap">
                <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                  {quote.status}
                </Badge>
                <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                  updated {quote.updatedAt}
                </Badge>
                <Badge bg="successBg" borderRadius="8px" color="successText">
                  ${quote.monthlyUsd}/mo
                </Badge>
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
                  Quote summary
                </Text>
                <Text color="white" fontSize="5xl" fontWeight="800" lineHeight="1">
                  ${quote.monthlyUsd}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  monthly estimate with status, due date, and comment activity.
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
                <Flex align="center" gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {quote.status}
                  </Badge>
                  <Badge bg="surface.100" borderRadius="8px" color="ink.700">
                    updated {quote.updatedAt}
                  </Badge>
                  <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                    {vm.organization.supportPlan} support
                  </Badge>
                </Flex>
                <Grid as="dl" gap="2" templateColumns={{ base: '1fr', md: '170px minmax(0, 1fr)' }}>
                  <Text as="dt" color="ink.500">
                    Organization
                  </Text>
                  <Text as="dd" color="ink.900" m="0">
                    {vm.organization.name}
                  </Text>
                  <Text as="dt" color="ink.500">
                    Billing contact
                  </Text>
                  <Text as="dd" color="ink.900" m="0">
                    {vm.organization.billingContact}
                  </Text>
                  <Text as="dt" color="ink.500">
                    Home region
                  </Text>
                  <Text as="dd" color="ink.900" m="0">
                    {vm.organization.homeRegion}
                  </Text>
                </Grid>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Status timeline</SectionEyebrow>
                <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                  {vm.timeline.map((item) => (
                    <Stack
                      bg={item.state === 'next' ? 'brand.50' : 'panelGlassBg'}
                      borderColor={item.state === 'next' ? 'brandBorderMuted' : 'surface.200'}
                      borderRadius="8px"
                      borderWidth="1px"
                      gap="1"
                      key={item.label}
                      p="3"
                    >
                      <Badge
                        alignSelf="start"
                        bg={item.state === 'done' ? 'successBg' : 'white'}
                        borderRadius="8px"
                        color={item.state === 'done' ? 'successText' : 'ink.700'}
                      >
                        {item.state}
                      </Badge>
                      <Text color="ink.900" fontSize="sm" fontWeight="780">
                        {item.label}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {item.summary}
                      </Text>
                    </Stack>
                  ))}
                </Grid>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Conversation</SectionEyebrow>
                {vm.comments.map((comment) => (
                  <Stack
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="2"
                    key={comment.id}
                    p="3"
                  >
                    <Flex gap="2" justify="space-between" wrap="wrap">
                      <Stack gap="0">
                        <Text color="ink.900" fontSize="sm" fontWeight="780">
                          {comment.author}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          {comment.role}
                        </Text>
                      </Stack>
                      <Text color="ink.500" fontSize="xs">
                        {comment.when}
                      </Text>
                    </Flex>
                    <Text color="ink.700" fontSize="sm">
                      {comment.body}
                    </Text>
                  </Stack>
                ))}
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
                <SectionEyebrow>Quote actions</SectionEyebrow>
                <FieldHint>
                  Continue public request preparation or return to the account workspace.
                </FieldHint>
                <Flex gap="2" wrap="wrap">
                  <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                    <Link state={returnState} to="/quote">
                      Prepare public quote
                    </Link>
                  </Button>
                  <commentFetcher.Form action="/app/actions/quote-comments" method="post">
                    <input name="quoteId" type="hidden" value={quote.id} />
                    <input name="statusId" type="hidden" value={quote.status} />
                    <Button borderRadius="8px" size="sm" type="submit" variant="outline">
                      Add note
                    </Button>
                  </commentFetcher.Form>
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <Link state={returnState} to="/pricing">
                      Check price rows
                    </Link>
                  </Button>
                </Flex>
                {commentFetcher.data ? (
                  <Text
                    color={commentFetcher.data.status === 'accepted' ? 'successText' : 'amberText'}
                    fontSize="sm"
                  >
                    {commentFetcher.data.message}
                  </Text>
                ) : null}
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Related saved plans</SectionEyebrow>
                {vm.relatedPlans.map((plan) => (
                  <Stack
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="1"
                    key={plan.id}
                    p="3"
                  >
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      {plan.name}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {plan.plan} · {plan.region} · ${plan.monthlyUsd}/mo
                    </Text>
                    <Badge alignSelf="start" bg="panelGlassBg" borderRadius="8px" color="ink.700">
                      {plan.status}
                    </Badge>
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
      bg="rgba(255,255,255,0.08)"
      borderColor="rgba(255,255,255,0.12)"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="3"
    >
      <Text color="darkPanelMutedText" fontSize="xs">
        {label}
      </Text>
      <Text color="white" fontSize="sm" fontWeight="800">
        {value}
      </Text>
    </Stack>
  );
}
