import { Badge, Box, Button, Container, Flex, Grid, Stack, Text, chakra } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Link as RouterLink, useLocation, useSearchParams } from 'react-router';

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
import { QuotePageViewModel } from '../../model/QuotePageViewModel';

export const QuotePage = observer(function QuotePage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const planId = searchParams.get('plan');
  const regionId = searchParams.get('region');
  const term = searchParams.get('term');
  const vm = useMemo(
    () =>
      new QuotePageViewModel({
        planId,
        regionId,
        term,
      }),
    [planId, regionId, term],
  );
  const returnState = createReturnState(location);

  return (
    <Box bg="pagePremiumBg" flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <PageIntroGrid
          eyebrow="Quote request"
          metrics={vm.quoteMetrics}
          metricsLabel="Quote estimate"
          summary="Turn a selected server plan, region, quantity, billing term, and service options into a review-ready request."
          title="Prepare a server quote request"
        />

        <Grid
          alignItems="start"
          gap={{ base: '4', md: '5' }}
          mt={{ base: '4', md: '5' }}
          minW="0"
          templateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
          w="100%"
        >
          <Stack
            as="form"
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            boxShadow="panel"
            gap="4"
            gridColumn={{ xl: 'span 2' }}
            minW="0"
            onSubmit={vm.submit}
            p="3"
          >
            <Stack gap="1">
              <SectionEyebrow>Request details</SectionEyebrow>
              <FieldHint>
                Plan and region can be prefilled from catalog, compare, or pricing screens.
              </FieldHint>
            </Stack>

            <Grid gap="4" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Company
                </Text>
                <chakra.input
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onBlur={() => vm.blurCompany()}
                  onChange={(event) => vm.setCompany(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.company.value}
                  w="100%"
                />
                <Text color="red.700" fontSize="sm" minH="5">
                  {vm.form.controls.company.visibleError}
                </Text>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Work email
                </Text>
                <chakra.input
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onBlur={() => vm.blurEmail()}
                  onChange={(event) => vm.setEmail(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.email.value}
                  w="100%"
                />
                <Text color="red.700" fontSize="sm" minH="5">
                  {vm.form.controls.email.visibleError}
                </Text>
              </Stack>
            </Grid>

            <Grid gap="4" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Plan
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setInterest(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.interest.value}
                  w="100%"
                >
                  {vm.interestOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
                <Text color="red.700" fontSize="sm" minH="5">
                  {vm.form.controls.interest.visibleError}
                </Text>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Region
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setRegion(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.region.value}
                  w="100%"
                >
                  {vm.regionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
                <Text color="red.700" fontSize="sm" minH="5">
                  {vm.form.controls.region.visibleError}
                </Text>
              </Stack>
            </Grid>

            <Grid gap="4" templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Quantity
                </Text>
                <chakra.input
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  min="1"
                  onBlur={() => vm.blurQuantity()}
                  onChange={(event) => vm.setQuantity(event.currentTarget.value)}
                  p="3"
                  type="number"
                  value={vm.form.controls.quantity.value}
                  w="100%"
                />
                <Text color="red.700" fontSize="sm" minH="5">
                  {vm.form.controls.quantity.visibleError}
                </Text>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Billing term
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setBillingTerm(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.billingTerm.value}
                  w="100%"
                >
                  {vm.billingTermOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Priority
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setPriority(event.currentTarget.value)}
                  p="3"
                  value={vm.form.controls.priority.value}
                  w="100%"
                >
                  {vm.priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
            </Grid>

            {vm.selectedPlanSummary ? (
              <Stack bg="surface.50" borderRadius="8px" gap="1" p="3">
                <Text color="ink.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                  Selected plan
                </Text>
                <Text color="ink.900" fontWeight="760">
                  {vm.selectedPlanSummary}
                </Text>
                <Flex gap="2" wrap="wrap">
                  {vm.selectedPlan?.protocols.map((protocol) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={protocol}>
                      {protocol}
                    </Badge>
                  ))}
                </Flex>
                <Box asChild alignSelf="start" color="brand.500" fontSize="sm" fontWeight="760">
                  <RouterLink state={returnState} to={vm.quoteDetailHref}>
                    Open plan detail
                  </RouterLink>
                </Box>
              </Stack>
            ) : null}

            <Stack gap="2">
              <Text color="ink.700" fontWeight="650">
                Service options
              </Text>
              <Flex gap="2" wrap="wrap">
                {vm.addonOptions.map((option) => (
                  <FilterButton
                    key={option.id}
                    onClick={() => vm.toggleAddon(option.id)}
                    selected={vm.selectedAddonIds.includes(option.id)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </Flex>
              <FieldHint>
                Options are added to the estimate so the request can be reviewed before approval.
              </FieldHint>
            </Stack>

            <Button alignSelf="start" bg="ctaBg" borderRadius="8px" color="white" type="submit">
              Submit request
            </Button>
            {vm.submitted ? (
              <Stack
                bg="successBg"
                borderColor="successBorder"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                p="3"
              >
                <Text color="successText" fontWeight="700">
                  Request captured. Continue in the customer console to review the account quote.
                </Text>
                <Button alignSelf="start" asChild borderRadius="8px" size="sm" variant="outline">
                  <RouterLink state={returnState} to={vm.consoleHref}>
                    Open console
                  </RouterLink>
                </Button>
              </Stack>
            ) : null}
            {vm.submitError ? (
              <Text color="red.700" fontWeight="700">
                {vm.submitError}
              </Text>
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
            <Stack
              bg="panelDarkBg"
              borderColor="darkPanelBorder"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              color="white"
              gap="3"
              p="3"
            >
              <Text
                color="darkPanelMutedText"
                fontSize="xs"
                fontWeight="800"
                textTransform="uppercase"
              >
                Request preview
              </Text>
              {vm.payloadPreview.map((item) => (
                <Flex gap="3" justify="space-between" key={item.label}>
                  <Text color="darkPanelMutedText" fontSize="sm">
                    {item.label}
                  </Text>
                  <Text color="white" fontSize="sm" fontWeight="760" textAlign="right">
                    {item.value}
                  </Text>
                </Flex>
              ))}
            </Stack>

            <FilterCard>
              <SectionEyebrow>Commercial review</SectionEyebrow>
              <Stack gap="2">
                {vm.commercialRows.map((row) => (
                  <Flex gap="3" justify="space-between" key={row.label}>
                    <Text color="ink.500" fontSize="sm">
                      {row.label}
                    </Text>
                    <Text color="ink.900" fontSize="sm" fontWeight="760" textAlign="right">
                      {row.value}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Ready to submit</SectionEyebrow>
              <Stack gap="2">
                {vm.readinessRows.map((row) => (
                  <Grid alignItems="start" gap="3" key={row.label} templateColumns="auto 1fr">
                    <Badge
                      bg={row.ready ? 'successBg' : 'surface.100'}
                      borderRadius="8px"
                      color={row.ready ? 'successText' : 'ink.500'}
                    >
                      {row.ready ? 'Ready' : 'Open'}
                    </Badge>
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {row.label}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {row.value}
                      </Text>
                    </Stack>
                  </Grid>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Regional fit</SectionEyebrow>
              <Stack gap="2">
                {vm.fulfillmentRows.map((row) => (
                  <Grid
                    alignItems="center"
                    bg={row.active ? 'brand.50' : 'panelGlassBg'}
                    borderColor={row.active ? 'activeBorder' : 'surface.200'}
                    borderRadius="8px"
                    borderWidth="1px"
                    gap="2"
                    key={row.id}
                    p="3"
                    templateColumns="1fr auto"
                  >
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {row.label}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {row.support} · {row.setup}
                      </Text>
                    </Stack>
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {row.stock}
                    </Badge>
                  </Grid>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>Review path</SectionEyebrow>
              <Stack gap="3">
                {vm.reviewSteps.map((step) => (
                  <Grid gap="3" key={step.id} templateColumns="auto 1fr">
                    <Badge
                      bg={step.status === 'complete' ? 'successBg' : 'brand.50'}
                      borderRadius="8px"
                      color={step.status === 'next' ? 'ink.500' : 'brand.500'}
                    >
                      {step.status}
                    </Badge>
                    <Stack gap="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760">
                        {step.title}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {step.description}
                      </Text>
                    </Stack>
                  </Grid>
                ))}
              </Stack>
            </FilterCard>

            <FilterCard>
              <SectionEyebrow>After submission</SectionEyebrow>
              <Stack gap="3">
                <Text color="ink.500" fontSize="sm">
                  The authenticated console owns quote comments, saved plans, favorites, and user
                  preferences.
                </Text>
                <Button asChild borderRadius="8px" size="sm" variant="outline">
                  <RouterLink state={returnState} to={vm.consoleHref}>
                    Open console
                  </RouterLink>
                </Button>
              </Stack>
            </FilterCard>
          </StickyPanel>
        </Grid>
      </Container>
    </Box>
  );
});
