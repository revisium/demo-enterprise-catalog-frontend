# Location Detail

## Purpose

Show one data-center region as an item page with related server plans, regional
stock, setup windows, support coverage, and alternative regions.

## Current Data Mode

Typed mock data from the shared catalog snapshot, selected by `regionId` route
parameter. Unknown region IDs fall back to the first available region in the
snapshot.

## Query Shape

- route parameter models a foreign-key lookup into regional availability rows;
- family, stock, and support controls model AND filters over related server
  plan rows;
- related plan sort supports computed fields, schema fields, and system fields;
- related region list ranks alternative regions by shared families, readiness,
  and total stock.

## Computed Fields

- `readinessScore` uses the same formula as the Locations page;
- `priceEfficiencyScore` ranks related plans by hardware capacity per monthly
  price;
- `familyCoveragePercent` compares region families with all catalog families;
- `enterpriseCoveragePercent` compares Enterprise plans with all region plan
  rows.

## Related Lists

- server plans available in the selected region;
- alternative regions that share server families with the selected region;
- each related plan links to Product Detail.

## Future Contract

Candidate tables: `regions`, `data_centers`, `availability_current`,
`server_plans`, `regional_price_overrides`, `sla_tiers`.

The backend version should expose the same screen through a region item endpoint
with related server-plan edges, computed readiness fields, and sortable system
fields.
