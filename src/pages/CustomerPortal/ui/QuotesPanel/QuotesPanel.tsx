import { Badge, Button, Grid, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';

import { createReturnState } from 'src/shared/routing';
import { FilterCard } from 'src/shared/ui';
import { CustomerPortalPageViewModel } from '../../model/CustomerPortalPageViewModel';

interface QuotesPanelProps {
  readonly returnState: ReturnType<typeof createReturnState>;
  readonly vm: CustomerPortalPageViewModel;
}

export function QuotesPanel({ returnState, vm }: QuotesPanelProps) {
  return (
    <FilterCard>
      <Stack gap="1">
        <Text color="ink.900" fontSize="2xl" fontWeight="760">
          Quote lifecycle
        </Text>
        <Text color="ink.500" fontSize="sm">
          Track customer and sales replies, quote status, monthly totals, and follow-up timing.
        </Text>
      </Stack>
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
            <Grid alignItems="center" gap="2" justifyContent="space-between" templateColumns="1fr auto">
              <Text color="ink.900" fontWeight="780">
                {quote.plan} · {quote.region}
              </Text>
              <Badge bg="surface.100" borderRadius="8px" color="ink.700">
                {quote.status}
              </Badge>
            </Grid>
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
              <Link state={returnState} to={`/app/quotes/${quote.id}`}>
                Open quote
              </Link>
            </Button>
          </Stack>
        </Grid>
      ))}
    </FilterCard>
  );
}
