import { Button } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { resolveReturnPath } from 'src/shared/routing';

interface BackNavButtonProps {
  readonly ariaLabel?: string;
  readonly fallbackTo: string;
  readonly showOnlyWithReturnState?: boolean;
}

export function BackNavButton({
  ariaLabel = 'Back',
  fallbackTo,
  showOnlyWithReturnState = false,
}: BackNavButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = `${location.pathname}${location.search}${location.hash}`;
  const resolvedReturnPath = resolveReturnPath(location.state);
  const returnPath = resolvedReturnPath === currentPath ? null : resolvedReturnPath;

  const handleClick = useCallback(() => {
    if (returnPath) {
      void navigate(returnPath);
      return;
    }

    if (typeof globalThis.window !== 'undefined' && globalThis.window.history.length > 1) {
      void navigate(-1);
      return;
    }

    void navigate(fallbackTo);
  }, [fallbackTo, navigate, returnPath]);

  if (showOnlyWithReturnState && !returnPath) {
    return null;
  }

  return (
    <Button
      alignSelf="start"
      aria-label={ariaLabel}
      borderRadius="8px"
      minW="9"
      onClick={handleClick}
      px="0"
      size="sm"
      variant="outline"
    >
      ←
    </Button>
  );
}
