import { Badge, Box, Container, Grid, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';

interface PlaceholderPageProps {
  readonly title: string;
  readonly summary: string;
}

export function PlaceholderPage({ title, summary }: PlaceholderPageProps) {
  return (
    <Box bg="pagePremiumBg" minH="calc(100dvh - 56px)">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Grid
          alignItems="stretch"
          bg="recommendationBg"
          borderColor="panelBorderStrong"
          borderRadius="8px"
          borderWidth="1px"
          boxShadow="panel"
          gap={{ base: '5', lg: '8' }}
          p={{ base: '4', md: '5' }}
          templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 320px' }}
        >
          <Stack as="header" gap="3">
            <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
              Planned page
            </Text>
            <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
              {title}
            </Heading>
            <Text color="ink.700" fontSize="md" maxW="720px">
              {summary}
            </Text>
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
              Status
            </Text>
            <Text fontSize="3xl" fontWeight="800" lineHeight="1">
              Prototype
            </Text>
            <Text color="darkPanelText" fontSize="sm">
              The section is reserved in navigation and will receive typed mock data before backend
              integration.
            </Text>
          </Stack>
        </Grid>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap="3" mt={{ base: '5', md: '6' }}>
          {['Typed mock data', 'Responsive layout', 'Backend contract'].map((item) => (
            <Stack
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="2"
              key={item}
              p="4"
            >
              <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
                Next
              </Badge>
              <Text color="ink.900" fontWeight="760">
                {item}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
