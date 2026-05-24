# Locations

## Purpose

Show data-center regions by available stock, setup time, support window, and
server families available in each region.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family chips model OR filters over related plans;
- stock and support controls model AND filters over regional availability;
- readiness filter models a computed field constraint;
- sort covers total stock, fastest setup, computed readiness score, plan count,
  region name, and latest related plan update;
- rows group nested availability records by region.

## Computed Fields

- `readinessScore` combines total regional stock, fastest setup, family coverage,
  and enterprise support coverage;
- `familyCoveragePercent` shows how much of the server family catalog is
  available in the region;
- `enterpriseCoveragePercent` shows how much of the related plan list carries
  enterprise support;
- related plan rows expose `priceEfficiencyScore` for future sorting and
  comparison.

## Related Lists

Each location row shows related server plan rows with data-center code, monthly
price, efficiency score, and a link to the server detail page.

## Future Contract

Candidate tables: `regions`, `data_centers`, `availability_current`,
`server_plans`, `plan_hardware_links`, `sla_tiers`.
