import { Badge, Box, Button, Flex, Grid, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';

import type { LocationDetailPageViewModel } from '../../model/LocationDetailPageViewModel';

type PlanResult = LocationDetailPageViewModel['filteredPlanRows'][number];

interface PlanRowProps {
  readonly returnState: { readonly from: string };
  readonly row: PlanResult;
  readonly vm: LocationDetailPageViewModel;
}

export function PlanRow({ returnState, row, vm }: PlanRowProps) {
  return (
    <Grid
      alignItems="center"
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      gap="3"
      minW={{ base: '680px', sm: '720px', md: '0' }}
      p="3"
      templateColumns="minmax(0, 1fr) 82px 68px 72px 78px"
      w="100%"
    >
      <Stack gap="1" minW="0">
        <Box asChild alignSelf="start" color="ink.900" fontWeight="780">
          <Link state={returnState} to={row.planHref}>
            {row.plan.name}
          </Link>
        </Box>
        <Text color="ink.500" fontSize="sm" lineHeight="1.4" minH="10" overflowWrap="anywhere">
          {row.plan.summary}
        </Text>
        <Flex gap="1.5" wrap="wrap">
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.family}
          </Badge>
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.hardware.cpuCores} cores
          </Badge>
          <Badge bg="panelGlassBg" borderRadius="8px" color="ink.700">
            {row.plan.hardware.ramGb} GB RAM
          </Badge>
        </Flex>
      </Stack>
      <Stack gap="0" minW="0">
        <Text color="ink.900" fontWeight="760">
          ${row.effectiveMonthlyPrice}/mo
        </Text>
        <Text color="ink.500" fontSize="xs">
          score {row.priceEfficiencyScore}
        </Text>
      </Stack>
      <Stack align="start" gap="1" minW="0">
        <Badge
          bg={row.stock > 0 ? 'successBg' : 'amberBg'}
          borderRadius="8px"
          color={row.stock > 0 ? 'successText' : 'amberText'}
        >
          {row.stock} units
        </Badge>
        <Text color="ink.500" fontSize="xs">
          {row.dataCenterCode}
        </Text>
      </Stack>
      <Stack gap="0" minW="0">
        <Text color="ink.900" fontWeight="700">
          {row.setupHours}h
        </Text>
        <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
          {vm.formatSupportWindow(row.supportWindow)}
        </Text>
      </Stack>
      <Stack align="stretch" gap="2" minW="0">
        <Button asChild borderRadius="8px" size="xs" variant="outline">
          <Link state={returnState} to={row.planHref}>
            Open
          </Link>
        </Button>
        <Button asChild bg="ctaBg" borderRadius="8px" color="white" size="xs">
          <Link state={returnState} to={row.quoteHref}>
            Quote
          </Link>
        </Button>
      </Stack>
    </Grid>
  );
}
