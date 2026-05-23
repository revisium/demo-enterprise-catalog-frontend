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
  chakra,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { LocationsPageViewModel } from '../../model/LocationsPageViewModel';

export const LocationsPage = observer(function LocationsPage() {
  const [vm] = useState(() => new LocationsPageViewModel());

  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          alignItems="end"
          gap={{ base: '4', md: '6' }}
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 360px' }}
        >
          <Stack as="header" gap="3">
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Locations
            </Text>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              Choose a data-center region by stock and setup time.
            </Heading>
            <Text color="ink.500" fontSize="md" maxW="720px">
              Compare regional availability, support windows, active server families, and the latest
              plan updates before opening a quote.
            </Text>
          </Stack>

          <SimpleGrid aria-label="Location summary" columns={{ base: 2, sm: 3 }} gap="2">
            {vm.summaryMetrics.map((metric) => (
              <Box
                bg="panelGlassBg"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                key={metric.label}
                p="3"
              >
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {metric.value}
                </Text>
                <Text color="ink.500" fontSize="xs">
                  {metric.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Grid>

        <Grid
          gap="3"
          my={{ base: '5', md: '6' }}
          templateColumns={{ base: '1fr', xl: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)' }}
        >
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Server families
            </Text>
            <Flex gap="2" wrap="wrap">
              {vm.families.map((family) => {
                const selected = vm.selectedFamilyIds.includes(family.id);

                return (
                  <Button
                    bg={selected ? 'brand.50' : 'white'}
                    borderColor={selected ? 'activeBorder' : 'surface.200'}
                    borderRadius="8px"
                    borderWidth="1px"
                    color={selected ? 'brand.500' : 'ink.700'}
                    key={family.id}
                    onClick={() => vm.toggleFamily(family.id)}
                    size="sm"
                    variant="ghost"
                  >
                    {family.label}
                  </Button>
                );
              })}
            </Flex>
          </Stack>

          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="4"
            p="4"
          >
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Availability view
            </Text>
            <Grid gap="3" templateColumns={{ base: '1fr', md: '1fr 1fr' }}>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Stock
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setMinStock(event.currentTarget.value)}
                  p="2.5"
                  value={String(vm.minStock)}
                >
                  {vm.stockOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
              <Stack as="label" gap="1.5">
                <Text color="ink.700" fontWeight="650">
                  Support
                </Text>
                <chakra.select
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  onChange={(event) => vm.setSupportWindow(event.currentTarget.value)}
                  p="2.5"
                  value={vm.selectedSupportWindowId}
                >
                  {vm.supportOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </chakra.select>
              </Stack>
            </Grid>

            <Stack as="label" gap="1.5">
              <Text color="ink.700" fontWeight="650">
                Sort
              </Text>
              <chakra.select
                bg="white"
                borderColor="surface.200"
                borderRadius="8px"
                borderWidth="1px"
                onChange={(event) => vm.setSort(event.currentTarget.value)}
                p="2.5"
                value={vm.sortId}
              >
                {vm.sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </chakra.select>
            </Stack>
          </Stack>
        </Grid>

        <Stack as="section" aria-label="Data-center locations" gap="3">
          {vm.filteredLocations.map((location) => (
            <Grid
              alignItems="stretch"
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              key={location.regionId}
              p="4"
              templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 180px 180px' }}
            >
              <Stack gap="3">
                <Flex align="center" gap="2" justify="space-between" wrap="wrap">
                  <Stack gap="0">
                    <Heading as="h2" color="ink.900" fontSize="xl">
                      {location.regionLabel}
                    </Heading>
                    <Text color="ink.500" fontSize="sm">
                      {location.dataCenterCodes.join(', ')} · updated{' '}
                      {vm.formatUpdatedDate(location.latestUpdatedAt)}
                    </Text>
                  </Stack>
                  <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                    {location.plans.length} plan rows
                  </Badge>
                </Flex>

                <Flex gap="2" wrap="wrap">
                  {location.families.map((family) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={family}>
                      {family}
                    </Badge>
                  ))}
                </Flex>
              </Stack>

              <Stack gap="1">
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {location.totalStock}
                </Text>
                <Text color="ink.500" fontSize="sm">
                  units available
                </Text>
              </Stack>

              <Stack gap="1">
                <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
                  {location.fastestSetupHours}h
                </Text>
                <Text color="ink.500" fontSize="sm">
                  fastest setup · {location.supportWindows.join(', ')}
                </Text>
              </Stack>
            </Grid>
          ))}
        </Stack>
      </Container>
    </Box>
  );
});
