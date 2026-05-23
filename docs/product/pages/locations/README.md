# Locations

## Purpose

Show data-center regions by available stock, setup time, support window, and
server families available in each region.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family chips model OR filters over related plans;
- stock and support controls model AND filters over regional availability;
- sort covers total stock, fastest setup, plan count, region name, and latest
  related plan update;
- rows group nested availability records by region.

## Future Contract

Candidate tables: `regions`, `data_centers`, `availability_current`,
`server_plans`, `plan_hardware_links`, `sla_tiers`.
