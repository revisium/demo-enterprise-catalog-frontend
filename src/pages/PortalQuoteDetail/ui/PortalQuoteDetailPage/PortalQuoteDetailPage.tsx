import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useFetcher, useParams } from 'react-router';

import type { PortalDemoSession } from 'src/entities/portal';
import { FieldHint, FilterCard, PageIntroGrid, SectionEyebrow } from 'src/shared/ui';
import { PortalQuoteDetailPageViewModel } from '../../model/PortalQuoteDetailPageViewModel';

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
  const params = useParams();
  const [vm] = useState(() => new PortalQuoteDetailPageViewModel(params.quoteId, session));
  const quote = vm.quote;

  useEffect(() => {
    vm.setQuoteId(params.quoteId);
  }, [params.quoteId, vm]);

  if (!vm.canViewQuote || !quote) {
    return <QuoteAccessState vm={vm} />;
  }

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
            <Link to="/app">Back to console</Link>
          </Button>

          <PageIntroGrid
            eyebrow={vm.organization.name}
            metrics={vm.metrics}
            metricsLabel="Quote summary"
            summary={quote.summary}
            title={`${quote.plan} in ${quote.region}`}
          />

          <Grid gap="4" templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 340px' }}>
            <Stack gap="4">
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

            <Stack as="aside" gap="3">
              <FilterCard>
                <SectionEyebrow>Quote actions</SectionEyebrow>
                <FieldHint>
                  Continue public request preparation or return to the account workspace.
                </FieldHint>
                <Flex gap="2" wrap="wrap">
                  <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                    <Link to="/quote">Prepare public quote</Link>
                  </Button>
                  <commentFetcher.Form action="/app/actions/quote-comments" method="post">
                    <input name="quoteId" type="hidden" value={quote.id} />
                    <input name="statusId" type="hidden" value={quote.status} />
                    <Button borderRadius="8px" size="sm" type="submit" variant="outline">
                      Add note
                    </Button>
                  </commentFetcher.Form>
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <Link to="/pricing">Check price rows</Link>
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
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

function QuoteAccessState({ vm }: { readonly vm: PortalQuoteDetailPageViewModel }) {
  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap="5">
          <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
            <Link to="/app">Back to console</Link>
          </Button>
          <FilterCard>
            <SectionEyebrow>Access check</SectionEyebrow>
            <Heading as="h1" color="ink.900" fontSize="3xl">
              Quote is not available for this user.
            </Heading>
            <FieldHint>
              The backend mock resolved the current user from cookies and rejected this quote id
              before showing customer conversation data.
            </FieldHint>
            <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
              {vm.accessRows.map((row) => (
                <QuoteFact key={row.label} label={row.label} value={row.value} />
              ))}
            </Grid>
          </FilterCard>
        </Stack>
      </Container>
    </Box>
  );
}

function QuoteFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack bg="panelGlassBg" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
      <Text color="ink.900" fontSize="sm" fontWeight="760">
        {value}
      </Text>
    </Stack>
  );
}
