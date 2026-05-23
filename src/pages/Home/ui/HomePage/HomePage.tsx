import {
  Badge,
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

import { HomePageViewModel } from '../../model/HomePageViewModel';

export const HomePage = observer(function HomePage() {
  const [vm] = useState(() => new HomePageViewModel());
  const selectedPlan = vm.selectedPlan;

  return (
    <Box bg="pagePremiumBg" color="ink.900" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          gap={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', lg: '344px minmax(0, 1fr)' }}
        >
          <Stack
            bg="panelGlassBg"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            boxShadow="0 24px 70px rgba(16, 24, 40, 0.08)"
            gap="5"
            p={{ base: '4', md: '5' }}
          >
            <Stack gap="2">
              <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                HelioStack
              </Text>
              <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="0.98">
                Cloud server catalog
              </Heading>
              <Text color="ink.500" fontSize="sm">
                Select a use case, location, and contract. The catalog shows the best server plan
                and price.
              </Text>
            </Stack>

            <Stack gap="2">
              <SectionLabel>Need</SectionLabel>
              {vm.useCases.map((useCase) => (
                <ChoiceButton
                  active={vm.selectedUseCaseId === useCase.id}
                  key={useCase.id}
                  label={useCase.label}
                  onClick={() => vm.selectUseCase(useCase.id)}
                  summary={useCase.summary}
                />
              ))}
            </Stack>

            <Stack gap="2">
              <SectionLabel>Data center</SectionLabel>
              <SimpleGrid columns={2} gap="2">
                {vm.regions.map((region) => (
                  <Button
                    bg={vm.selectedRegionId === region.id ? 'brand.50' : 'white'}
                    borderColor={vm.selectedRegionId === region.id ? 'activeBorder' : 'surface.200'}
                    borderRadius="8px"
                    borderWidth="1px"
                    color="ink.900"
                    h="auto"
                    minH="4.25rem"
                    key={region.id}
                    onClick={() => vm.selectRegion(region.id)}
                    p="3"
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

            <Stack gap="2">
              <SectionLabel>Contract</SectionLabel>
              <SimpleGrid columns={2} gap="2">
                {vm.billingTerms.map((term) => (
                  <Button
                    bg={vm.selectedBillingTermId === term.id ? 'successBg' : 'white'}
                    borderColor={
                      vm.selectedBillingTermId === term.id ? 'successBorder' : 'surface.200'
                    }
                    borderRadius="8px"
                    borderWidth="1px"
                    color="ink.900"
                    h="auto"
                    minH="4.25rem"
                    key={term.id}
                    onClick={() => vm.selectBillingTerm(term.id)}
                    p="3"
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
          </Stack>

          <Stack gap={{ base: '5', md: '6' }}>
            <Grid
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="0 28px 90px rgba(16, 24, 40, 0.1)"
              gap={{ base: '4', md: '5' }}
              p={{ base: '4', md: '5' }}
              templateColumns={{ base: '1fr', xl: 'minmax(0, 1fr) 260px' }}
            >
              <Stack gap="5">
                <Flex gap="2" wrap="wrap">
                  <SoftBadge tone="blue">{vm.selectedUseCase.label}</SoftBadge>
                  <SoftBadge tone="amber">{vm.selectedRegion.label}</SoftBadge>
                  <SoftBadge tone="green">{vm.selectedBillingTerm.label}</SoftBadge>
                </Flex>

                <Stack gap="3">
                  <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
                    Recommended server
                  </Text>
                  <Heading as="h2" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="0.95">
                    {selectedPlan.name}
                  </Heading>
                  <Text color="ink.700" fontSize="md" maxW="660px">
                    {selectedPlan.summary}
                  </Text>
                </Stack>

                <SimpleGrid columns={{ base: 2, md: 4 }} gap="3">
                  <MetricCard label="CPU" value={selectedPlan.cpu} />
                  <MetricCard label="Memory" value={selectedPlan.ram} />
                  <MetricCard label="Storage" value={selectedPlan.storage} />
                  <MetricCard label="Network" value={selectedPlan.network} />
                </SimpleGrid>
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
                  Price
                </Text>
                <Text fontSize="4xl" fontWeight="800" lineHeight="1">
                  {vm.selectedPrice}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {selectedPlan.setup} · {selectedPlan.availability}
                </Text>
                <Button
                  bg="reserveButtonBg"
                  borderRadius="8px"
                  color="ink.900"
                  disabled={!vm.canReserveServer}
                  title="Reservation will be connected with the backend flow"
                >
                  Reserve server
                </Button>
                <Button
                  asChild
                  borderColor="darkPanelBorder"
                  borderRadius="8px"
                  color="white"
                  variant="outline"
                >
                  <NavLink to="/quote">Send quote</NavLink>
                </Button>
              </Stack>
            </Grid>

            <Grid
              gap={{ base: '5', md: '6' }}
              templateColumns={{ base: '1fr', xl: 'minmax(0, 1.35fr) 0.65fr' }}
            >
              <Stack
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                p="4"
              >
                <Flex align="center" justify="space-between" gap="3" wrap="wrap">
                  <Stack gap="0">
                    <Text
                      color="brand.500"
                      fontSize="xs"
                      fontWeight="760"
                      textTransform="uppercase"
                    >
                      Matching plans
                    </Text>
                    <Heading as="h2" fontSize="xl">
                      Choose another server
                    </Heading>
                  </Stack>
                  <Text color="ink.500" fontSize="sm">
                    {vm.selectablePlans.length}{' '}
                    {vm.hasExactPlanMatches ? 'plans match' : 'nearby plans'}
                  </Text>
                </Flex>

                <Stack gap="2">
                  {vm.planRows.map((plan) => (
                    <Button
                      alignItems="center"
                      aria-pressed={plan.selected}
                      bg={plan.selected ? 'brand.50' : 'white'}
                      borderColor={plan.selected ? 'activeBorder' : 'surface.200'}
                      borderRadius="8px"
                      borderWidth="1px"
                      color="ink.900"
                      disabled={!plan.selectable}
                      display="grid"
                      gap="3"
                      h="auto"
                      justifyContent="stretch"
                      key={plan.id}
                      opacity={plan.selectable ? 1 : 0.45}
                      onClick={() => vm.selectPlan(plan.id)}
                      p="3"
                      textAlign="left"
                      gridTemplateColumns={{ base: '1fr', md: '1fr auto' }}
                      variant="ghost"
                      whiteSpace="normal"
                      w="100%"
                    >
                      <Stack gap="0" minW="0">
                        <Text color="ink.900" fontWeight="760">
                          {plan.name}
                        </Text>
                        <Text color="ink.500" fontSize="sm">
                          {plan.cpu} · {plan.ram} · {plan.storage}
                        </Text>
                      </Stack>
                      <Text color={plan.selected ? 'brand.500' : 'ink.700'} fontWeight="760">
                        {plan.displayPrice}
                      </Text>
                    </Button>
                  ))}
                </Stack>
              </Stack>

              <Stack gap={{ base: '5', md: '6' }}>
                <InfoPanel title="Included">
                  {vm.includedItems.map((item) => (
                    <InfoRow key={item}>{item}</InfoRow>
                  ))}
                </InfoPanel>

                <InfoPanel title="Updates">
                  {vm.updates.map((item) => (
                    <Box
                      bg="panelSubtleBg"
                      borderColor="surface.200"
                      borderRadius="8px"
                      borderWidth="1px"
                      key={item.label}
                      p="3"
                    >
                      <Text color="ink.900" fontWeight="760">
                        {item.label}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {item.summary}
                      </Text>
                    </Box>
                  ))}
                </InfoPanel>
              </Stack>
            </Grid>
          </Stack>
        </Grid>
      </Container>
    </Box>
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
      minH="4.75rem"
      justifyContent="flex-start"
      onClick={onClick}
      p="3"
      textAlign="left"
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

function InfoPanel({
  children,
  title,
}: {
  readonly children: React.ReactNode;
  readonly title: string;
}) {
  return (
    <Stack bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" gap="3" p="4">
      <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
        {title}
      </Text>
      {children}
    </Stack>
  );
}

function InfoRow({ children }: { readonly children: React.ReactNode }) {
  return (
    <Box bg="panelSubtleBg" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.700" fontSize="sm">
        {children}
      </Text>
    </Box>
  );
}

function MetricCard({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Box bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" p="3">
      <Text color="ink.900" fontSize="lg" fontWeight="780">
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

function SoftBadge({
  children,
  tone,
}: {
  readonly children: React.ReactNode;
  readonly tone: 'amber' | 'blue' | 'green';
}) {
  const palette = {
    amber: { bg: 'amberBg', color: 'amberText' },
    blue: { bg: 'brand.50', color: 'brand.500' },
    green: { bg: 'successBg', color: 'successText' },
  }[tone];

  return (
    <Badge bg={palette.bg} borderRadius="8px" color={palette.color} px="2.5" py="1">
      {children}
    </Badge>
  );
}
