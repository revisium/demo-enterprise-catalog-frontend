import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useFetcher } from 'react-router';

import type { PortalDemoSession } from 'src/entities/portal';
import {
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  SectionEyebrow,
  StickyPanel,
} from 'src/shared/ui';
import { CustomerPortalPageViewModel } from '../../model/CustomerPortalPageViewModel';

interface PortalActionResponse {
  readonly message: string;
  readonly status: 'accepted' | 'rejected';
}

export const CustomerPortalPage = observer(function CustomerPortalPage({
  session,
}: {
  readonly session: PortalDemoSession;
}) {
  const contentFeedbackFetcher = useFetcher<PortalActionResponse>();
  const preferenceFetcher = useFetcher<PortalActionResponse>();
  const [vm] = useState(() => new CustomerPortalPageViewModel(session));
  const activeOrganization = vm.activeOrganization;
  const primaryQuote = vm.primaryQuote;

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <PageIntroGrid
          eyebrow="Customer console"
          metrics={vm.metrics}
          metricsLabel="Workspace summary"
          summary="Saved plans, quotes, favorites, preferences, and activity for the signed-in user."
          title="Customer console."
        />

        <Grid
          gap={{ base: '4', md: '5' }}
          my={{ base: '6', md: '8' }}
          templateColumns={{ base: '1fr', xl: 'repeat(4, minmax(0, 1fr))' }}
        >
          <FilterCard>
            <SectionEyebrow>Signed-in user</SectionEyebrow>
            <Heading as="h2" color="ink.900" fontSize="2xl">
              {vm.currentUser.name}
            </Heading>
            <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <AccountFact label="Email" value={vm.currentUser.email} />
              {vm.sessionRows.map((row) => (
                <AccountFact key={row.label} label={row.label} value={row.value} />
              ))}
            </Grid>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Organization</SectionEyebrow>
            <Heading as="h2" color="ink.900" fontSize="2xl">
              {activeOrganization.name}
            </Heading>
            <Flex gap="2" wrap="wrap">
              {vm.organizationOptions.map((organization) => (
                <FilterButton
                  key={organization.id}
                  onClick={() => vm.selectOrganization(organization.id)}
                  selected={vm.selectedOrganizationId === organization.id}
                  tone="neutral"
                >
                  {organization.label}
                </FilterButton>
              ))}
            </Flex>
            <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <AccountFact label="Support" value={activeOrganization.supportPlan} />
              <AccountFact label="Home region" value={activeOrganization.homeRegion} />
              <AccountFact label="Members" value={String(activeOrganization.memberCount)} />
              <AccountFact label="Billing" value={activeOrganization.billingContact} />
            </Grid>
          </FilterCard>

          <FilterCard bg="surface.900" color="white">
            <Text
              color="darkPanelMutedText"
              fontSize="xs"
              fontWeight="760"
              textTransform="uppercase"
            >
              Next quote
            </Text>
            {primaryQuote ? (
              <Stack gap="3">
                <Heading as="h2" fontSize="2xl">
                  {primaryQuote.plan} in {primaryQuote.region}
                </Heading>
                <Text color="darkPanelText" fontSize="sm">
                  {primaryQuote.summary}
                </Text>
                <Flex gap="2" wrap="wrap">
                  <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                    {primaryQuote.status}
                  </Badge>
                  <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                    {primaryQuote.commentCount} comments
                  </Badge>
                  <Badge bg="rgba(255,255,255,0.12)" borderRadius="8px" color="white">
                    ${primaryQuote.monthlyUsd}/mo
                  </Badge>
                </Flex>
                <Button asChild borderRadius="8px" color="ink.900" size="sm" variant="solid">
                  <Link to={`/app/quotes/${primaryQuote.id}`}>Open quote</Link>
                </Button>
              </Stack>
            ) : (
              <Text color="darkPanelText" fontSize="sm">
                No open quote for this organization.
              </Text>
            )}
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Preferences</SectionEyebrow>
            <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              {vm.preferenceRows.map((row) => (
                <AccountFact key={row.label} label={row.label} value={row.value} />
              ))}
            </Grid>
          </FilterCard>
        </Grid>

        <Grid
          gap={{ base: '4', md: '5' }}
          mb={{ base: '6', md: '8' }}
          templateColumns={{ base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' }}
        >
          <FilterCard>
            <SectionEyebrow>Workspace checks</SectionEyebrow>
            <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              {vm.validationRows.map((row) => (
                <AccountFact key={row.label} label={row.label} value={row.value} />
              ))}
            </Grid>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Workspace actions</SectionEyebrow>
            <FieldHint>
              User actions are accepted only after the backend checks session, preferences, and
              referenced content.
            </FieldHint>
            <Stack gap="2">
              <preferenceFetcher.Form action="/app/actions/preferences" method="post">
                <input
                  name="languageId"
                  type="hidden"
                  value={vm.preferenceActionPayload.languageId}
                />
                <input
                  name="currencyId"
                  type="hidden"
                  value={vm.preferenceActionPayload.currencyId}
                />
                <input
                  name="organizationId"
                  type="hidden"
                  value={vm.preferenceActionPayload.organizationId}
                />
                <input name="regionId" type="hidden" value={vm.preferenceActionPayload.regionId} />
                <Button borderRadius="8px" size="sm" type="submit" variant="outline">
                  Save defaults
                </Button>
              </preferenceFetcher.Form>
              {preferenceFetcher.data ? <ActionMessage response={preferenceFetcher.data} /> : null}
              <contentFeedbackFetcher.Form action="/app/actions/content-feedback" method="post">
                <input name="articleId" type="hidden" value={vm.sourceFeedbackSample.articleId} />
                <input
                  name="organizationId"
                  type="hidden"
                  value={vm.sourceFeedbackSample.organizationId}
                />
                <input name="updateId" type="hidden" value={vm.sourceFeedbackSample.updateId} />
                <Button borderRadius="8px" size="sm" type="submit" variant="outline">
                  Save update
                </Button>
              </contentFeedbackFetcher.Form>
              {contentFeedbackFetcher.data ? (
                <ActionMessage response={contentFeedbackFetcher.data} />
              ) : null}
            </Stack>
          </FilterCard>

          <FilterCard>
            <SectionEyebrow>Recent activity</SectionEyebrow>
            <Stack gap="2">
              {vm.auditEvents.length === 0 ? (
                <Text color="ink.500" fontSize="sm">
                  No recent activity for this user.
                </Text>
              ) : null}
              {vm.auditEvents.map((event) => (
                <Stack
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  gap="1"
                  key={event.id}
                  p="3"
                >
                  <Flex gap="2" justify="space-between" wrap="wrap">
                    <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                      {event.scope}
                    </Badge>
                    <Text color="ink.500" fontSize="xs">
                      {event.when}
                    </Text>
                  </Flex>
                  <Text color="ink.900" fontSize="sm" fontWeight="760">
                    {event.event}
                  </Text>
                  <Text color="ink.500" fontSize="xs">
                    {event.actor}
                  </Text>
                </Stack>
              ))}
            </Stack>
          </FilterCard>
        </Grid>

        <Grid gap={{ base: '5', lg: '6' }} templateColumns={{ base: '1fr', lg: '320px 1fr' }}>
          <StickyPanel as="aside" position={{ lg: 'sticky' }} top={{ lg: '84px' }}>
            <FilterCard>
              <Stack gap="1">
                <SectionEyebrow>Workspace</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="xl">
                  {vm.selectedSectionLabel}
                </Heading>
              </Stack>
              <Flex gap="2" wrap="wrap">
                {vm.sectionOptions.map((section) => (
                  <FilterButton
                    key={section.id}
                    onClick={() => vm.selectSection(section.id)}
                    selected={vm.selectedSection === section.id}
                    tone="neutral"
                  >
                    {section.label}
                  </FilterButton>
                ))}
              </Flex>
            </FilterCard>
          </StickyPanel>

          {vm.selectedSection === 'plans' || vm.selectedSection === 'favorites' ? (
            <PlansPanel vm={vm} />
          ) : null}

          {vm.selectedSection === 'quotes' ? <QuotesPanel vm={vm} /> : null}
        </Grid>
      </Container>
    </Box>
  );
});

function ActionMessage({ response }: { readonly response: PortalActionResponse }) {
  return (
    <Text color={response.status === 'accepted' ? 'successText' : 'amberText'} fontSize="sm">
      {response.message}
    </Text>
  );
}

function AccountFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Box bg="panelGlassBg" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
      <Text color="ink.900" fontSize="sm" fontWeight="760">
        {value}
      </Text>
    </Box>
  );
}

