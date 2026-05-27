import { Heading, Stack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { SectionEyebrow } from '../QueryControls/QueryControls';

interface DetailHeroPanelProps {
  readonly actions?: ReactNode;
  readonly eyebrow: ReactNode;
  readonly summary: ReactNode;
  readonly title: ReactNode;
}

export function DetailHeroPanel({ actions, eyebrow, summary, title }: DetailHeroPanelProps) {
  return (
    <Stack
      bg="recommendationBg"
      borderColor="panelBorderStrong"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="panel"
      gap="4"
      gridColumn={{ xl: 'span 2' }}
      h="100%"
      justify="space-between"
      minW="0"
      p="3"
    >
      <Stack gap="3">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <Heading as="h1" color="ink.900" fontSize={{ base: '3xl', md: '5xl' }} lineHeight="1">
          {title}
        </Heading>
        <Text color="ink.700" fontSize="md" maxW="760px">
          {summary}
        </Text>
      </Stack>
      {actions}
    </Stack>
  );
}
