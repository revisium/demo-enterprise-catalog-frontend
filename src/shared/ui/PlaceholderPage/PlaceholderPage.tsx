import { Badge, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import { PrototypePage } from '../PrototypePage/PrototypePage';

interface PlaceholderPageProps {
  readonly title: string;
  readonly summary: string;
}

export function PlaceholderPage({ title, summary }: PlaceholderPageProps) {
  return (
    <PrototypePage
      asideSummary="The section is reserved in navigation and will receive typed mock data before backend integration."
      asideTitle="Prototype"
      eyebrow="Planned page"
      summary={summary}
      title={title}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="3">
        {['Typed mock data', 'Responsive layout', 'Backend contract'].map((item) => (
          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="2"
            key={item}
            p="3"
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
    </PrototypePage>
  );
}
