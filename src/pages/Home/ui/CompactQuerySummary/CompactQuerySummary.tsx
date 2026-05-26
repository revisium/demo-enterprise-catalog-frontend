import { Grid, SimpleGrid, Text } from '@chakra-ui/react';

import type { HomeLabelValueRow } from '../../model/HomePageViewModel';

export function CompactQuerySummary({ rows }: { readonly rows: readonly HomeLabelValueRow[] }) {
  return (
    <SimpleGrid
      as="dl"
      borderColor="surface.200"
      borderTopWidth="1px"
      columns={{ base: 1, sm: 2 }}
      columnGap="4"
      rowGap="2"
      pt="3"
    >
      {rows.map((row) => (
        <Grid
          as="div"
          alignItems="baseline"
          columnGap="2"
          key={row.label}
          minW="0"
          templateColumns="5.75rem minmax(0, 1fr)"
        >
          <Text as="dt" color="ink.500" flexShrink="0" fontSize="xs" w="5.75rem">
            {row.label}
          </Text>
          <Text as="dd" color="ink.900" fontSize="sm" fontWeight="760" lineClamp="1" m="0">
            {row.value}
          </Text>
        </Grid>
      ))}
    </SimpleGrid>
  );
}
