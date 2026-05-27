import { Button } from '@chakra-ui/react';

interface GuideActionButtonProps {
  readonly active: boolean;
  readonly activeLabel: string;
  readonly inactiveLabel: string;
  readonly onClick: () => void;
  readonly tone: 'brand' | 'success';
}

export function GuideActionButton({
  active,
  activeLabel,
  inactiveLabel,
  onClick,
  tone,
}: GuideActionButtonProps) {
  const selectedStyles =
    tone === 'success'
      ? { bg: 'successBg', borderColor: 'successBorder', color: 'successText' }
      : { bg: 'brand.50', borderColor: 'activeBorder', color: 'brand.500' };
  const idleStyles = { bg: 'white', borderColor: 'surface.200', color: 'ink.700' };
  const styles = active ? selectedStyles : idleStyles;

  return (
    <Button
      aria-pressed={active}
      bg={styles.bg}
      borderColor={styles.borderColor}
      borderRadius="8px"
      borderWidth="1px"
      color={styles.color}
      fontWeight="760"
      onClick={onClick}
      size="sm"
      variant="outline"
      _hover={{
        bg: active ? styles.bg : 'surface.50',
        borderColor: active ? styles.borderColor : 'brandBorderMuted',
        color: active ? styles.color : 'ink.900',
      }}
    >
      {active ? activeLabel : inactiveLabel}
    </Button>
  );
}
