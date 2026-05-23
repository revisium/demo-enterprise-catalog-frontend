import { Container, Heading, Stack, Text } from '@chakra-ui/react';

interface PlaceholderPageProps {
  readonly title: string;
  readonly summary: string;
}

export function PlaceholderPage({ title, summary }: PlaceholderPageProps) {
  return (
    <Container maxW="1240px" px="4" py={{ base: '8', md: '16' }}>
      <Stack as="header" gap="4">
        <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
          Planned page
        </Text>
        <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '6xl' }} lineHeight="1">
          {title}
        </Heading>
        <Text color="ink.500" fontSize="lg" maxW="720px">
          {summary}
        </Text>
      </Stack>
    </Container>
  );
}
