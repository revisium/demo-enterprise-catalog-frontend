import { Badge, Stack, Text } from '@chakra-ui/react';

interface PrototypeFeatureCardProps {
  readonly label: string;
}

export function PrototypeFeatureCard({ label }: PrototypeFeatureCardProps) {
  return (
    <Stack bg="white" borderColor="surface.200" borderRadius="8px" borderWidth="1px" gap="2" p="3">
      <Badge alignSelf="start" bg="brand.50" borderRadius="8px" color="brand.500">
        Next
      </Badge>
      <Text color="ink.900" fontWeight="760">
        {label}
      </Text>
    </Stack>
  );
}
