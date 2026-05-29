import { Stack, Text, type TextProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';

import { createReturnState } from 'src/shared/routing';
import { InteractiveListCard } from '../InteractiveListCard/InteractiveListCard';

type ReturnState = ReturnType<typeof createReturnState>;

interface LinkedSummaryCardProps {
  readonly children?: ReactNode;
  readonly returnState: ReturnState;
  readonly subtitle: string;
  readonly subtitleFontSize?: TextProps['fontSize'];
  readonly title: string;
  readonly titleFontSize?: TextProps['fontSize'];
  readonly to: string;
}

const defaultLinkProps = {
  borderColor: 'surface.200',
  borderRadius: '8px',
  borderWidth: '1px',
  cursor: 'pointer',
  gap: '3',
  p: '3',
  templateColumns: 'minmax(0, 1fr) auto',
} as const;

export function LinkedSummaryCard({
  children,
  returnState,
  subtitle,
  subtitleFontSize = 'xs',
  title,
  titleFontSize = 'sm',
  to,
}: LinkedSummaryCardProps) {
  return (
    <InteractiveListCard
      ariaLabel={`Open ${title}`}
      alignItems="center"
      {...defaultLinkProps}
      returnState={returnState}
      to={to}
    >
      <Stack gap="0">
        <Text color="ink.900" fontSize={titleFontSize} fontWeight="760">
          {title}
        </Text>
        <Text color="ink.500" fontSize={subtitleFontSize}>
          {subtitle}
        </Text>
      </Stack>
      {children}
    </InteractiveListCard>
  );
}
