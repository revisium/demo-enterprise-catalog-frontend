import { Flex, Badge } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface PortalEntityBadgesProps {
  readonly left: ReactNode;
  readonly middle: ReactNode;
  readonly right: ReactNode;
}

export function PortalEntityBadges({ left, middle, right }: PortalEntityBadgesProps) {
  return (
    <Flex gap="2" wrap="wrap">
      <Badge bg="brand.50" borderRadius="8px" color="brand.500">
        {left}
      </Badge>
      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
        {middle}
      </Badge>
      <Badge bg="successBg" borderRadius="8px" color="successText">
        {right}
      </Badge>
    </Flex>
  );
}
