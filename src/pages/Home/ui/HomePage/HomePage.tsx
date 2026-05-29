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
import { NavLink, useLocation } from 'react-router';

import { useI18n } from 'src/shared/i18n';
import { createReturnState } from 'src/shared/routing';
import { BackNavButton, PageSectionSurface, StickyPanel } from 'src/shared/ui';
import { HomePageViewModel } from '../../model/HomePageViewModel';
import { CompactQuerySummary } from '../CompactQuerySummary/CompactQuerySummary';

export const HomePage = observer(function HomePage() {
  const [vm] = useState(() => new HomePageViewModel());
  const location = useLocation();
  const returnState = createReturnState(location);
  const { t } = useI18n();
  const selectedPlanCopy = vm.getSelectedPlanCopy(t);
  const selectionRows = vm.getSelectionRows(t);
  const metricRows = vm.getMetricRows(t);

  return (
    <PageSectionSurface color="ink.900" data-i18n-skip flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <BackNavButton fallbackTo="/" showOnlyWithReturnState />
        <Grid
          gap={{ base: '4', md: '5' }}
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
              {vm.getUseCaseChoiceRows(t).map((useCase) => (
                <ChoiceButton
                  active={useCase.active}
                  key={useCase.id}
                  label={useCase.label}
                  onClick={() => vm.selectUseCase(useCase.id)}
                  summary={useCase.summary}
                />
              ))}
            </Stack>

            <Stack gap={{ base: '2', lg: '1' }}>
              <SectionLabel>{t('home.dataCenter')}</SectionLabel>
              <SimpleGrid columns={2} gap={{ base: '2', lg: '1' }}>
                {vm.getRegionChoiceRows(t).map((region) => (
                  <Button
                    alignItems="stretch"
                    bg={region.active ? 'brand.50' : 'white'}
                    borderColor={region.active ? 'activeBorder' : 'surface.200'}
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
                        {region.label}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {region.availability}
                      </Text>
                    </Stack>
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>

            <Stack gap={{ base: '2', lg: '1' }}>
              <SectionLabel>{t('home.contract')}</SectionLabel>
              <SimpleGrid columns={2} gap={{ base: '2', lg: '1' }}>
                {vm.getBillingTermChoiceRows(t).map((term) => (
                  <Button
                    bg={term.active ? 'successBg' : 'white'}
                    borderColor={term.active ? 'successBorder' : 'surface.200'}
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
                        {term.label}
                      </Text>
                      <Text color="ink.500" fontSize="xs">
                        {term.summary}
                      </Text>
                    </Stack>
                  </Button>
                ))}
              </SimpleGrid>
            </Stack>
          </StickyPanel>

          <Stack gap={{ base: '4', md: '5' }}>
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
                  {vm.getSelectedPriceLabel(t)}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {vm.getSelectedSetupAvailabilityLabel(t)}
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
                  bg="transparent"
                  borderColor="darkPanelBorder"
                  borderRadius="8px"
                  color="white"
                  variant="outline"
                  _active={{
                    bg: 'darkBadgeBg',
                    borderColor: 'activeBorder',
                    color: 'white',
                  }}
                  _hover={{
                    bg: 'darkBadgeBg',
                    borderColor: 'activeBorder',
                    color: 'white',
                  }}
                >
                  <NavLink state={returnState} to={vm.quotePath}>
                    {t('home.sendQuote')}
                  </NavLink>
                </Button>
              </Stack>
            </Grid>

            <Box
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              overflow="hidden"
            >
              <MetricTable rows={metricRows} />
            </Box>

            <Stack gap={{ base: '4', md: '5' }}>
              <Stack
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                p="3"
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
                      {t('home.chooseServer')}
                    </Heading>
                  </Stack>
                  <Button asChild borderRadius="8px" size="sm" variant="outline">
                    <NavLink state={returnState} to="/catalog">
                      {t('home.browseCatalog')}
                    </NavLink>
                  </Button>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="2">
                  {vm.getSuggestedPlanRows(t).map((plan) => (
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
                          {plan.name}
                        </Text>
                        <Text color="ink.500" fontSize="sm">
                          {plan.hardwareSummary}
                        </Text>
                      </Stack>
                      <Flex align="center" justify="space-between" gap="2">
                        <Text color={plan.selected ? 'brand.500' : 'ink.700'} fontWeight="760">
                          {plan.displayPriceLabel}
                        </Text>
                        <Text color="ink.500" fontSize="xs">
                          {plan.availabilityLabel}
                        </Text>
                      </Flex>
                    </Button>
                  ))}
                </SimpleGrid>
              </Stack>

            </Stack>
          </Stack>
        </Grid>
      </Container>
    </PageSectionSurface>
  );
});

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

function MetricTable({
  rows,
}: {
  readonly rows: readonly { readonly label: string; readonly value: string }[];
}) {
  return (
    <SimpleGrid as="dl" columns={{ base: 2, md: 4 }} gap="0">
      {rows.map((row, index) => (
        <MetricCell
          hasBottomBorder={index < 2}
          hasInlineBorder={index % 2 === 0}
          hasWideInlineBorder={index < rows.length - 1}
          key={row.label}
          label={row.label}
          value={row.value}
        />
      ))}
    </SimpleGrid>
  );
}

function MetricCell({
  hasBottomBorder,
  hasInlineBorder,
  hasWideInlineBorder,
  label,
  value,
}: {
  readonly hasBottomBorder: boolean;
  readonly hasInlineBorder: boolean;
  readonly hasWideInlineBorder: boolean;
  readonly label: string;
  readonly value: string;
}) {
  return (
    <Box
      borderColor="surface.200"
      borderBottomWidth={{ base: hasBottomBorder ? '1px' : '0', md: '0' }}
      borderInlineEndWidth={{
        base: hasInlineBorder ? '1px' : '0',
        md: hasWideInlineBorder ? '1px' : '0',
      }}
      minW="0"
      p="3"
    >
      <Text as="dt" color="ink.900" fontSize="md" fontWeight="760" lineHeight="1.25">
        {value}
      </Text>
      <Text as="dd" color="ink.500" fontSize="xs" m="0">
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
