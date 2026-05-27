import { Grid, Stack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { DarkFact } from '../DarkFact/DarkFact';

type DarkSummaryFactVariant = 'compact' | 'glass' | 'strong';

interface DarkSummaryMetric {
  readonly label: string;
  readonly value: ReactNode;
}

interface DarkSummaryPanelProps {
  readonly eyebrow: ReactNode;
  readonly factVariant?: DarkSummaryFactVariant;
  readonly metrics: readonly DarkSummaryMetric[];
  readonly summary: ReactNode;
  readonly value: ReactNode;
}

export function DarkSummaryPanel({
  eyebrow,
  factVariant = 'strong',
  metrics,
  summary,
  value,
}: DarkSummaryPanelProps) {
  return (
    <Stack
      bg="panelDarkBg"
      borderColor="darkPanelBorder"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      color="white"
      gap="4"
      h="100%"
      justify="space-between"
      minW="0"
      p="3"
    >
      <Stack gap="1">
        <Text color="darkPanelMutedText" fontSize="xs" fontWeight="800" textTransform="uppercase">
          {eyebrow}
        </Text>
        <Text color="white" fontSize="5xl" fontWeight="800" lineHeight="1">
          {value}
        </Text>
        <Text color="darkPanelText" fontSize="sm">
          {summary}
        </Text>
      </Stack>
      <Grid gap="2" templateColumns="repeat(2, minmax(0, 1fr))">
        {metrics.map((metric) => (
          <DarkFact
            key={metric.label}
            label={metric.label}
            value={metric.value}
            variant={factVariant}
          />
        ))}
      </Grid>
    </Stack>
  );
}
