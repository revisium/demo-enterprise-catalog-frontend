import { Box, Grid } from '@chakra-ui/react';
import type { GridProps } from '@chakra-ui/react';
import { Link } from 'react-router';
import { type ReactNode } from 'react';

import { createReturnState } from 'src/shared/routing';

const focusRingStyles = {
  boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
  outline: 'none',
};

type ReturnState = ReturnType<typeof createReturnState>;

interface InteractiveListCardProps extends GridProps {
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly returnState: ReturnState;
  readonly to: string;
}

export function InteractiveListCard({
  ariaLabel,
  children,
  returnState,
  to,
  ...gridProps
}: Readonly<InteractiveListCardProps>) {
  return (
    <Grid
      cursor="pointer"
      overflow="hidden"
      position="relative"
      transition="border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease"
      _hover={{
        borderColor: 'activeBorder',
        boxShadow: '0 18px 50px rgba(16, 24, 40, 0.12)',
        transform: 'translateY(-1px)',
      }}
      {...gridProps}
    >
      <Box
        asChild
        borderRadius="8px"
        inset="0"
        position="absolute"
        zIndex="1"
        _focusVisible={focusRingStyles}
      >
        <Link aria-label={ariaLabel} state={returnState} to={to} />
      </Box>
      {children}
    </Grid>
  );
}
