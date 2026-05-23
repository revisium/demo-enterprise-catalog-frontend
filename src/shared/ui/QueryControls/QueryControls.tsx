import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
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

interface EmptyStateProps {
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly summary: string;
  readonly title: string;
}

interface MetricGridProps {
  readonly ariaLabel: string;
  readonly metrics: readonly Metric[];
}

interface PageIntroGridProps {
  readonly children?: ReactNode;
  readonly eyebrow: string;
  readonly metrics: readonly Metric[];
  readonly metricsLabel: string;
  readonly summary: string;
  readonly title: string;
}

interface SelectFieldProps {
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
      p={{ base: '4', md: '5' }}
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
        <Button borderRadius="8px" onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

export function FilterCard({ children, ...props }: Readonly<FilterCardProps>) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      gap="4"
      p="4"
      {...props}
    >
      {children}
    </Stack>
  );
}

export function MetricGrid({ ariaLabel, metrics }: MetricGridProps) {
  return (
    <SimpleGrid aria-label={ariaLabel} columns={{ base: 2, sm: 3 }} gap="2">
      {metrics.map((metric) => (
        <Box
          bg="panelGlassBg"
          borderColor="surface.200"
          borderRadius="8px"
          borderWidth="1px"
          key={metric.label}
          p="3"
        >
          <Text color="ink.900" fontSize="2xl" fontWeight="780" lineHeight="1">
            {metric.value}
          </Text>
          <Text color="ink.500" fontSize="xs">
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
  metrics,
  metricsLabel,
  summary,
  title,
}: PageIntroGridProps) {
  return (
    <Grid
      alignItems="end"
      gap={{ base: '4', md: '6' }}
      templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 360px' }}
    >
      <Stack as="header" gap="3">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <Heading as="h1" color="ink.900" fontSize={{ base: '4xl', md: '5xl' }} lineHeight="1">
          {title}
        </Heading>
        <Text color="ink.500" fontSize="md" maxW="720px">
          {summary}
        </Text>
      </Stack>

      <MetricGrid ariaLabel={metricsLabel} metrics={metrics} />
      {children ?? null}
    </Grid>
  );
}

export function SectionEyebrow({ children }: { readonly children: ReactNode }) {
  return (
    <Text color="brand.500" fontSize="xs" fontWeight="760" textTransform="uppercase">
      {children}
    </Text>
  );
}

export function FieldHint({ children }: { readonly children: ReactNode }) {
  return (
    <Text color="ink.500" fontSize="sm">
      {children}
    </Text>
  );
}

export function SelectField({ label, onChange, options, value }: SelectFieldProps) {
  return (
    <Stack as="label" gap="1.5">
      <Text color="ink.700" fontWeight="650">
        {label}
      </Text>
      <chakra.select
        bg="white"
        borderColor="surface.200"
        borderRadius="8px"
        borderWidth="1px"
        onChange={(event) => onChange(event.currentTarget.value)}
        p="2.5"
        value={value}
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
