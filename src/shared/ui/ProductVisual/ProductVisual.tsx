import { Box } from '@chakra-ui/react';

type ProductVisualTone = 'gateway' | 'sensor' | 'cloud';

interface ProductVisualProps {
  readonly alt: string;
  readonly minH?: string | number;
  readonly radius?: string;
  readonly tone: ProductVisualTone;
}

const toneBackground: Record<ProductVisualTone, string> = {
  gateway: 'gatewayVisualBg',
  sensor: 'sensorVisualBg',
  cloud: 'cloudVisualBg',
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
