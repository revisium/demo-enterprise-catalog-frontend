import { Badge, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { PrototypePage } from 'src/shared/ui';
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
              <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                {action.status}
              </Badge>
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
    </PrototypePage>
  );
});
