import { Badge, Button, Grid, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import { FilterCard } from 'src/shared/ui';
import { CustomerPortalPageViewModel } from '../../model/CustomerPortalPageViewModel';

interface PlansPanelProps {
  readonly returnState: ReturnType<typeof createReturnState>;
  readonly vm: CustomerPortalPageViewModel;
}

export function PlansPanel({ returnState, vm }: PlansPanelProps) {
  const hasNoVisibleItems =
    vm.selectedSection === 'favorites'
      ? vm.visiblePlans.length === 0 && vm.favoriteItems.length === 0
      : vm.visiblePlans.length === 0;
  const emptyMessage =
    vm.selectedSection === 'favorites' ? 'No favorites yet.' : 'No saved plans yet.';
  const title = vm.selectedSection === 'favorites' ? 'Favorite saved plans' : 'Saved server plans';

  return (
    <FilterCard>
      <Stack gap="1">
        <Text color="ink.900" fontSize="2xl" fontWeight="760">
          {title}
        </Text>
        <Text color="ink.500" fontSize="sm">
          Save reusable server configurations, mark important plans, and carry a selected plan into
          the quote flow later.
        </Text>
      </Stack>
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
            <Link state={returnState} to={`/app/plans/${plan.id}`}>
              Open plan
            </Link>
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
