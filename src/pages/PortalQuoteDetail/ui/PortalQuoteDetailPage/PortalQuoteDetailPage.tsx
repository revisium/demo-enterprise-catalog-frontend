import { Badge, Button, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link, useFetcher, useLocation, useParams } from 'react-router';

import type { PortalDemoSession } from 'src/entities/portal';
import { createReturnState } from 'src/shared/routing';
import {
  DarkSummaryPanel,
  DetailHeroPanel,
  FieldHint,
  FilterCard,
  LinkedSummaryCard,
  PortalEntityBadges,
  PortalEntityPageLayout,
  SectionEyebrow,
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

  return PortalEntityPageLayout({
      aside: (
        <>
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
              <LinkedSummaryCard
                key={plan.id}
                returnState={returnState}
                subtitle={`${plan.plan} · ${plan.region} · $${plan.monthlyUsd}/mo`}
                subtitleFontSize="xs"
                title={plan.name}
                titleFontSize="sm"
                to={`/app/plans/${plan.id}`}
              >
                <Badge alignSelf="start" bg="panelGlassBg" borderRadius="8px" color="ink.700">
                  {plan.status}
                </Badge>
              </LinkedSummaryCard>
            ))}
          </FilterCard>
        </>
      ),
      heroPanel: (
        <DetailHeroPanel
          actions={
            <PortalEntityBadges
              left={quote.status}
              middle={`updated ${quote.updatedAt}`}
              right={`$${quote.monthlyUsd}/mo`}
            />
          }
          eyebrow={vm.organization.name}
          summary={quote.summary}
          title={`${quote.plan} in ${quote.region}`}
        />
      ),
      summaryPanel: (
        <DarkSummaryPanel
          eyebrow="Quote summary"
          factVariant="glass"
          metrics={vm.metrics}
          summary="monthly estimate with status, due date, and comment activity."
          value={`$${quote.monthlyUsd}`}
        />
      ),
    children: (
      <>
      <FilterCard>
        <PortalEntityBadges
          left={quote.status}
          middle={`updated ${quote.updatedAt}`}
          right={`${vm.organization.supportPlan} support`}
        />
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
      </>
    ),
  });
});
