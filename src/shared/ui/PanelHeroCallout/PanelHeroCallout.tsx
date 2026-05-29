import { Stack, Text, type TextProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface PanelHeroCalloutProps {
  readonly eyebrow: string;
  readonly title: ReactNode;
  readonly children?: ReactNode;
  readonly eyebrowFontSize?: TextProps['fontSize'];
  readonly titleFontSize?: TextProps['fontSize'];
}

export function PanelHeroCallout({
  eyebrow,
  title,
  children,
  eyebrowFontSize = 'xs',
  titleFontSize = '2xl',
}: PanelHeroCalloutProps) {
  return (
    <Stack
      bg="surface.900"
      borderRadius="8px"
      boxShadow="inset 0 1px 0 rgba(255,255,255,0.14)"
      color="white"
      gap="2"
      p="4"
    >
      <Text color="darkPanelMutedText" fontSize={eyebrowFontSize} fontWeight="700" textTransform="uppercase">
        {eyebrow}
      </Text>
      {typeof title === 'string' ? (
        <Text color="white" fontSize={titleFontSize} fontWeight="800" lineHeight="1.1">
          {title}
        </Text>
      ) : (
        <Stack as="span" gap="0" lineHeight="1.1">
          {title}
        </Stack>
      )}
      {children}
    </Stack>
  );
}
