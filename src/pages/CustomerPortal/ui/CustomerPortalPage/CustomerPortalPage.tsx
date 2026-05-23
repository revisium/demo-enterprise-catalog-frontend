import { Badge, Button, Flex, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { FilterButton, PrototypePage, SectionEyebrow } from 'src/shared/ui';
import { CustomerPortalPageViewModel } from '../../model/CustomerPortalPageViewModel';

export const CustomerPortalPage = observer(function CustomerPortalPage() {
  const [vm] = useState(() => new CustomerPortalPageViewModel());
  const primaryAction = vm.primaryAction;

  return (
    <PrototypePage
      asideSummary={primaryAction?.summary ?? ''}
      asideTitle={primaryAction?.title}
      eyebrow="Customer portal"
      summary="Authorized users will manage organization-specific work around stable server catalog, region, document, and price data."
      title="Manage saved plans, quotes, favorites, and API access."
    >
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="3" mt={{ base: '5', md: '6' }}>
        {vm.metrics.map((metric) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="1"
            key={metric.label}
            p="4"
          >
            <Text color="ink.900" fontSize="3xl" fontWeight="800" lineHeight="1">
              {metric.value}
            </Text>
            <Text color="ink.800" fontWeight="760">
              {metric.label}
            </Text>
            <Text color="ink.500" fontSize="sm">
              {metric.summary}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>

      <Grid gap="4" mt={{ base: '5', md: '6' }} templateColumns={{ base: '1fr', lg: '1fr 1fr' }}>
        <Stack
          bg="white"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="3"
          p="4"
        >
          <Heading as="h2" color="ink.900" fontSize="2xl">
            Active work
          </Heading>
          {vm.actions.map((action) => (
            <Stack
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="2"
              key={action.title}
              p="3"
            >
              <Flex align="center" gap="2" justify="space-between" wrap="wrap">
                <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                  {action.status}
                </Badge>
                <Text color="ink.500" fontSize="sm">
                  {action.due}
                </Text>
              </Flex>
              <Text color="ink.900" fontWeight="780">
                {action.title}
              </Text>
              <Text color="ink.600" fontSize="sm">
                {action.summary}
              </Text>
            </Stack>
          ))}
        </Stack>

        <Stack
          bg="surface.900"
          borderRadius="8px"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
          color="white"
          gap="4"
          p="4"
        >
          <Heading as="h2" fontSize="2xl">
            Backend-owned interactions
          </Heading>
          {[
            'Quote lifecycle and comments',
            'Per-user favorites and saved plans',
            'Organization members and billing profile',
            'Partner API keys and audit trail',
          ].map((item) => (
            <Text
              borderBottomColor="rgba(255,255,255,0.12)"
              borderBottomWidth="1px"
              color="darkPanelText"
              key={item}
              pb="3"
            >
              {item}
            </Text>
          ))}
        </Stack>
      </Grid>

      <Grid gap="4" mt={{ base: '5', md: '6' }} templateColumns={{ base: '1fr', lg: '320px 1fr' }}>
        <Stack
          bg="white"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="4"
          p="4"
        >
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
          <Text color="ink.500" fontSize="sm">
            Organization data, user preferences, and API access are private workspace actions.
          </Text>
        </Stack>

        {vm.selectedSection === 'plans' || vm.selectedSection === 'favorites' ? (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="4"
          >
            {vm.savedPlans.map((plan) => (
              <Grid
                alignItems="center"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={plan.id}
                p="3"
                templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 130px 112px' }}
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
          </Stack>
        ) : null}

        {vm.selectedSection === 'quotes' ? (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="4"
          >
            {vm.actions.map((action) => (
              <Stack
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="2"
                key={action.title}
                p="3"
              >
                <Flex align="center" gap="2" justify="space-between" wrap="wrap">
                  <Text color="ink.900" fontWeight="780">
                    {action.title}
                  </Text>
                  <Badge bg="surface.100" borderRadius="8px" color="ink.700">
                    {action.status}
                  </Badge>
                </Flex>
                <Text color="ink.600" fontSize="sm">
                  {action.summary}
                </Text>
              </Stack>
            ))}
          </Stack>
        ) : null}

        {vm.selectedSection === 'api' ? (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="4"
          >
            {vm.apiKeys.map((apiKey) => (
              <Grid
                alignItems="center"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                gap="3"
                key={apiKey.name}
                p="3"
                templateColumns={{ base: '1fr', md: 'minmax(0, 1fr) 120px' }}
              >
                <Stack gap="1">
                  <Text color="ink.900" fontWeight="780">
                    {apiKey.name}
                  </Text>
                  <Text color="ink.500" fontSize="sm">
                    {apiKey.scope} · last used {apiKey.lastUsed}
                  </Text>
                </Stack>
                <Badge alignSelf="start" bg="successBg" borderRadius="8px" color="successText">
                  {apiKey.status}
                </Badge>
              </Grid>
            ))}
          </Stack>
        ) : null}
      </Grid>
    </PrototypePage>
  );
});
