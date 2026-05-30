import {
  Box,
  Button,
  type ButtonProps,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  type BoxProps,
  type SimpleGridProps,
  type StackProps,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

interface Metric {
  readonly label: string;
  readonly value: string;
}

interface FilterButtonProps {
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly selected: boolean;
  readonly tone?: 'brand' | 'neutral' | 'success';
}

interface ChipGroupProps {
  readonly label: string;
  readonly onToggle: (id: string) => void;
  readonly options: readonly FilterOption[];
  readonly selectedIds: readonly string[];
}

interface FilterCardProps extends StackProps {
  readonly children: ReactNode;
}

interface StickyPanelProps extends StackProps {
  readonly children: ReactNode;
  readonly maxH?: StackProps['maxH'];
}

interface EmptyStateProps {
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly summary: string;
  readonly title: string;
}

interface ResetButtonProps extends ButtonProps {
  readonly children: ReactNode;
}

interface MetricGridProps {
  readonly ariaLabel: string;
  readonly columns?: SimpleGridProps['columns'];
  readonly metrics: readonly Metric[];
}

interface PageIntroGridProps {
  readonly children?: ReactNode;
  readonly eyebrow: string;
  readonly image?: PageIntroImage;
  readonly metrics: readonly Metric[];
  readonly metricsLabel: string;
  readonly summary: string;
  readonly title: string;
}

interface PageIntroImage {
  readonly alt?: string;
  readonly src: string;
}

interface PageIntroVisualProps extends Omit<BoxProps, 'children'> {
  readonly image: PageIntroImage;
}

interface SelectFieldProps {
  readonly compact?: boolean;
  readonly labelGap?: StackProps['gap'];
  readonly label: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly FilterOption[];
  readonly value: string;
}

export function FilterButton({ children, onClick, selected, tone = 'brand' }: FilterButtonProps) {
  const selectedBg = tone === 'success' ? 'successBg' : 'brand.50';
  const selectedBorder = tone === 'success' ? 'successBorder' : 'activeBorder';
  let color = 'ink.900';

  if (tone === 'brand') {
    color = selected ? 'brand.500' : 'ink.700';
  }

  return (
    <Button
      aria-pressed={selected}
      bg={selected ? selectedBg : 'white'}
      borderColor={selected ? selectedBorder : 'surface.200'}
      borderRadius="8px"
      borderWidth="1px"
      color={color}
      onClick={onClick}
      px="2"
      size="sm"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

export function ChipGroup({ label, onToggle, options, selectedIds }: ChipGroupProps) {
  return (
    <Stack gap="2">
      <Text color="ink.500" fontSize="xs" fontWeight="700" textTransform="uppercase">
        {label}
      </Text>
      <Flex gap="2" wrap="wrap">
        {options.map((option) => (
          <FilterButton
            key={option.id}
            onClick={() => onToggle(option.id)}
            selected={selectedIds.includes(option.id)}
          >
            {option.label}
          </FilterButton>
        ))}
      </Flex>
    </Stack>
  );
}

export function EmptyState({ actionLabel, onAction, summary, title }: EmptyStateProps) {
  return (
    <Stack
      align="start"
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="3"
      p="3"
    >
      <Stack gap="1">
        <Heading as="h2" color="ink.900" fontSize="xl">
          {title}
        </Heading>
        <Text color="ink.500" fontSize="sm" maxW="680px">
          {summary}
        </Text>
      </Stack>
      {onAction && actionLabel ? (
        <ResetButton onClick={onAction}>{actionLabel}</ResetButton>
      ) : null}
    </Stack>
  );
}

export function ResetButton({ children, ...props }: Readonly<ResetButtonProps>) {
  return (
    <Button
      bg="surface.200"
      borderColor="surface.200"
      borderRadius="8px"
      color="ink.900"
      _active={{
        bg: 'surface.200',
        borderColor: 'surface.200',
      }}
      _focusVisible={{
        boxShadow: '0 0 0 3px rgba(51, 65, 85, 0.2)',
        outline: 'none',
      }}
      _hover={{
        bg: 'surface.100',
        borderColor: 'surface.200',
      }}
      size="sm"
      variant="solid"
      {...props}
    >
      {children}
    </Button>
  );
}

export function FilterCard({ children, ...props }: Readonly<FilterCardProps>) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="3"
      minW="0"
      p="3"
      {...props}
    >
      {children}
    </Stack>
  );
}

export function MetricGrid({ ariaLabel, columns = { base: 2, sm: 3 }, metrics }: MetricGridProps) {
  return (
    <SimpleGrid aria-label={ariaLabel} columns={columns} gap="1.5" minW="0">
      {metrics.map((metric) => (
        <Box
          bg="panelGlassBg"
          borderColor="surface.200"
          borderRadius="6px"
          borderWidth="1px"
          key={metric.label}
          minW="0"
          p="2.5"
        >
          <Text color="ink.900" fontSize="xl" fontWeight="760" lineHeight="1">
            {metric.value}
          </Text>
          <Text color="ink.500" fontSize="xs" lineHeight="1.25">
            {metric.label}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

export function PageIntroGrid({
  children,
  eyebrow,
  image,
  metrics,
  metricsLabel,
  summary,
  title,
}: PageIntroGridProps) {
  return (
    <Grid
      alignItems="start"
      gap={{ base: '5', md: '8' }}
      pb={{ base: '2', md: '3' }}
      templateColumns={{
        base: '1fr',
        md: 'minmax(0, 1fr) minmax(260px, 320px)',
        lg: 'minmax(0, 1fr) 340px',
      }}
    >
      <Stack as="header" gap={{ base: '3', md: '4' }}>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {image ? (
          <PageIntroVisual
            display={{ base: 'block', md: 'none' }}
            image={image}
            alignSelf="center"
            maxW="clamp(280px, 78vw, 400px)"
            w="fit-content"
          />
        ) : null}
        <Heading
          as="h1"
          color="ink.900"
          fontSize={{ base: '3xl', md: '5xl' }}
          lineHeight="1"
          maxW="820px"
        >
          {title}
        </Heading>
        <Text color="ink.600" fontSize={{ base: 'sm', md: 'md' }} maxW="620px">
          {summary}
        </Text>
      </Stack>

      <Box display="none">
        <MetricGrid ariaLabel={metricsLabel} metrics={metrics} />
      </Box>
      {image ? <PageIntroVisual image={image} /> : (children ?? null)}
    </Grid>
  );
}

export function PageIntroVisual({ image, ...props }: Readonly<PageIntroVisualProps>) {
  return (
    <Box
      aria-hidden="true"
      aspectRatio="1.6"
      display={{ base: 'none', md: 'block' }}
      justifySelf="end"
      alignSelf="center"
      maxW="clamp(260px, 34vw, 380px)"
      minW="240px"
      w="100%"
      transition="all 180ms cubic-bezier(0.2, 0.8, 0.2, 1)"
      transitionProperty="max-width, width, transform"
      {...props}
    >
      <chakra.img
        alt={image.alt ?? ''}
        decoding="async"
        display="block"
        filter="drop-shadow(0 22px 34px rgba(16, 24, 40, 0.16))"
        h="100%"
        objectFit="contain"
        objectPosition="center"
        src={image.src}
        w="100%"
      />
    </Box>
  );
}

export function SectionEyebrow({ children }: { readonly children: ReactNode }) {
  return (
    <Text color="brand.500" fontSize="xs" fontWeight="800" textTransform="uppercase">
      {children}
    </Text>
  );
}

export function FieldHint({ children }: { readonly children: ReactNode }) {
  return (
    <Text color="ink.500" fontSize="sm" lineHeight="1.55">
      {children}
    </Text>
  );
}

export function StickyPanel({
  children,
  maxH = 'calc(100dvh - 96px)',
  ...props
}: Readonly<StickyPanelProps>) {
  return (
    <Stack
      alignSelf="start"
      gap="3"
      maxH={{ lg: maxH }}
      overflowY={{ lg: 'auto' }}
      overscrollBehavior="contain"
      pb={{ lg: '1' }}
      position={{ xl: 'sticky' }}
      pr={{ lg: '1' }}
      top={{ xl: '84px' }}
      {...props}
    >
      {children}
    </Stack>
  );
}

export function SelectField({
  compact = false,
  label,
  labelGap = '1.5',
  onChange,
  options,
  value,
}: SelectFieldProps) {
  return (
    <Stack as="label" gap={labelGap} minW="0" w="100%">
      <Text color="ink.700" fontWeight="650" lineHeight="1.25" overflowWrap="anywhere">
        {label}
      </Text>
      <chakra.select
        bg="white"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        fontSize={compact ? 'sm' : 'md'}
        minW="0"
        onChange={(event) => onChange(event.currentTarget.value)}
        pb={compact ? '2' : '2.5'}
        pl="2.5"
        pr={compact ? '8' : '9'}
        pt={compact ? '2' : '2.5'}
        value={value}
        w="100%"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </chakra.select>
    </Stack>
  );
}
