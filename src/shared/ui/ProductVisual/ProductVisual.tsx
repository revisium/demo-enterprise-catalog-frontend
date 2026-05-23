import { Box } from '@chakra-ui/react';

type ProductVisualTone = 'gateway' | 'sensor' | 'cloud';

interface ProductVisualProps {
  readonly alt: string;
  readonly minH?: string | number;
  readonly radius?: string;
  readonly tone: ProductVisualTone;
}

const toneBackground: Record<ProductVisualTone, string> = {
  gateway:
    'linear-gradient(135deg, rgba(31, 95, 85, 0.92), rgba(54, 72, 88, 0.82)), repeating-linear-gradient(90deg, transparent 0 30px, rgba(255, 255, 255, 0.18) 30px 32px)',
  sensor:
    'radial-gradient(circle at 32% 35%, rgba(247, 250, 247, 0.28), transparent 0 18%, transparent 20%), linear-gradient(135deg, rgba(82, 99, 72, 0.9), rgba(45, 79, 95, 0.8))',
  cloud:
    'linear-gradient(135deg, rgba(45, 79, 95, 0.9), rgba(96, 79, 130, 0.78)), repeating-linear-gradient(0deg, transparent 0 20px, rgba(255, 255, 255, 0.16) 20px 21px)',
};

export function ProductVisual({ alt, minH = '40', radius = 'panel', tone }: ProductVisualProps) {
  return (
    <Box
      aria-label={alt}
      bg={toneBackground[tone]}
      borderRadius={radius}
      minH={minH}
      overflow="hidden"
      position="relative"
      role="img"
    >
      <Box
        bg="whiteAlpha.700"
        borderRadius="full"
        bottom="32%"
        h="1.5"
        position="absolute"
        right="18%"
        w="48%"
      />
      <Box
        bg="whiteAlpha.700"
        borderRadius="full"
        bottom="46%"
        h="1.5"
        position="absolute"
        right="28%"
        w="36%"
      />
      <Box
        bg="whiteAlpha.700"
        borderRadius="full"
        bottom="27%"
        h="5"
        left="17%"
        position="absolute"
        w="5"
      />
      <Box
        bg="whiteAlpha.700"
        borderRadius="full"
        bottom="27%"
        h="5"
        left="31%"
        position="absolute"
        w="5"
      />
    </Box>
  );
}
