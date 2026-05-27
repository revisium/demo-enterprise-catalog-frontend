import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useFetcher, useLocation } from 'react-router';

import type { PortalDemoSession } from 'src/entities/portal';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  FieldHint,
  FilterButton,
  FilterCard,
  PageIntroGrid,
  SectionEyebrow,
  StickyPanel,
} from 'src/shared/ui';
import { CustomerPortalPageViewModel } from '../../model/CustomerPortalPageViewModel';
import { PlansPanel } from '../PlansPanel/PlansPanel';
import { QuotesPanel } from '../QuotesPanel/QuotesPanel';

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
  const location = useLocation();
  const returnState = createReturnState(location);
  const activeOrganization = vm.activeOrganization;
  const primaryQuote = vm.primaryQuote;

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Customer console"
          metrics={vm.metrics}
          metricsLabel="Workspace summary"
          summary="Saved plans, quotes, favorites, preferences, and activity for the signed-in user."
          title="Customer console"
        />

        <Grid
          alignItems="start"
          gap={{ base: '4', md: '5' }}
          minW="0"
          my={{ base: '6', md: '8' }}
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          w="100%"
        >
          <Stack gap="4" gridColumn={{ xl: 'span 2' }} minW="0">
            <FilterCard>
              <Stack gap="1">
                <SectionEyebrow>Customer workspace</SectionEyebrow>
                <Heading as="h2" color="ink.900" fontSize="2xl">
                  {activeOrganization.name}
                </Heading>
                <Text color="ink.500" fontSize="sm">
                  {vm.currentUser.name} · {vm.currentUser.email}
                </Text>
              </Stack>

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

              <Grid gap="2" templateColumns={{ base: '1fr', md: 'repeat(3, minmax(0, 1fr))' }}>
                <AccountFact label="Email" value={vm.currentUser.email} />
                {vm.sessionRows.map((row) => (
                  <AccountFact key={row.label} label={row.label} value={row.value} />
                ))}
                <AccountFact label="Support" value={activeOrganization.supportPlan} />
                <AccountFact label="Home region" value={activeOrganization.homeRegion} />
                <AccountFact label="Members" value={String(activeOrganization.memberCount)} />
                <AccountFact label="Billing" value={activeOrganization.billingContact} />
              </Grid>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Reference checks</SectionEyebrow>
              <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
                {vm.validationRows.length === 0 ? (
                  <Box
                    bg="panelGlassBg"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    p="3"
                  >
                    <Text color="ink.500" fontSize="sm">
                      No reference checks for this user and organization.
                    </Text>
                  </Box>
                ) : null}
                {vm.validationRows.map((row) => (
                  <Box
                    bg="panelGlassBg"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    key={row.id}
                    p="3"
                  >
                    <Flex align="center" gap="2" justify="space-between">
                      <Text color="ink.500" fontSize="xs">
                        {row.label}
                      </Text>
                      <Badge bg="successBg" borderRadius="8px" color="successText">
                        {row.status}
                      </Badge>
                    </Flex>
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      {row.value}
                    </Text>
                    <Text color="ink.500" fontSize="xs">
                      {row.scope}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </FilterCard>

            {vm.selectedSection === 'plans' || vm.selectedSection === 'favorites' ? (
              <PlansPanel returnState={returnState} vm={vm} />
            ) : null}

            {vm.selectedSection === 'quotes' ? (
              <QuotesPanel returnState={returnState} vm={vm} />
            ) : null}
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
            <FilterCard bg="panelDarkBg" borderColor="darkPanelBorder" color="white" w="100%">
              <Text
                color="darkPanelMutedText"
                fontSize="xs"
                fontWeight="800"
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
                  <Button asChild bg="white" borderRadius="8px" color="ink.900" size="sm">
                    <Link state={returnState} to={`/app/quotes/${primaryQuote.id}`}>
                      Open quote
                    </Link>
                  </Button>
                </Stack>
              ) : (
                <Text color="darkPanelText" fontSize="sm">
                  No open quote for this organization.
                </Text>
              )}
            </FilterCard>

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

            <FilterCard>
              <SectionEyebrow>Preferences</SectionEyebrow>
              <Grid gap="2" templateColumns={{ base: '1fr', md: '1fr 1fr', xl: '1fr' }}>
                {vm.preferenceRows.map((row) => (
                  <AccountFact key={row.label} label={row.label} value={row.value} />
                ))}
              </Grid>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Workspace actions</SectionEyebrow>
              <FieldHint>
                Your changes will be applied to this workspace and may take a moment.
              </FieldHint>
              <Stack align="start" gap="2">
                <preferenceFetcher.Form action="/app/actions/preferences" method="post">
                  {vm.preferenceActionFields.map((field) => (
                    <input key={field.name} name={field.name} type="hidden" value={field.value} />
                  ))}
                  <Button borderRadius="8px" size="sm" type="submit" variant="outline">
                    Save defaults
                  </Button>
                </preferenceFetcher.Form>
                {preferenceFetcher.data ? (
                  <ActionMessage response={preferenceFetcher.data} />
                ) : null}
                <contentFeedbackFetcher.Form action="/app/actions/content-feedback" method="post">
                  {vm.contentFeedbackActionFields.map((field) => (
                    <input key={field.name} name={field.name} type="hidden" value={field.value} />
                  ))}
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
          </StickyPanel>
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
