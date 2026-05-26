import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { NavLink } from 'react-router';

import { useI18n, type TranslationKey } from 'src/shared/i18n';
import { StickyPanel } from 'src/shared/ui';
import type {
  BillingTermId,
  RegionId,
  ServerPlan,
  ServerPlanId,
  UseCaseId,
} from '../../api/HomePageDataSource';
import { HomePageViewModel } from '../../model/HomePageViewModel';

type HomeTranslate = (key: TranslationKey) => string;

interface LabelSummaryKeys {
  readonly label: TranslationKey;
  readonly summary: TranslationKey;
}

const useCaseCopyKeys = {
  database: {
    label: 'home.useCase.database.label',
    summary: 'home.useCase.database.summary',
  },
  storage: {
    label: 'home.useCase.storage.label',
    summary: 'home.useCase.storage.summary',
  },
  testing: {
    label: 'home.useCase.testing.label',
    summary: 'home.useCase.testing.summary',
  },
  'web-app': {
    label: 'home.useCase.webApp.label',
    summary: 'home.useCase.webApp.summary',
  },
} as const satisfies Record<UseCaseId, LabelSummaryKeys>;

const regionCopyKeys = {
  'de-fra': {
    availability: 'home.region.deFra.availability',
    label: 'home.region.deFra.label',
  },
  'nl-ams': {
    availability: 'home.region.nlAms.availability',
    label: 'home.region.nlAms.label',
  },
  'sg-sin': {
    availability: 'home.region.sgSin.availability',
    label: 'home.region.sgSin.label',
  },
  'us-nyc': {
    availability: 'home.region.usNyc.availability',
    label: 'home.region.usNyc.label',
  },
} as const satisfies Record<
  RegionId,
  { readonly availability: TranslationKey; readonly label: TranslationKey }
>;

const billingTermCopyKeys = {
  monthly: {
    label: 'home.billing.monthly.label',
    summary: 'home.billing.monthly.summary',
  },
  yearly: {
    label: 'home.billing.yearly.label',
    summary: 'home.billing.yearly.summary',
  },
} as const satisfies Record<BillingTermId, LabelSummaryKeys>;

const planCopyKeys = {
  'business-vm': {
    label: 'home.plan.businessVm.name',
    summary: 'home.plan.businessVm.summary',
  },
  'database-d4': {
    label: 'home.plan.databaseD4.name',
    summary: 'home.plan.databaseD4.summary',
  },
  'dedicated-r2': {
    label: 'home.plan.dedicatedR2.name',
    summary: 'home.plan.dedicatedR2.summary',
  },
  'starter-vps': {
    label: 'home.plan.starterVps.name',
    summary: 'home.plan.starterVps.summary',
  },
  'storage-s3': {
    label: 'home.plan.storageS3.name',
    summary: 'home.plan.storageS3.summary',
  },
} as const satisfies Record<ServerPlanId, LabelSummaryKeys>;

const planSetupKeys = {
  '4 hour setup': 'home.setup.fourHours',
  'instant setup': 'home.setup.instant',
  'same day setup': 'home.setup.sameDay',
} as const satisfies Record<string, TranslationKey>;

const planAvailabilityKeys = {
  '2 units left': 'home.availability.twoUnitsLeft',
  '3 units left': 'home.availability.threeUnitsLeft',
  'Ready now': 'home.availability.readyNow',
  'Ready today': 'home.availability.readyToday',
} as const satisfies Record<string, TranslationKey>;

