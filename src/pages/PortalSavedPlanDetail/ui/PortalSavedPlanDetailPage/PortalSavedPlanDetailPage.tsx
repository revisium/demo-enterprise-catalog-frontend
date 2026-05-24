import { Badge, Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

import { FieldHint, FilterCard, PageIntroGrid, ProductVisual, SectionEyebrow } from 'src/shared/ui';
import { PortalSavedPlanDetailPageViewModel } from '../../model/PortalSavedPlanDetailPageViewModel';

export const PortalSavedPlanDetailPage = observer(function PortalSavedPlanDetailPage() {
  const params = useParams();
  const [vm] = useState(() => new PortalSavedPlanDetailPageViewModel(params.planId));

  useEffect(() => {
    vm.setPlanId(params.planId);
  }, [params.planId, vm]);

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={{ base: '5', md: '6' }}>
          <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
            <Link to="/app">Back to portal</Link>
          </Button>

          <PageIntroGrid
            eyebrow={vm.organization.name}
            metrics={vm.metrics}
            metricsLabel="Saved plan summary"
            summary={`${vm.savedPlan.plan} in ${vm.savedPlan.region} is prepared for quote work and customer review.`}
            title={vm.savedPlan.name}
          />

          <Grid gap="4" templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 340px' }}>
            <Stack gap="4">
              <FilterCard>
                <Grid gap="4" templateColumns={{ base: '1fr', md: '120px minmax(0, 1fr)' }}>
                  <ProductVisual
                    alt={vm.product.imageAlt}
                    minH="28"
                    radius="control"
                    tone={vm.product.visualTone}
                  />
                  <Stack gap="3">
                    <Flex align="center" gap="2" wrap="wrap">
                      <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                        {vm.savedPlan.status}
                      </Badge>
                      <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
                        {vm.product.supportTier} support
                      </Badge>
                      <Badge bg="successBg" borderRadius="8px" color="successText">
                        ${vm.savedPlan.monthlyUsd}/mo
                      </Badge>
                    </Flex>
                    <Heading as="h2" color="ink.900" fontSize="2xl">
                      {vm.savedPlan.plan}
                    </Heading>
                    <Text color="ink.500" fontSize="sm">
                      {vm.product.summary}
                    </Text>
                    <Flex gap="2" wrap="wrap">
                      <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="sm">
                        <Link to={vm.quotePath}>Prepare quote</Link>
                      </Button>
                      <Button asChild borderRadius="8px" size="sm" variant="outline">
                        <Link to={vm.productPath}>Open server</Link>
                      </Button>
                      <Button
                        aria-pressed={vm.isFavorited}
                        borderRadius="8px"
                        onClick={() => vm.toggleFavorite()}
                        size="sm"
                        variant={vm.isFavorited ? 'solid' : 'outline'}
                      >
                        {vm.isFavorited ? 'Favorited' : 'Favorite'}
                      </Button>
                    </Flex>
                  </Stack>
                </Grid>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Plan package</SectionEyebrow>
                <Grid as="dl" gap="2" templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}>
                  {vm.packageRows.map((row) => (
                    <Box display="contents" key={row.label}>
                      <Text as="dt" color="ink.500">
                        {row.label}
                      </Text>
                      <Text as="dd" color="ink.900" m="0">
                        {row.value}
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Related quotes</SectionEyebrow>
                {vm.relatedQuotes.map((quote) => (
                  <Grid
                    alignItems="center"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="3"
                    key={quote.id}
                    p="3"
                    templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) auto' }}
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontWeight="760">
                        {quote.plan} · {quote.region}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {quote.status} · {quote.commentCount} comments · ${quote.monthlyUsd}/mo
                      </Text>
                    </Stack>
                    <Button asChild borderRadius="8px" size="sm" variant="outline">
                      <Link to={`/app/quotes/${quote.id}`}>Open quote</Link>
                    </Button>
                  </Grid>
                ))}
              </FilterCard>
            </Stack>

            <Stack as="aside" gap="3">
              <FilterCard>
                <SectionEyebrow>Account context</SectionEyebrow>
                <FieldHint>
                  This saved plan belongs to the selected customer organization and can be reused in
                  future quote work.
                </FieldHint>
                <Grid gap="2" templateColumns="1fr 1fr">
                  <PlanFact label="Support" value={vm.organization.supportPlan} />
                  <PlanFact label="Home region" value={vm.organization.homeRegion} />
                  <PlanFact label="Members" value={String(vm.organization.memberCount)} />
                  <PlanFact label="Billing" value={vm.organization.billingContact} />
                </Grid>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Linked pages</SectionEyebrow>
                <Flex gap="2" wrap="wrap">
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <Link to={vm.pricingPath}>Pricing</Link>
                  </Button>
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <Link to={vm.locationPath}>Region</Link>
                  </Button>
                </Flex>
              </FilterCard>

              <FilterCard>
                <SectionEyebrow>Other saved plans</SectionEyebrow>
                {vm.relatedPlans.map((plan) => (
                  <Grid
                    alignItems="center"
                    borderColor="surface.200"
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="3"
                    key={plan.id}
                    p="3"
                    templateColumns="minmax(0, 1fr) auto"
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {plan.plan} · {plan.region}
                      </Text>
                    </Stack>
                    <Button asChild borderRadius="8px" size="xs" variant="outline">
                      <Link to={`/app/plans/${plan.id}`}>Open</Link>
                    </Button>
                  </Grid>
                ))}
              </FilterCard>
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

function PlanFact({ label, value }: { readonly label: string; readonly value: string }) {
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
