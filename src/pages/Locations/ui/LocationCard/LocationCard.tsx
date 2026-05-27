import { Badge, Button, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';

import type { LocationsPageViewModel } from '../../model/LocationsPageViewModel';

type LocationResult = LocationsPageViewModel['filteredLocations'][number];

interface LocationCardProps {
  readonly location: LocationResult;
  readonly returnState: { readonly from: string };
  readonly vm: LocationsPageViewModel;
}

export function LocationCard({ location, returnState, vm }: LocationCardProps) {
  return (
    <Grid
      alignItems="stretch"
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      gap="4"
      minW={{ base: '680px', sm: '720px', md: '0' }}
      p="3"
      templateColumns={{
        base: 'minmax(0, 1fr) 204px',
        lg: 'minmax(0, 1fr) 260px',
      }}
    >
      <Stack gap="3" minW="0">
        <Flex align="start" gap="3" justify="space-between" minW="0" wrap="wrap">
          <Stack gap="1" minW="0">
            <Heading as="h3" color="ink.900" fontSize="xl">
              <Link state={returnState} to={`/locations/${location.regionId}`}>
                {location.regionLabel}
              </Link>
            </Heading>
            <Text color="ink.500" fontSize="sm" overflowWrap="anywhere">
              {location.dataCenterCodes.join(', ')} · updated{' '}
              {vm.formatUpdatedDate(location.latestUpdatedAt)}
            </Text>
          </Stack>
          <Flex gap="2" wrap="wrap">
            <Badge bg="successBg" borderRadius="8px" color="successText">
              {location.readinessScore} readiness
            </Badge>
            <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
              {location.plans.length} plans
            </Badge>
          </Flex>
        </Flex>

        <Flex gap="2" wrap="wrap">
          {location.families.map((family) => (
            <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family}>
              {family}
            </Badge>
          ))}
        </Flex>

        <Stack
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          gap="0"
          overflow="hidden"
        >
          {location.plans.slice(0, 4).map((row) => (
            <Grid
              alignItems="center"
              bg="panelGlassBg"
              borderBottomColor="surface.200"
              borderBottomWidth="1px"
              gap="3"
              key={`${location.regionId}-${row.plan.id}`}
              p="3"
              templateColumns="minmax(0, 1fr) 84px 76px auto"
            >
              <Stack gap="0" minW="0">
                <Text color="ink.900" fontSize="sm" fontWeight="760" overflowWrap="anywhere">
                  {row.plan.name}
                </Text>
                <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                  {row.dataCenterCode} · {row.plan.family}
                </Text>
              </Stack>
              <Text color="ink.900" fontSize="sm" fontWeight="760">
                ${row.effectiveMonthlyPrice}/mo
              </Text>
              <Text color="ink.500" fontSize="sm">
                {row.stock} units
              </Text>
              <Button asChild borderRadius="8px" justifySelf="end" size="xs" variant="outline">
                <Link state={returnState} to={row.planHref}>
                  Open
                </Link>
              </Button>
            </Grid>
          ))}
        </Stack>
      </Stack>

      <Stack
        bg="panelGlassBg"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        gap="3"
        justify="space-between"
        p="3"
      >
        <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
          <LocationFact label="Stock" value={String(location.totalStock)} />
          <LocationFact label="Setup" value={`${location.fastestSetupHours}h`} />
          <LocationFact label="Families" value={`${location.familyCoveragePercent}%`} />
          <LocationFact label="Support" value={`${location.enterpriseCoveragePercent}%`} />
        </Grid>
        <Stack gap="1">
          {location.supportWindows.map((supportWindow) => (
            <Text color="ink.500" fontSize="sm" key={supportWindow}>
              {vm.formatSupportWindow(supportWindow)}
            </Text>
          ))}
        </Stack>
        <Button asChild bg="ctaBg" borderRadius="8px" color="white">
          <Link state={returnState} to={`/locations/${location.regionId}`}>
            View capacity
          </Link>
        </Button>
      </Stack>
    </Grid>
  );
}

function LocationFact({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p="2.5"
    >
      <Text color="ink.900" fontSize="xl" fontWeight="780" lineHeight="1">
        {value}
      </Text>
      <Text color="ink.500" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
