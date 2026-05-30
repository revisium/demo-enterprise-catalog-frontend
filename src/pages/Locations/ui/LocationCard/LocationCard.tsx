import { Badge, Box, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router';

import type { LocationsPageViewModel } from '../../model/LocationsPageViewModel';

type LocationResult = LocationsPageViewModel['filteredLocations'][number];

interface LocationCardProps {
  readonly location: LocationResult;
  readonly returnState: { readonly from: string };
  readonly vm: LocationsPageViewModel;
}

export function LocationCard({ location, returnState, vm }: LocationCardProps) {
  const mapEntries = location.plans.slice(0, 4);
  const hasMapEntries = mapEntries.length > 0;

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
        base: 'minmax(0, 1fr)',
        lg: 'minmax(0, 1fr) 244px',
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
              {location.bestValueTier} value tier
            </Badge>
            <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
              {location.plans.length} plans
            </Badge>
          </Flex>
        </Flex>

          <Flex gap="2" wrap="wrap" maxW="100%">
            {location.families.map((family) => (
              <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family}>
                {family}
              </Badge>
            ))}
        </Flex>

          <Stack borderRadius="8px" borderWidth="1px" borderColor="surface.200" gap="0" overflow="hidden">
            <Grid
              bg="surface.50"
              borderBottomColor="surface.200"
              borderBottomWidth="1px"
              gap="3"
              p="2.5"
              templateColumns="minmax(0, 1fr) 84px 76px 72px 66px"
            >
            <Text color="ink.500" fontSize="xs" fontWeight="760">
              Plan
            </Text>
            <Text color="ink.500" fontSize="xs" fontWeight="760">
              DC
            </Text>
            <Text color="ink.500" fontSize="xs" fontWeight="760">
              $/mo
            </Text>
            <Text color="ink.500" fontSize="xs" fontWeight="760">
              Value tier
            </Text>
            <Text color="ink.500" fontSize="xs" fontWeight="760">
              Stock
            </Text>
          </Grid>

          <Stack gap="0" overflow="hidden">
            {hasMapEntries ? (
              mapEntries.map((row) => (
                <Grid
                  asChild
                  alignItems="center"
                  bg={row.stock > 0 ? 'white' : 'panelGlassBg'}
                  borderBottomColor="surface.200"
                  borderBottomWidth="1px"
                  color="inherit"
                  cursor="pointer"
                  gap="3"
                  key={`${location.regionId}-${row.plan.id}`}
                  p="3"
                  textDecoration="none"
                  templateColumns="minmax(0, 1fr) 84px 76px 72px 66px"
                  transition="background 0.18s ease, border-color 0.18s ease"
                  _focusVisible={{
                    boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
                    outline: 'none',
                  }}
                  _hover={{ bg: 'brand.50' }}
                >
                  <Link state={returnState} to={row.planHref}>
                    <Stack gap="0" minW="0">
                      <Text color="ink.900" fontSize="sm" fontWeight="760" overflowWrap="anywhere">
                        {row.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
                        {row.plan.family}
                      </Text>
                    </Stack>
                    <Text color="ink.900" fontSize="sm" overflowWrap="anywhere">
                      {row.dataCenterCode}
                    </Text>
                    <Text color="ink.900" fontSize="sm" fontWeight="760">
                      ${row.effectiveMonthlyPrice}
                    </Text>
                    <Text color="ink.900" fontSize="xs" overflowWrap="anywhere">
                      {row.valueTier}
                    </Text>
                    <Text color="ink.500" fontSize="sm">
                      {row.stock}
                    </Text>
                  </Link>
                </Grid>
              ))
            ) : (
              <Grid p="3">
                <Text color="ink.500" fontSize="sm">
                  No available regional plan rows for the current filters.
                </Text>
              </Grid>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack
        asChild
        bg="panelGlassBg"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        color="inherit"
        cursor="pointer"
        gap="3"
        justify="space-between"
        p="3"
        textDecoration="none"
        transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
        _focusVisible={{
          boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
          outline: 'none',
        }}
        _hover={{
          borderColor: 'activeBorder',
          boxShadow: '0 14px 36px rgba(16, 24, 40, 0.1)',
          transform: 'translateY(-1px)',
        }}
      >
        <Link state={returnState} to={`/locations/${location.regionId}`}>
          <Text color="ink.700" fontSize="xs" fontWeight="760" minW="0" textTransform="uppercase">
            Availability map
          </Text>
          <Stack gap="2" minW="0">
            <Text color="ink.500" fontSize="xs" overflowWrap="anywhere">
              Value-tier map from top plans and stock coverage
            </Text>
            {hasMapEntries ? (
              <Grid
                gap="2"
                h="84px"
                minH="84px"
                templateColumns="repeat(4, minmax(0, 1fr))"
                templateRows="repeat(2, 1fr)"
                w="100%"
              >
              {mapEntries.map((row, index) => {
                const rowPosition = index < 2 ? 1 : 2;

                return (
                  <Flex
                    align="end"
                    key={`${location.regionId}-${row.plan.id}-dot`}
                    minH="0"
                    minW="0"
                    w="100%"
                    gap="1"
                  >
                    <Badge
                      bg={row.stock > 0 ? 'successBg' : 'amberBg'}
                      borderRadius="full"
                      color={row.stock > 0 ? 'successText' : 'amberText'}
                      fontSize="2xs"
                      justifySelf="end"
                      lineHeight="1.1"
                      maxW="100%"
                      px="2"
                      minW="0"
                      flexShrink="1"
                      textAlign="center"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {row.dataCenterCode}
                    </Badge>
                    <Box
                      bg={row.stock > 0 ? 'successBg' : 'panelGlassBg'}
                      borderRadius="9999px"
                      display={{ base: 'none', lg: 'block' }}
                      flexShrink="1"
                      flex="1"
                      minW="0"
                      h={rowPosition === 1 ? '0.6rem' : '0.85rem'}
                    />
                  </Flex>
                );
              })}
            </Grid>
            ) : (
              <Grid
                gap="2"
                templateColumns="1fr"
              >
                <Text color="ink.500" fontSize="sm">
                  No map preview is available for selected filters.
                </Text>
              </Grid>
            )}
          </Stack>
          <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))" mt="2">
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
        </Link>
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