export const HomePage = observer(function HomePage() {
  const [vm] = useState(() => new HomePageViewModel());
  const { t } = useI18n();
  const selectedPlan = vm.selectedPlan;
  const selectedUseCaseCopy = getUseCaseCopy(vm.selectedUseCaseId, t);
  const selectedRegionCopy = getRegionCopy(vm.selectedRegionId, t);
  const selectedBillingTermCopy = getBillingTermCopy(vm.selectedBillingTermId, t);
  const selectedPlanCopy = getPlanCopy(selectedPlan.id, t);
  const selectionRows = [
    { label: t('home.need'), value: selectedUseCaseCopy.label },
    { label: t('home.region'), value: selectedRegionCopy.label },
    { label: t('home.plan'), value: selectedPlanCopy.name },
    { label: t('home.contract'), value: selectedBillingTermCopy.label },
    { label: t('home.stock'), value: getStockLabel(vm.selectedStockCount, selectedPlan, t) },
    {
      label: t('home.setup'),
      value: getSetupSummaryLabel(vm.selectedSetupLabel, selectedPlan, t),
    },
  ];

  return (
    <Box bg="pagePremiumBg" color="ink.900" data-i18n-skip flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          gap={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', lg: '344px minmax(0, 1fr)' }}
        >
          <StickyPanel
            bg="panelGlassBg"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            boxShadow="0 24px 70px rgba(16, 24, 40, 0.08)"
            gap={{ base: '5', lg: '2' }}
            maxH="none"
            overflowY={{ lg: 'visible' }}
            p={{ base: '4', md: '5', lg: '3' }}
            position="static"
            top="auto"
          >
            <Stack gap={{ base: '2', lg: '1' }}>
              <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                {t('home.commandCenter')}
              </Text>
              <Heading
                as="h1"
                fontSize={{ base: '3xl', md: '4xl', lg: '3xl' }}
                lineHeight="0.98"
              >
                {t('home.title')}
              </Heading>
              <Text color="ink.500" fontSize={{ base: 'sm', lg: 'xs' }}>
                {t('home.subtitle')}
              </Text>
            </Stack>

            <Stack gap={{ base: '2', lg: '1' }}>
              <SectionLabel>{t('home.need')}</SectionLabel>
              {vm.useCases.map((useCase) => {
                const useCaseCopy = getUseCaseCopy(useCase.id, t);

                return (
                  <ChoiceButton
                    active={vm.selectedUseCaseId === useCase.id}
                    key={useCase.id}
                    label={useCaseCopy.label}
                    onClick={() => vm.selectUseCase(useCase.id)}
                    summary={useCaseCopy.summary}
                  />
                );
              })}
            </Stack>

            <Stack gap={{ base: '2', lg: '1' }}>
              <SectionLabel>{t('home.dataCenter')}</SectionLabel>
              <SimpleGrid columns={2} gap={{ base: '2', lg: '1' }}>
                {vm.regions.map((region) => {
                  const regionCopy = getRegionCopy(region.id, t);

                  return (
                    <Button
                      alignItems="stretch"
                      bg={vm.selectedRegionId === region.id ? 'brand.50' : 'white'}
                      borderColor={
                        vm.selectedRegionId === region.id ? 'activeBorder' : 'surface.200'
                      }
                      borderRadius="8px"
                      borderWidth="1px"
                      color="ink.900"
                      h="auto"
                      justifyContent="flex-start"
                      minH={{ base: '4.25rem', lg: '2.875rem' }}
                      key={region.id}
                      onClick={() => vm.selectRegion(region.id)}
                      p="2"
                      textAlign="start"
                      variant="ghost"
                      whiteSpace="normal"
                    >
                      <Stack align="start" gap="0" minW="0" w="100%">
                        <Text fontSize="sm" fontWeight="760">
                          {regionCopy.label}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          {regionCopy.availability}
                        </Text>
                      </Stack>
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Stack>

            <Stack gap={{ base: '2', lg: '1' }}>
              <SectionLabel>{t('home.contract')}</SectionLabel>
              <SimpleGrid columns={2} gap={{ base: '2', lg: '1' }}>
                {vm.billingTerms.map((term) => {
                  const termCopy = getBillingTermCopy(term.id, t);

                  return (
                    <Button
                      bg={vm.selectedBillingTermId === term.id ? 'successBg' : 'white'}
                      borderColor={
                        vm.selectedBillingTermId === term.id ? 'successBorder' : 'surface.200'
                      }
                      borderRadius="8px"
                      borderWidth="1px"
                      color="ink.900"
                      h="auto"
                      minH={{ base: '4.25rem', lg: '2.875rem' }}
                      key={term.id}
                      onClick={() => vm.selectBillingTerm(term.id)}
                      p="2"
                      variant="ghost"
                      whiteSpace="normal"
                    >
                      <Stack align="start" gap="0" minW="0" w="100%">
                        <Text fontSize="sm" fontWeight="760">
                          {termCopy.label}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          {termCopy.summary}
                        </Text>
                      </Stack>
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Stack>
          </StickyPanel>

          <Stack gap={{ base: '5', md: '6' }}>
            <Grid
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="0 28px 90px rgba(16, 24, 40, 0.1)"
              gap={{ base: '4', md: '5' }}
              p={{ base: '4', md: '5', lg: '3' }}
              templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 260px' }}
            >
              <Stack gap="3">
                <Stack gap="3">
                  <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                    {t('home.recommendedServer')}
                  </Text>
                  <Heading as="h2" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="0.95">
                    {selectedPlanCopy.name}
                  </Heading>
                  <Text color="ink.700" fontSize="md" maxW="660px">
                    {selectedPlanCopy.summary}
                  </Text>
                </Stack>

                <CompactQuerySummary rows={selectionRows} />
              </Stack>

              <Stack
                bg="surface.900"
                borderRadius="8px"
                boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
                color="white"
                gap="3"
                p="4"
              >
                <Text
                  color="darkPanelMutedText"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  {t('home.price')}
                </Text>
                <Text fontSize="4xl" fontWeight="800" lineHeight="1">
                  {formatPrice(vm.selectedPrice, t)}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {getPlanSetupLabel(selectedPlan, t)} · {getPlanAvailabilityLabel(selectedPlan, t)}
                </Text>
                <Button
                  bg="reserveButtonBg"
                  borderRadius="8px"
                  color="ink.900"
                  disabled={!vm.canReserveServer}
                  title={t('home.reserveUnavailableTitle')}
                >
                  {t('home.reserveServer')}
                </Button>
                <Button
                  asChild
                  borderColor="darkPanelBorder"
                  borderRadius="8px"
                  color="white"
                  variant="outline"
                >
                  <NavLink to={vm.quotePath}>{t('home.sendQuote')}</NavLink>
                </Button>
              </Stack>
            </Grid>

            <Box
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              p={{ base: '4', md: '5', lg: '3' }}
            >
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: '3', md: '4' }}>
                <MetricCard
                  label={t('home.metric.cpu')}
                  value={formatHardwareValue(selectedPlan.cpu, t)}
                />
                <MetricCard label={t('home.metric.memory')} value={selectedPlan.ram} />
                <MetricCard label={t('home.metric.storage')} value={selectedPlan.storage} />
                <MetricCard label={t('home.metric.network')} value={selectedPlan.network} />
              </SimpleGrid>
            </Box>

            <Stack gap={{ base: '4', md: '5' }}>
              <Stack
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                p={{ base: '4', md: '5', lg: '3' }}
              >
                <Flex align="center" justify="space-between" gap="3" wrap="wrap">
                  <Stack gap="0">
                    <Text
                      color="brand.500"
                      fontSize="xs"
                      fontWeight="760"
                      textTransform="uppercase"
                    >
                      {t('home.matchingPlans')}
                    </Text>
                    <Heading as="h2" fontSize="xl">
                      {t('home.chooseAnotherServer')}
                    </Heading>
                  </Stack>
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <NavLink to="/catalog">{t('home.browseCatalog')}</NavLink>
                  </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="2">
                  {vm.suggestedPlanRows.map((plan) => {
                    const planCopy = getPlanCopy(plan.id, t);

                    return (
                      <Button
                        alignItems="stretch"
                        aria-pressed={plan.selected}
                        bg={plan.selected ? 'brand.50' : 'white'}
                        borderColor={plan.selected ? 'activeBorder' : 'surface.200'}
                        borderRadius="8px"
                        borderWidth="1px"
                        color="ink.900"
                        display="flex"
                        flexDirection="column"
                        gap="2"
                        h="auto"
                        justifyContent="space-between"
                        key={plan.id}
                        onClick={() => vm.selectPlan(plan.id)}
                        p="2"
                        textAlign="start"
                        variant="ghost"
                        whiteSpace="normal"
                        w="100%"
                      >
                        <Stack gap="0" minW="0">
                          <Text color="ink.900" fontWeight="760">
                            {planCopy.name}
                          </Text>
                          <Text color="ink.500" fontSize="sm">
                            {formatHardwareSummary(plan, t)}
                          </Text>
                        </Stack>
                        <Flex align="center" justify="space-between" gap="2">
                          <Text color={plan.selected ? 'brand.500' : 'ink.700'} fontWeight="760">
                            {formatPrice(plan.displayPrice, t)}
                          </Text>
                          <Text color="ink.500" fontSize="xs">
                            {getPlanAvailabilityLabel(plan, t)}
                          </Text>
                        </Flex>
                      </Button>
                    );
                  })}
                </SimpleGrid>
              </Stack>

            </Stack>
          </Stack>
        </Grid>
      </Container>
    </Box>
  );
});

function getCopy(keys: LabelSummaryKeys, t: HomeTranslate) {
  return {
    label: t(keys.label),
    summary: t(keys.summary),
  };
}

function getUseCaseCopy(id: UseCaseId, t: HomeTranslate) {
  return getCopy(useCaseCopyKeys[id], t);
}

function getRegionCopy(id: RegionId, t: HomeTranslate) {
  const keys = regionCopyKeys[id];

  return {
    availability: t(keys.availability),
    label: t(keys.label),
  };
}

function getBillingTermCopy(id: BillingTermId, t: HomeTranslate) {
  return getCopy(billingTermCopyKeys[id], t);
}

function getPlanCopy(id: ServerPlanId, t: HomeTranslate) {
  const copy = getCopy(planCopyKeys[id], t);

  return {
    name: copy.label,
    summary: copy.summary,
  };
}

function formatPrice(price: string, t: HomeTranslate) {
  return price.replace('/mo', `/${t('home.price.month')}`);
}

function formatHardwareValue(value: string, t: HomeTranslate) {
  return value.replace(' cores', ` ${t('home.unit.cores')}`);
}

function formatHardwareSummary(plan: ServerPlan, t: HomeTranslate) {
  return `${formatHardwareValue(plan.cpu, t)} · ${plan.ram} · ${plan.storage}`;
}

function getPlanSetupLabel(plan: ServerPlan, t: HomeTranslate) {
  const key = planSetupKeys[plan.setup as keyof typeof planSetupKeys];

  return key ? t(key) : plan.setup;
}

function getPlanAvailabilityLabel(plan: ServerPlan, t: HomeTranslate) {
  const key = planAvailabilityKeys[plan.availability as keyof typeof planAvailabilityKeys];

  return key ? t(key) : plan.availability;
}

function getSetupSummaryLabel(
  setupHours: number | undefined,
  plan: ServerPlan,
  t: HomeTranslate,
) {
  return typeof setupHours === 'number'
    ? `${setupHours}${t('home.setup.hourSuffix')}`
    : getPlanSetupLabel(plan, t);
}

function getStockLabel(stockCount: number | null, plan: ServerPlan, t: HomeTranslate) {
  return typeof stockCount === 'number'
    ? `${stockCount} ${t('home.units')}`
    : getPlanAvailabilityLabel(plan, t);
}

function CompactQuerySummary({
  rows,
}: {
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}) {
  return (
    <SimpleGrid
      as="dl"
      borderColor="surface.200"
      borderTopWidth="1px"
      columns={{ base: 1, sm: 2 }}
      columnGap="4"
      rowGap="2"
      pt="3"
    >
      {rows.map((row) => (
        <Grid
          as="div"
          alignItems="baseline"
          columnGap="2"
          key={row.label}
          minW="0"
          templateColumns="5.75rem minmax(0, 1fr)"
        >
          <Text as="dt" color="ink.500" flexShrink="0" fontSize="xs" w="5.75rem">
            {row.label}
          </Text>
          <Text as="dd" color="ink.900" fontSize="sm" fontWeight="760" lineClamp="1" m="0">
            {row.value}
          </Text>
        </Grid>
      ))}
    </SimpleGrid>
  );
}

function ChoiceButton({
  active,
  label,
  onClick,
  summary,
}: {
  readonly active: boolean;
  readonly label: string;
  readonly onClick: () => void;
  readonly summary: string;
}) {
  return (
    <Button
      bg={active ? 'brand.50' : 'white'}
      borderColor={active ? 'activeBorder' : 'surface.200'}
      borderRadius="8px"
      borderWidth="1px"
      color="ink.900"
      h="auto"
      minH={{ base: '4.75rem', lg: '3rem' }}
      justifyContent="flex-start"
      onClick={onClick}
      p="2"
      textAlign="start"
      variant="ghost"
      whiteSpace="normal"
      w="100%"
    >
      <Stack align="start" gap="0.5" minW="0" w="100%">
        <Text fontWeight="760" lineHeight="1.2">
          {label}
        </Text>
        <Text color="ink.500" fontSize="xs" lineHeight="1.25" overflowWrap="anywhere">
          {summary}
        </Text>
      </Stack>
    </Button>
  );
}

function MetricCard({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Box
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      minW="0"
      p="2"
    >
      <Text color="ink.900" fontSize="md" fontWeight="760" lineHeight="1.25">
        {value}
      </Text>
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
    </Box>
  );
}

function SectionLabel({ children }: { readonly children: React.ReactNode }) {
  return (
    <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
      {children}
    </Text>
  );
}