function PlansPanel({ vm }: { readonly vm: CustomerPortalPageViewModel }) {
  const hasNoVisibleItems =
    vm.selectedSection === 'favorites'
      ? vm.visiblePlans.length === 0 && vm.favoriteItems.length === 0
      : vm.visiblePlans.length === 0;
  const emptyMessage =
    vm.selectedSection === 'favorites' ? 'No favorites yet.' : 'No saved plans yet.';

  return (
    <FilterCard>
      <PanelHeader
        summary="Save reusable server configurations, mark important plans, and carry a selected plan into the quote flow later."
        title={vm.selectedSection === 'favorites' ? 'Favorite saved plans' : 'Saved server plans'}
      />
      {vm.visiblePlans.map((plan) => (
        <Grid
          alignItems="center"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="3"
          key={plan.id}
          p="3"
          templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 130px 112px 112px' }}
        >
          <Stack gap="1">
            <Text color="ink.900" fontWeight="780">
              {plan.name}
            </Text>
            <Text color="ink.500" fontSize="sm">
              {plan.plan} · {plan.region} · ${plan.monthlyUsd}/mo
            </Text>
          </Stack>
          <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
            {plan.status}
          </Badge>
          <Button asChild borderRadius="8px" size="sm" variant="outline">
            <Link to={`/app/plans/${plan.id}`}>Open plan</Link>
          </Button>
          <Button
            aria-pressed={vm.isFavorited(plan.id)}
            borderRadius="8px"
            onClick={() => vm.toggleFavorite(plan.id)}
            size="sm"
            variant={vm.isFavorited(plan.id) ? 'solid' : 'outline'}
          >
            Favorite
          </Button>
        </Grid>
      ))}
      {vm.selectedSection === 'favorites'
        ? vm.favoriteItems.map((favorite) => (
            <Stack
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="1"
              key={favorite.id}
              p="3"
            >
              <Badge alignSelf="start" bg="panelGlassBg" borderRadius="8px" color="ink.700">
                {favorite.type}
              </Badge>
              <Text color="ink.900" fontWeight="780">
                {favorite.title}
              </Text>
              <Text color="ink.500" fontSize="sm">
                {favorite.summary}
              </Text>
            </Stack>
          ))
        : null}
      {hasNoVisibleItems ? (
        <Text color="ink.500" fontSize="sm">
          {emptyMessage}
        </Text>
      ) : null}
    </FilterCard>
  );
}

