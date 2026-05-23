import { Box, Heading, List, Stack, Text } from '@chakra-ui/react';

interface ExplainerPanelProps {
  readonly title: string;
  readonly items: readonly string[];
}

export function ExplainerPanel({ title, items }: ExplainerPanelProps) {
  return (
    <Stack
      as="aside"
      bg="whiteAlpha.800"
      borderRadius="panel"
      borderWidth="1px"
      boxShadow="panel"
      gap="4"
      p="4"
    >
      <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
        Revisium source layer
      </Text>
      <Heading as="h2" color="ink.900" fontSize="2xl">
        {title}
      </Heading>
      <List.Root color="ink.500" ps="5">
        {items.map((item) => (
          <List.Item key={item}>
            <Box as="span">{item}</Box>
          </List.Item>
        ))}
      </List.Root>
    </Stack>
  );
}
