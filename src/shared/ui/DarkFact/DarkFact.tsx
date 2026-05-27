import { Stack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type DarkFactVariant = 'compact' | 'glass' | 'strong';

interface DarkFactProps {
  readonly label: string;
  readonly value: ReactNode;
  readonly variant?: DarkFactVariant;
}

export function DarkFact({ label, value, variant = 'strong' }: DarkFactProps) {
  if (variant === 'glass') {
    return (
      <Stack
        bg="rgba(255,255,255,0.08)"
        borderColor="rgba(255,255,255,0.12)"
        borderRadius="8px"
        borderWidth="1px"
        gap="1"
        p="3"
      >
        <Text color="darkPanelMutedText" fontSize="xs">
          {label}
        </Text>
        <Text color="white" fontSize="sm" fontWeight="800">
          {value}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack
      bg="darkBadgeBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      gap="1"
      p={variant === 'compact' ? '2' : '3'}
    >
      <Text
        color="white"
        fontSize={variant === 'compact' ? 'lg' : '2xl'}
        fontWeight="800"
        lineHeight={variant === 'compact' ? '1.1' : '1'}
        overflowWrap="anywhere"
      >
        {value}
      </Text>
      <Text color="darkPanelMutedText" fontSize="xs">
        {label}
      </Text>
    </Stack>
  );
}