function QuotesPanel({ vm }: { readonly vm: CustomerPortalPageViewModel }) {
  return (
    <FilterCard>
      <PanelHeader
        summary="Track customer and sales replies, quote status, monthly totals, and follow-up timing."
        title="Quote lifecycle"
      />
      {vm.quotes.map((quote) => (
        <Grid
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="3"
          key={quote.id}
          p="3"
          templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 150px' }}
        >
          <Stack gap="1">
            <Flex align="center" gap="2" justify="space-between" wrap="wrap">
              <Text color="ink.900" fontWeight="780">
                {quote.plan} · {quote.region}
              </Text>
              <Badge bg="surface.100" borderRadius="8px" color="ink.700">
                {quote.status}
              </Badge>
            </Flex>
            <Text color="ink.600" fontSize="sm">
              {quote.summary}
            </Text>
            <Text color="ink.500" fontSize="xs">
              {quote.commentCount} comments · updated {quote.updatedAt}
            </Text>
          </Stack>
          <Stack align={{ base: 'start', md: 'end' }} gap="1">
            <Text color="ink.900" fontWeight="780">
              ${quote.monthlyUsd}/mo
            </Text>
            <Text color="ink.500" fontSize="xs">
              due {quote.due}
            </Text>
            <Button asChild borderRadius="8px" size="sm" variant="outline">
              <Link to={`/app/quotes/${quote.id}`}>Open quote</Link>
            </Button>
          </Stack>
        </Grid>
      ))}
    </FilterCard>
  );
}

function PanelHeader({ summary, title }: { readonly summary: string; readonly title: string }) {
  return (
    <Stack gap="1">
      <Heading as="h2" color="ink.900" fontSize="2xl">
        {title}
      </Heading>
      <Text color="ink.500" fontSize="sm">
        {summary}
      </Text>
    </Stack>
  );
}
