import { Grid, Heading, Stack, Text } from '@chakra-ui/react';

interface KeyValueRow {
  readonly label: string;
  readonly value: string;
}

interface DetailRowsCardProps {
  readonly keyPrefix: string;
  readonly rows: readonly KeyValueRow[];
  readonly skipTranslation?: boolean;
  readonly title: string;
}

const sectionHeadingProps = {
  color: 'brand.500',
  fontSize: 'xs',
  fontWeight: '800',
  textTransform: 'uppercase',
} as const;

export function DetailRowsCard({
  keyPrefix,
  rows,
  skipTranslation = false,
  title,
}: DetailRowsCardProps) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      data-i18n-skip={skipTranslation ? true : undefined}
      gap="2"
      p="3"
    >
      <Heading as="h2" {...sectionHeadingProps}>
        {title}
      </Heading>
      <Stack as="dl" gap="1">
        {rows.map((row) => (
          <Grid
            as="div"
            gap="3"
            key={`${keyPrefix}-${row.label}`}
            templateColumns={{ base: '1fr', md: '180px minmax(0, 1fr)' }}
          >
            <Text as="dt" color="ink.500" fontSize="sm">
              {row.label}
            </Text>
            <Text as="dd" color="ink.900" fontSize="sm" fontWeight="700" m="0" textAlign="left">
              {row.value}
            </Text>
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
}
